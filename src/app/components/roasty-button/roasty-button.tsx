import { Roasty, type RoastyProps } from '@components/brewpath/roasty/roasty';
import { cn } from '@shared/styles/cn';

interface RoastyButtonProps extends RoastyProps {
  /** What a tap does, for screen readers. */
  label: string;
  onTap: () => void;
  className?: string;
}

/** Roasty as a button: he grows a little under a hovering pointer and dips when pressed. */
export function RoastyButton({ label, onTap, className, ...roasty }: RoastyButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onTap}
      className={cn(
        'flex cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 transition-transform duration-300 ease-soft active:scale-[.97] [@media(hover:hover)]:hover:scale-[1.035]',
        className,
      )}
    >
      <Roasty {...roasty} />
    </button>
  );
}
