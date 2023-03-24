import Link from "next/link";
import React from "react";
import LoginModal from "./loginModal/LoginModal";

export default function Header() {
  return (
    <>
      <nav className="w-screen border-b-black shadow-xl h-14 flex justify-between items-center">
        <Link href="/">
          <div className="ml-4">Rettiwt</div>
        </Link>
        <LoginModal />
      </nav>
    </>
  );
}
