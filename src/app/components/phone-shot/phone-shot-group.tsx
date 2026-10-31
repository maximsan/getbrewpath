import { cn } from '@shared/styles/cn';
import { PhoneShot } from './phone-shot';

export function PhoneShotGroup({ alt1, alt2 }: { alt1: string; alt2: string }) {
  return (
    <div
      className={cn(
        'flex items-start justify-center',
        '-mx-6 px-6 pt-8',
        'animate-[rise-in_1s_var(--ease-out-soft)_.2s_both]',
      )}
    >
      <PhoneShot
        screen="today"
        alt={alt1}
        sizes="(max-width: 800px) 44vw, 270px"
        aboveFold
        className={cn(
          'w-[min(44%,270px)] flex-none',
          'z-2',
          '-rotate-3',
          'shadow-[0_40px_70px_-24px_rgba(27,22,20,.55)]',
        )}
      />
      <PhoneShot
        screen="lesson"
        alt={alt2}
        sizes="(max-width: 800px) 39vw, 240px"
        aboveFold
        className={cn(
          'w-[min(39%,240px)] flex-none',
          'z-1 ms-[-12%] mt-[14%]',
          'rotate-3',
          'shadow-[0_30px_60px_-20px_rgba(27,22,20,.45)]',
        )}
      />
    </div>
  );
}
