import { Avatar } from '@librechat/client';

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Avatar user={{ id: 'u1', name: 'Ada Lovelace', username: 'ada' } as any} size={24} />
    <Avatar user={{ id: 'u1', name: 'Ada Lovelace', username: 'ada' } as any} size={32} />
    <Avatar user={{ id: 'u2', name: 'Grace Hopper', username: 'grace' } as any} size={48} />
  </div>
);
