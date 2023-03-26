import React from "react";
import ProfileWrapper from "../profileSettings/ProfileWrapper";
import CustomLink from "./CustomLink";

export default function Header() {
  return (
    <>
      <nav className="grow shadow-xl max-h-full flex flex-col justify-between items-end first:mt-2">
        <div className="flex flex-col gap-5 mt-5 mr-5">
          <CustomLink href="/">
            <div className="ml-4">Rettiwt</div>
          </CustomLink>
          <CustomLink href="/bookmarks">
            <div className="ml-4">Bookmarks</div>
          </CustomLink>
          <CustomLink href="/notifications">
            <div className="ml-4">Notifications</div>
          </CustomLink>
        </div>
        <div className="mr-5">
          <ProfileWrapper />
        </div>
      </nav>
    </>
  );
}
