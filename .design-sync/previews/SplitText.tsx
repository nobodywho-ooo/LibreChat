import { SplitText } from '@librechat/client';

// The letters animate in on scroll; from = to keeps the static card at the final frame.
const shown = { opacity: 1, transform: 'translate3d(0,0,0)' };

export const Greeting = () => (
  <SplitText
    text="How can I help, Ada?"
    className="text-text-primary text-2xl font-medium"
    animationFrom={shown}
    animationTo={shown}
  />
);
