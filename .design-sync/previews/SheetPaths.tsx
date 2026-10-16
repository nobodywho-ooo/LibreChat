import { FileIcon, SheetPaths } from '@librechat/client';

// Path fragment: renders inside FileIcon's tile (fill/title as upstream client/src/utils/files.ts).
export const InFileIcon = () => (
  <FileIcon fileType={{ fill: '#10A37F', paths: SheetPaths, title: 'Spreadsheet' }} />
);
