import { ToastPosition, toast } from "react-toastify";

const defaultOptions = {
  autoClose: 7000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const displayToast = (
  title: string,
  position: ToastPosition,
  status: "success" | "error" | "info"
) => {
  switch (status) {
    case "success":
      toast.success(title, {
        position,
        ...defaultOptions,
      });
      break;
    case "error":
      toast.error(title, {
        position,
        ...defaultOptions,
      });
      break;
    case "info":
      toast.info(title, {
        position,
        ...defaultOptions,
      });
      break;
  }
};
