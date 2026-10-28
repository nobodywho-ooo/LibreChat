import { FileIcon, TextPaths } from '@librechat/client';

// Path fragment: renders inside FileIcon's tile (fill/title as upstream client/src/utils/files.ts).
export const InFileIcon = () => (
  <FileIcon fileType={{ fill: '#FF5588', paths: TextPaths, title: 'Document' }} />
);
