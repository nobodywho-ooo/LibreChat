import { FileIcon, FilePaths } from '@librechat/client';

// Path fragment: renders inside FileIcon's tile (fill/title as upstream client/src/utils/files.ts).
export const InFileIcon = () => (
  <FileIcon fileType={{ fill: '#0000FF', paths: FilePaths, title: 'File' }} />
);
