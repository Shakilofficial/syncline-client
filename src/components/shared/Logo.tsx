'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  iconOnly?: boolean;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

const Logo = ({
  iconOnly = false,
  className,
  width,
  height,
  priority = true,
}: LogoProps) => {
  const src = iconOnly ? '/assets/icon.png' : '/assets/syncline.png';

  const defaultWidth = iconOnly ? 32 : 130;
  const defaultHeight = iconOnly ? 32 : 36;

  return (
    <Link
      href="/"
      className={cn(
        'relative flex items-center select-none cursor-pointer',
        iconOnly ? 'justify-center' : 'justify-start',
        className
      )}
    >
      <Image
        src={src}
        alt={iconOnly ? 'Syncline Icon' : 'Syncline Logo'}
        width={width ?? defaultWidth}
        height={height ?? defaultHeight}
        className="object-contain h-auto dark:brightness-100 dark:contrast-100 dark:drop-shadow-none brightness-[0.85] contrast-[1.15] drop-shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
        style={{ height: 'auto' }}
        priority={priority}
      />
    </Link>
  );
};

export default Logo;
