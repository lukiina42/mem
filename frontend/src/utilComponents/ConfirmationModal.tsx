'use client';

interface ConfirmationModalProps {
  title: string;
  handleConfirm: () => void;
  handleCancel: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const { title, handleCancel, handleConfirm, confirmButtonText, cancelButtonText } = props;
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-[100vw]">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="bg-white px-8 pb-8 rounded-xl m-4 flex flex-col gap-4 pt-4 min-w-[500px] w-[500px]">
            <div className="flex flex-col w-full gap-4">
              <div>{title}</div>
              <div className="w-full flex justify-between">
                <button
                  className="basic-button w-fit bg-red-500 hover:bg-red-600"
                  onClick={handleConfirm}
                >
                  {confirmButtonText}
                </button>
                <button
                  className="basic-button w-fit bg-green-500 hover:bg-green-600"
                  onClick={handleCancel}
                >
                  {cancelButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-40 bg-black w-[100vw]"></div>
    </>
  );
}
