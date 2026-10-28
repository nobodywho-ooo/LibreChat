import { Progress } from '@librechat/client';

export const Uploading = () => (
  <div className="flex w-80 flex-col gap-2">
    <div className="text-text-primary flex justify-between text-sm">
      <span>handbook-2026.pdf</span>
      <span className="text-text-secondary">64%</span>
    </div>
    <Progress value={64} />
  </div>
);

export const Complete = () => (
  <div className="w-80">
    <Progress value={100} />
  </div>
);
