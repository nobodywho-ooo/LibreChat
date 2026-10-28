import { FileIcon, FilePaths, SheetPaths, TextPaths } from '@librechat/client';

export const FileTypes = () => (
  <div className="flex gap-3">
    <FileIcon fileType={{ fill: '#FF5588', paths: TextPaths, title: 'Document' }} />
    <FileIcon fileType={{ fill: '#10A37F', paths: SheetPaths, title: 'Spreadsheet' }} />
    <FileIcon fileType={{ fill: '#0000FF', paths: FilePaths, title: 'File' }} />
  </div>
);
