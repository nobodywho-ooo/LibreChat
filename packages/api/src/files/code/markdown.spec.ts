import { Readable } from 'stream';
import type { CodeEnvRef } from 'librechat-data-provider';
import type { AxiosInstance } from 'axios';
import type { CodeEnvUploadResult, DocumentConversionConfig } from './markdown';
import {
  convertDocumentToMarkdown,
  createMarkdownCompanions,
  getCompanionCodeFiles,
  getMarkdownCompanionName,
  isConvertibleDocument,
} from './markdown';
import { getCompanionContextLines, getPlannedCompanionContextLine } from './priming';

const config: DocumentConversionConfig = {
  baseURL: 'http://docling:5001/',
  fileTypes: ['pdf', 'docx', 'pptx'],
  timeoutMs: 1000,
  maxFileSizeMB: 1,
};

function fakeRequest(status: number, data: unknown): { request: AxiosInstance; post: jest.Mock } {
  const post = jest.fn().mockResolvedValue({ status, data });
  return { request: { post } as unknown as AxiosInstance, post };
}

function logger() {
  return { info: jest.fn(), warn: jest.fn() };
}

async function readAll(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString('utf8');
}

const ref: CodeEnvRef = {
  kind: 'user',
  id: 'user-1',
  storage_session_id: 'session-1',
  file_id: 'file-1',
  sandboxFilename: 'report.pdf',
  companions: [
    { storage_session_id: 'session-2', file_id: 'file-2', sandboxFilename: 'report.pdf.md' },
  ],
};

describe('isConvertibleDocument', () => {
  it('matches configured extensions case-insensitively, with or without a dot', () => {
    expect(isConvertibleDocument(config, 'Report.PDF')).toBe(true);
    expect(isConvertibleDocument({ ...config, fileTypes: ['.docx'] }, 'a.docx')).toBe(true);
    expect(isConvertibleDocument(config, 'data.csv')).toBe(false);
    expect(isConvertibleDocument(config, 'pdf')).toBe(false);
  });

  it('is off without a converter', () => {
    expect(isConvertibleDocument(undefined, 'report.pdf')).toBe(false);
    expect(isConvertibleDocument({ ...config, baseURL: '' }, 'report.pdf')).toBe(false);
  });
});

describe('convertDocumentToMarkdown', () => {
  it('posts the raw file and returns the Markdown', async () => {
    const { request, post } = fakeRequest(200, { markdown: '# Title' });
    const data = Buffer.from('%PDF');
    await expect(
      convertDocumentToMarkdown({ config, data, filename: 'report.pdf', request }),
    ).resolves.toBe('# Title');
    expect(post).toHaveBeenCalledWith(
      'http://docling:5001/v1/convert',
      data,
      expect.objectContaining({
        params: { filename: 'report.pdf' },
        headers: { 'Content-Type': 'application/octet-stream' },
        timeout: 1000,
      }),
    );
  });

  it('reports the converter error', async () => {
    const { request } = fakeRequest(422, { error: 'not a PDF' });
    await expect(
      convertDocumentToMarkdown({ config, data: Buffer.from(''), filename: 'x.pdf', request }),
    ).rejects.toThrow('converter answered 422: not a PDF');
  });

  it('rejects empty Markdown', async () => {
    const { request } = fakeRequest(200, { markdown: '  \n' });
    await expect(
      convertDocumentToMarkdown({ config, data: Buffer.from(''), filename: 'x.pdf', request }),
    ).rejects.toThrow('no Markdown');
  });
});

describe('createMarkdownCompanions', () => {
  const uploaded: CodeEnvUploadResult = {
    storage_session_id: 'session-2',
    file_id: 'file-2',
    filename: 'report.pdf.md',
  };

  it('uploads the Markdown as <name>.md and returns it as a companion', async () => {
    const { request } = fakeRequest(200, { markdown: '<!-- page 1 -->\n# Title' });
    const upload = jest.fn().mockResolvedValue(uploaded);
    const result = await createMarkdownCompanions({
      config,
      sandboxFilename: 'report.pdf',
      openSource: async () => Readable.from([Buffer.from('%PDF')]),
      upload,
      logger: logger(),
      request,
    });

    expect(result).toEqual([
      { storage_session_id: 'session-2', file_id: 'file-2', sandboxFilename: 'report.pdf.md' },
    ]);
    expect(upload).toHaveBeenCalledWith(expect.any(Readable), 'report.pdf.md');
    await expect(readAll(upload.mock.calls[0][0])).resolves.toBe('<!-- page 1 -->\n# Title');
  });

  it('skips files that are not converted, without reading them', async () => {
    const openSource = jest.fn();
    const result = await createMarkdownCompanions({
      config,
      sandboxFilename: 'data.csv',
      openSource,
      upload: jest.fn(),
      logger: logger(),
    });
    expect(result).toBeUndefined();
    expect(openSource).not.toHaveBeenCalled();
  });

  it('skips files over the size limit', async () => {
    const { request, post } = fakeRequest(200, { markdown: '# Title' });
    const log = logger();
    const result = await createMarkdownCompanions({
      config: { ...config, maxFileSizeMB: 0.000001 },
      sandboxFilename: 'report.pdf',
      openSource: async () => Readable.from([Buffer.alloc(10), Buffer.alloc(10)]),
      upload: jest.fn(),
      logger: log,
      request,
    });
    expect(result).toBeUndefined();
    expect(post).not.toHaveBeenCalled();
    expect(log.info).toHaveBeenCalledWith(expect.stringContaining('larger than'));
  });

  it.each([
    ['the converter fails', fakeRequest(500, { error: 'boom' }).request, jest.fn()],
    [
      'the upload fails',
      fakeRequest(200, { markdown: '# Title' }).request,
      jest.fn().mockRejectedValue(new Error('Code API down')),
    ],
  ])('never throws when %s', async (_case, request, upload) => {
    const log = logger();
    await expect(
      createMarkdownCompanions({
        config,
        sandboxFilename: 'report.pdf',
        openSource: async () => Readable.from([Buffer.from('%PDF')]),
        upload,
        logger: log,
        request,
      }),
    ).resolves.toBeUndefined();
    expect(log.warn).toHaveBeenCalledWith(expect.stringContaining('No Markdown version'));
  });

  it('stays quiet when cancelled', async () => {
    const controller = new AbortController();
    controller.abort();
    const log = logger();
    await expect(
      createMarkdownCompanions({
        config,
        sandboxFilename: 'report.pdf',
        openSource: async () => Readable.from([Buffer.from('%PDF')]),
        upload: jest.fn(),
        logger: log,
        signal: controller.signal,
      }),
    ).resolves.toBeUndefined();
    expect(log.warn).not.toHaveBeenCalled();
  });
});

describe('companion mounts and notes', () => {
  it('mounts companions under the owner identity', () => {
    expect(getCompanionCodeFiles(ref)).toEqual([
      {
        id: 'file-2',
        resource_id: 'user-1',
        storage_session_id: 'session-2',
        name: 'report.pdf.md',
        kind: 'user',
      },
    ]);
    expect(getCompanionCodeFiles(undefined)).toEqual([]);
  });

  it('carries the skill version', () => {
    const skillRef = { ...ref, kind: 'skill', version: 3 } as CodeEnvRef;
    expect(getCompanionCodeFiles(skillRef)[0]).toMatchObject({ kind: 'skill', version: 3 });
  });

  it('never shadows a file of the same name', () => {
    const taken = new Set(['report.pdf.md']);
    expect(getCompanionCodeFiles(ref, taken)).toEqual([]);
    expect(getCompanionContextLines(ref, 'report.pdf', 'sandbox', taken)).toBe('');
  });

  it('describes companions in the note', () => {
    expect(getCompanionContextLines(ref, 'report.pdf')).toBe(
      '\n\t- /mnt/data/report.pdf.md (Markdown version of report.pdf)',
    );
    expect(getCompanionContextLines(ref, 'report.pdf', 'programmatic')).toContain(
      '$LIBRECHAT_CODE_DATA_DIR/report.pdf.md',
    );
  });

  it('announces a planned companion only for converted files', () => {
    expect(getPlannedCompanionContextLine(config, 'report.pdf')).toContain(
      '/mnt/data/report.pdf.md (Markdown version of report.pdf',
    );
    expect(getPlannedCompanionContextLine(config, 'data.csv')).toBe('');
    expect(getPlannedCompanionContextLine(undefined, 'report.pdf')).toBe('');
    expect(
      getPlannedCompanionContextLine(config, 'report.pdf', 'sandbox', new Set(['report.pdf.md'])),
    ).toBe('');
  });

  it('names the Markdown version after the sandbox file', () => {
    expect(getMarkdownCompanionName('deck.pptx')).toBe('deck.pptx.md');
  });
});
