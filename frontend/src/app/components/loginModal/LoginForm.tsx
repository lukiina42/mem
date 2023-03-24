"use client";

import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import { useMutation } from "react-query";

interface FormData {
  email: string;
  password: string;
  username: string;
  passwordAgain: string;
}

export default function LoginForm(props: { setShowModal: (e: any) => void }) {
  const { setShowModal } = props;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const deleteQuizMutation = useMutation(
    (variables: { email: string; password: string; username: string }) => {
      return fetch(`http://localhost:8080/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(variables),
      })
        .then((response) => console.log(response.status))
        .catch((e) => console.log(e));
    },
    {
      onSuccess: () => {},
    }
  );

  const onSubmit = async (data: any) => {
    const formData: FormData = { ...data };
    if (formData.password !== formData.passwordAgain) {
      setError("passwordAgain", { type: "passwordsDifferent" });
      return;
    }
    deleteQuizMutation.mutate(formData);
    const fields = { fields: data };
  };

  return (
    <div className="bg-white px-8 pb-8 rounded-xl m-4 flex flex-col gap-4 pt-4">
      <div className="w-full flex justify-end">
        <div
          className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-full"
          onClick={() => setShowModal(false)}
        >
          <CgClose />
        </div>
      </div>
      <h1 className="text-center text-4xl font-semibold ">Sign up</h1>
      <form className="w-full m-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-lg">
          <label className="text-gray-600 font-medium">E-mail</label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
            type={"email"}
            autoFocus
            {...register("email", {
              //TODO better pattern
              pattern: /[@]/,
              minLength: 7,
              required: true,
            })}
          />
          {errors.email && <InputError type={errors.email.type} min={7} />}

          <label className="text-gray-600 font-medium mt-3">Username</label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
            type={"text"}
            autoFocus
            {...register("username", {
              minLength: 4,
              required: true,
            })}
          />
          {errors.username && (
            <InputError type={errors.username.type} min={4} />
          )}

          <label className="text-gray-600 font-medium mt-3">Password</label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
            type="password"
            {...register("password", {
              required: true,
              minLength: 5,
            })}
          />
          {errors.password && (
            <InputError type={errors.password.type} min={5} />
          )}

          <label className="text-gray-600 font-medium mt-4">
            Password (again)
          </label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
            type="password"
            {...register("passwordAgain", {
              required: true,
              minLength: 5,
            })}
          />
          {errors.passwordAgain && (
            <InputError type={errors.passwordAgain.type} min={5} />
          )}
        </div>

        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

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
