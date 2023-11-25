'use client';

import { useForm } from 'react-hook-form';
import { CgClose } from 'react-icons/cg';
import InputError from '../helper/InputError';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';
import Link from 'next/link';

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm(props: { resetMenu?: () => void }) {
  const { resetMenu } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const searchParams = useSearchParams();

  const failedLogin = searchParams?.get('authenticated') === 'false';

  const failedLoginRef = useRef(failedLogin);

  const onSubmit = async (data: any) => {
    const formData: FormData = { ...data };
    try {
      signIn('credentials', {
        callbackUrl: '/home',
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white px-8 pb-8 rounded-xl m-4 flex flex-col gap-4 pt-4 min-w-[500px] w-[500px]">
      {resetMenu !== undefined && (
        <div className="w-full flex justify-end">
          <div
            className="hover:cursor-pointer hover:bg-slate-300 p-1 rounded-full"
            onClick={() => resetMenu()}
          >
            <CgClose />
          </div>
        </div>
      )}
      <h1 className="text-center text-4xl font-semibold ">Sign in</h1>
      <form
        className="w-full m-auto flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="max-w-lg flex flex-col gap-2">
          <div>
            <label className="text-gray-600 font-medium">E-mail</label>
            <input
              className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
              type={'email'}
              autoFocus
              {...register('email', {
                //TODO better pattern
                pattern: /[@]/,
                minLength: 7,
                required: true,
              })}
            />
            {errors.email && <InputError type={errors.email.type} min={7} />}
          </div>

          <div>
            <label className="text-gray-600 font-medium">Password</label>
            <input
              className="border-solid border-gray-300 border py-2 px-4 rounded text-gray-700 min-w-full"
              type="password"
              {...register('password', {
                required: true,
              })}
            />
            {errors.password && <InputError type={errors.password.type} />}
          </div>
        </div>

        {failedLogin && <p className="text-red-500">Wrong email or password, please try again</p>}

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
          type="submit"
        >
          Submit
        </button>

        <div className='w-full flex justify-center gap-1'>Nemáte účet?<Link className='text-blue-500 hover:text-blue-700' href={"/signup"}>Zaregistrujte se!</Link></div>
      </form>
    </div>
  );
}
