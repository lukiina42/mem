'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

export default function CustomLink({
  href,
  children,
  segment,
  name,
  hideTooltip,
}: {
  href: string;
  //TODO instead of children get one icon filled and one icon outlined
  children: React.ReactNode;
  name: string;
  segment: string | null;
  hideTooltip?: boolean;
}) {
  let active = href === `/${segment || ''}`;

  return (
    <Link
      href={href}
      className={`flex items-center @[200px]:justify-between justify-end gap-2 ml-4 ${
        !active && 'hover:text-blue-500'
      } transition-all duration-150 group`}
    >
      <div className={`${active && 'underline'} text-xl @[200px]:block hidden`}>
        {href == '/notifications' ? 'Notifications' : name}
      </div>
      {children}
      {!hideTooltip && (
        <span
          className={`${'notification-tooltip'} origin-left group-hover:scale-100 left-[100%] @[200px]:hidden block`}
        >
          {name}
        </span>
      )}
    </Link>
  );
}
