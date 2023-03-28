import React from "react";
import ProfileWrapper from "../profileSettings/ProfileWrapper";
import CustomLink from "./helper/CustomLink";
import SidebarLinksWrapper from "./sidebarLinks/SidebarLinksWrapper";

export default function Header() {
  return (
    <>
      <nav className="grow shadow-xl max-h-full flex flex-col justify-between items-end">
        <div className="flex flex-col gap-5 mt-5 mr-5">
          <CustomLink href="/">
            <div className="ml-4">Rettiwt</div>
          </CustomLink>
          <SidebarLinksWrapper />
        </div>
        <div className="mr-5">
          <ProfileWrapper />
        </div>
      </nav>
    </>
  );
}
