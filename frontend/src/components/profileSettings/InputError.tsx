"use client";

const InputError = (props: {
  type: "required" | "pattern" | "minLength" | "passwordsDifferent" | any;
  min?: number;
}) => {
  const { type, min } = props;
  let errorText;
  switch (type) {
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
