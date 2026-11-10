import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { linkButtonClass } from '@components/link-button/link-button';

interface LockedRewardCardProps {
  title: string;
  illustration: string;
  onRetry: () => void;
}

export function LockedRewardCard({ title, illustration, onRetry }: LockedRewardCardProps) {
  const translate = useTranslations('reward');

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-6">
      <h2 className="ff-display m-0 text-title leading-[1.1] font-normal tracking-tight text-pretty text-ink">
        {title}
      </h2>
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
      <div>
        <p className="smallcaps m-0 text-ink-mute">{translate('notYetEarned')}</p>
        <p className="ff-ui mt-2 mb-0 text-base/normal text-pretty text-ink">
          {translate('earnCard')}
        </p>
      </div>
      <button type="button" onClick={onRetry} className={linkButtonClass('accent', 'lg')}>
        {translate('tryAgain')}
      </button>
    </div>
  );
}
