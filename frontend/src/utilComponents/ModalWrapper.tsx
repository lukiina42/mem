'use client';

import { ReactNode, useRef } from 'react';

export default function ModalWrapper({
  children,
  closeModal,
}: {
  children: ReactNode;
  closeModal: () => void;
}) {
  const clickElementRef = useRef<string | null>('modal-wrapper');
  return (
    <div
      id="modal-wrapper"
      onMouseUp={(e) => {
        if (
          e.currentTarget.id === clickElementRef.current &&
          clickElementRef.current === 'modal-wrapper'
        ) {
          closeModal();
        } else {
          clickElementRef.current = 'modal-wrapper';
        }
      }}
    >
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-[100vw]">
        <div
          onMouseUp={(e) => e.stopPropagation()}
          onMouseDown={(e) => (clickElementRef.current = 'not-modal-wrapper-xd')}
          className="relative w-auto my-6 mx-auto max-w-3xl"
        >
          {children}
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black w-[100vw]" />
    </div>
  );
}
