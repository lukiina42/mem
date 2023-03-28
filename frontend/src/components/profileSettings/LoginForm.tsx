"use client";

import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import InputError from "./InputError";

import { signIn } from "next-auth/react";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm(props: {
  resetMenu: () => void;
  redirect: (url: string) => void;
}) {
  const { resetMenu, redirect } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const formData: FormData = { ...data };
    try {
      const data = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      redirect("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white px-8 pb-8 rounded-xl m-4 flex flex-col gap-4 pt-4 min-w-[500px] w-[500px]">
      <div className="w-full flex justify-end">
        <div
          className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-full"
          onClick={() => resetMenu}
        >
          <CgClose />
        </div>
      </div>
      <h1 className="text-center text-4xl font-semibold ">Sign in</h1>
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

          <label className="text-gray-600 font-medium mt-3">Password</label>
          <input
            className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
            type="password"
            {...register("password", {
              required: true,
            })}
          />
          {errors.password && <InputError type={errors.password.type} />}
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
