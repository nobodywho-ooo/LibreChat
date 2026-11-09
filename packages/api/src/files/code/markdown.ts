import * as path from 'path';
import { Readable } from 'stream';
import { DEFAULT_DOCUMENT_CONVERSION_FILE_TYPES } from 'librechat-data-provider';
import type { CodeEnvCompanion, CodeEnvRef, TCustomConfig } from 'librechat-data-provider';
import type { AxiosInstance } from 'axios';
import { getUploadedCodeEnvFilename } from './form';
import { createAxiosInstance } from '~/utils/axios';
import { isAbortError } from '~/utils/errors';

/**
 * Markdown versions of documents in the code environment.
 *
 * When a PDF, Word or PowerPoint file is uploaded to the code environment, it is also
 * sent to the configured converter (`documentConversion` in librechat.yaml), and the
 * Markdown it returns is uploaded next to it as `<name>.md`. The original's code-env ref
 * records the copy as a companion, so priming mounts both and tells the model about
 * the Markdown file. Conversion is best-effort: a failure leaves the original upload
 * as it would have been without it.
 */

export type DocumentConversionConfig = NonNullable<TCustomConfig['documentConversion']>;

/** Result of uploading one file to the Code API, as `uploadCodeEnvFile` returns it. */
export interface CodeEnvUploadResult {
  storage_session_id: string;
  file_id: string;
  filename?: string;
}

/** A code-execution file reference, as the sandbox's `files` list takes it. */
export interface CodeEnvCompanionFile {
  id: string;
  resource_id: string;
  storage_session_id: string;
  name: string;
  kind: CodeEnvRef['kind'];
  version?: number;
}

interface ConversionLogger {
  info: (message: string) => void;
  warn: (message: string) => void;
}

const megabyte = 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 900_000;
const DEFAULT_MAX_FILE_SIZE_MB = 100;

let defaultRequest: AxiosInstance | undefined;

/** Where the Markdown version of `sandboxFilename` is stored in the sandbox. */
export function getMarkdownCompanionName(sandboxFilename: string): string {
  return `${sandboxFilename}.md`;
}

/** Whether `filename` is a document the configured converter should turn into Markdown. */
export function isConvertibleDocument(
  config: DocumentConversionConfig | undefined,
  filename: string,
): config is DocumentConversionConfig {
  if (!config?.baseURL) {
    return false;
  }
  const extension = path.extname(filename).slice(1).toLowerCase();
  if (!extension) {
    return false;
  }
  const fileTypes = config.fileTypes ?? DEFAULT_DOCUMENT_CONVERSION_FILE_TYPES;
  return fileTypes.some((type) => type.replace(/^\./, '').toLowerCase() === extension);
}

/** Reads `stream` into memory, or returns `null` once it grows past `maxBytes`. */
async function readBounded(
  stream: NodeJS.ReadableStream,
  maxBytes: number,
): Promise<Buffer | null> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of stream as AsyncIterable<Buffer | string>) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
    total += buffer.length;
    if (total > maxBytes) {
      (stream as Partial<Readable>).destroy?.();
      return null;
    }
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

/** Sends a document to the converter and returns its Markdown. */
export async function convertDocumentToMarkdown({
  config,
  data,
  filename,
  signal,
  request,
}: {
  config: DocumentConversionConfig;
  data: Buffer;
  filename: string;
  signal?: AbortSignal;
  request?: AxiosInstance;
}): Promise<string> {
  if (!config.baseURL) {
    throw new Error('documentConversion.baseURL is not set');
  }
  const http = request ?? (defaultRequest ??= createAxiosInstance());
  const url = `${config.baseURL.replace(/\/+$/, '')}/v1/convert`;
  /* axios rather than fetch: undici's fetch gives up after 300 s without response headers,
   * and a large PDF can take longer than that to convert. */
  const response = await http.post<{ markdown?: unknown; error?: unknown }>(url, data, {
    params: { filename },
    headers: { 'Content-Type': 'application/octet-stream' },
    timeout: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    proxy: false,
    signal,
    validateStatus: () => true,
  });
  const body = response.data;
  if (response.status !== 200) {
    const detail = typeof body?.error === 'string' ? body.error : 'no details';
    throw new Error(`converter answered ${response.status}: ${detail}`);
  }
  if (typeof body?.markdown !== 'string' || body.markdown.trim() === '') {
    throw new Error('converter returned no Markdown');
  }
  return body.markdown;
}

/**
 * Converts the file about to be (or just) uploaded as `sandboxFilename` and uploads the
 * Markdown with `upload`. Returns the companions to store on the file's code-env ref, or
 * `undefined` when the file is not converted. Never throws: callers run this after the
 * original upload succeeded, and that upload must still reach pointer persistence, so a
 * failure or cancellation only skips the Markdown copy.
 */
export async function createMarkdownCompanions({
  config,
  sandboxFilename,
  openSource,
  upload,
  logger,
  signal,
  request,
}: {
  config: DocumentConversionConfig | undefined;
  /** Name of the original in the sandbox; the copy is stored as `<name>.md`. */
  sandboxFilename: string;
  /** Opens the original's bytes. */
  openSource: () => Promise<NodeJS.ReadableStream>;
  /** Uploads the Markdown under the original's resource identity. */
  upload: (stream: Readable, filename: string) => Promise<CodeEnvUploadResult>;
  logger: ConversionLogger;
  signal?: AbortSignal;
  request?: AxiosInstance;
}): Promise<CodeEnvCompanion[] | undefined> {
  if (!isConvertibleDocument(config, sandboxFilename)) {
    return undefined;
  }
  const maxBytes = (config.maxFileSizeMB ?? DEFAULT_MAX_FILE_SIZE_MB) * megabyte;
  const started = Date.now();
  try {
    signal?.throwIfAborted();
    const data = await readBounded(await openSource(), maxBytes);
    if (data == null) {
      logger.info(
        `[documentConversion] "${sandboxFilename}" is larger than ${maxBytes / megabyte} MB; uploaded without a Markdown version`,
      );
      return undefined;
    }
    const markdown = await convertDocumentToMarkdown({
      config,
      data,
      filename: sandboxFilename,
      signal,
      request,
    });
    const companionName = getMarkdownCompanionName(sandboxFilename);
    signal?.throwIfAborted();
    const uploaded = await upload(Readable.from([Buffer.from(markdown, 'utf8')]), companionName);
    logger.info(
      `[documentConversion] Converted "${sandboxFilename}" to Markdown in ${Date.now() - started} ms`,
    );
    return [
      {
        storage_session_id: uploaded.storage_session_id,
        file_id: uploaded.file_id,
        sandboxFilename: getUploadedCodeEnvFilename(uploaded, companionName),
      },
    ];
  } catch (error) {
    if (signal?.aborted || isAbortError(error)) {
      return undefined;
    }
    const message = error instanceof Error ? error.message : String(error);
    logger.warn(
      `[documentConversion] No Markdown version of "${sandboxFilename}" after ${Date.now() - started} ms: ${message}`,
    );
    return undefined;
  }
}

/** A ref's companions, minus any whose name a real file already takes in the sandbox. */
export function getMountableCompanions(
  ref: CodeEnvRef | undefined,
  exclude?: ReadonlySet<string>,
): CodeEnvCompanion[] {
  return (ref?.companions ?? []).filter((companion) => !exclude?.has(companion.sandboxFilename));
}

/**
 * The sandbox file references for a ref's companions, mounted next to the original.
 * `exclude` holds the names of the files being mounted: the sandbox keeps the first file
 * of a name, so a companion must not take the name of a file the user uploaded.
 */
export function getCompanionCodeFiles(
  ref: CodeEnvRef | undefined,
  exclude?: ReadonlySet<string>,
): CodeEnvCompanionFile[] {
  return getMountableCompanions(ref, exclude).map((companion) => ({
    id: companion.file_id,
    resource_id: ref!.id,
    storage_session_id: companion.storage_session_id,
    name: companion.sandboxFilename,
    kind: ref!.kind,
    ...(ref!.kind === 'skill' ? { version: ref!.version } : {}),
  }));
}
