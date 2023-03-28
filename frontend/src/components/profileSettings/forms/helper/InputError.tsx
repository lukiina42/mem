"use client";

const InputError = (props: {
  type:
    | "required"
    | "pattern"
    | "minLength"
    | "passwordsDifferent"
    | "exists"
    | any;
  min?: number;
  message?: string;
}) => {
  const { type, min, message } = props;
  let errorText;
  switch (type) {
    case "exists":
      errorText = message;
      break;
    case "required":
      errorText = "This field is required";
      break;
    case "minLength":
      errorText = `Insert at least ${min} characters`;
      break;
    case "pattern":
      errorText = "This email is not valid";
      break;
    case "passwordsDifferent":
      errorText = "The passwords must match";
      break;
    default:
      throw new Error("Unknown form error type");
  }
  return <p className="text-red-600">{errorText}</p>;
};

export default InputError;
