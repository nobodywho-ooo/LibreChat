import { FileIcon, VideoPaths } from '@librechat/client';

// Path fragment: renders inside FileIcon's tile (fill/title as upstream client/src/utils/files.ts).
export const InFileIcon = () => (
  <FileIcon fileType={{ fill: '#8B5CF6', paths: VideoPaths, title: 'Video' }} />
);
