import { IconButton } from '@librechat/client';
import { Copy, RotateCcw, Trash2 } from 'lucide-react';

export const Variants = () => (
  <div className="flex items-center gap-3">
    <IconButton label="Copy">
      <Copy className="h-4 w-4" />
    </IconButton>
    <IconButton label="Regenerate" variant="secondary">
      <RotateCcw className="h-4 w-4" />
    </IconButton>
    <IconButton label="Delete" variant="destructive">
      <Trash2 className="h-4 w-4" />
    </IconButton>
    <IconButton label="Copy" variant="ghost">
      <Copy className="h-4 w-4" />
    </IconButton>
  </div>
);

export const Shapes = () => (
  <div className="flex items-center gap-3">
    <IconButton label="Copy" shape="square">
      <Copy className="h-4 w-4" />
    </IconButton>
    <IconButton label="Copy" shape="round">
      <Copy className="h-4 w-4" />
    </IconButton>
    <IconButton label="Copy" size="lg">
      <Copy className="h-5 w-5" />
    </IconButton>
  </div>
);
