"use client";

import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import { useMutation } from "react-query";

import { createUser } from "@/clientApi/userApi";
import InputError from "./InputError";
import { ContextInterface } from "@/auth/AuthProvider";

interface FormData {
  email: string;
  password: string;
  username: string;
  passwordAgain: string;
}

export default function SignupForm(props: {
  resetMenu: () => void;
  auth: ContextInterface;
}) {
  const { resetMenu, auth } = props;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      resetMenu();
    },
  });

  const onSubmit = async (data: any) => {
    const formData: FormData = { ...data };
    if (formData.password !== formData.passwordAgain) {
      setError("passwordAgain", { type: "passwordsDifferent" });
      return;
    }
    createUserMutation.mutate(formData);
  };

  return (
    <div className="bg-white px-8 pb-8 rounded-xl m-4 flex flex-col gap-4 pt-4 min-w-[500px] w-[500px]">
      <div className="w-full flex justify-end">
        <div
          className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-full"
          onClick={() => resetMenu()}
        >
          <CgClose />
        </div>
      </div>
      <h1 className="text-center text-4xl font-semibold ">Sign up</h1>
      <form className="w-full m-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-lg">
          <label className="text-gray-600 font-medium">E-mail</label>
          <input
            className={`${
              errors.email && "border border-red-600"
            } border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full`}
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
            className={`${
              errors.username && "border border-red-600"
            } border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full`}
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
            className={`${
              errors.password && "border border-red-600"
            } border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full`}
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
            className={`${
              errors.passwordAgain && "border border-red-600"
            } border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full`}
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
