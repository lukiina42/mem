"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export default function CustomLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  let active = href === `/${segment || ""}`;
  return (
    <Link href={href} className={active ? "bg-blue-300" : "bg-white"}>
      {children}
    </Link>
  );
}
