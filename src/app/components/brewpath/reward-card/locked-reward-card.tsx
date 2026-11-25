import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface LockedRewardCardProps {
  title: string;
  illustration?: string;
  onRetry: () => void;
}

export function LockedRewardCard({ title, illustration, onRetry }: LockedRewardCardProps) {
  const translate = useTranslations('reward');

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div
        role="region"
        aria-label={title}
        tabIndex={0}
        className="flex min-h-0 flex-1 scrollbar-none flex-col gap-6 overflow-y-auto px-1 pt-1 pb-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <h2 className="ff-display m-0 text-title leading-[1.1] font-normal tracking-tight text-pretty text-ink">
          {title}
        </h2>
        {illustration && (
          <div className="flex aspect-video items-center justify-center rounded-xs bg-surface-2">
            <Image
              src={illustration}
              alt={translate('illustration', { title })}
              width={195}
              height={195}
              unoptimized
              className="block h-auto w-36 opacity-40 saturate-[.4]"
            />
          </div>
        )}
        <div>
          <p className="smallcaps m-0 text-ink-mute">{translate('notYetEarned')}</p>
          <p className="ff-ui mt-2 mb-0 text-base/normal text-pretty text-ink">
            {translate('earnCard')}
          </p>
        </div>
      </div>
      <button type="button" onClick={onRetry} className="btn btn-primary mt-3 shrink-0">
        {translate('tryAgain')}
      </button>
    </div>
  );
}
