import { FileIcon, CodePaths } from '@librechat/client';

// Path fragment: renders inside FileIcon's tile (fill/title as upstream client/src/utils/files.ts).
export const InFileIcon = () => (
  <FileIcon fileType={{ fill: '#FF6E3C', paths: CodePaths, title: 'Code' }} />
);
