"use client";

import { ReactNode } from "react";

export default function ModalWrapper({
  children,
  closeModal,
}: {
  children: ReactNode;
  closeModal: () => void;
}) {
  return (
    <div
      onClick={() => {
        closeModal();
      }}
    >
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-[100vw]">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-auto my-6 mx-auto max-w-3xl"
        >
          {children}
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black w-[100vw]" />
    </div>
  );
}
