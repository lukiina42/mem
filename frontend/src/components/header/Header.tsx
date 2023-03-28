import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileWrapper from "../profileSettings/ProfileWrapper";
import CustomLink from "./helper/CustomLink";
import SidebarLinksWrapper from "./sidebarLinks/SidebarLinksWrapper";

export default function Header() {
  return (
    <>
      <nav className="grow shadow-xl max-h-full flex flex-col justify-start items-end @container min-w-[84px] gap-12">
        <div className="flex flex-col gap-5 mt-5 mr-5">
          <Link href="/">
            <div className="ml-4 w-full flex justify-center">
              <Image src="/logo.png" width={56} height={56} alt="logo" />
            </div>
          </Link>
          <SidebarLinksWrapper />
        </div>
      </nav>
    </>
  );
}
