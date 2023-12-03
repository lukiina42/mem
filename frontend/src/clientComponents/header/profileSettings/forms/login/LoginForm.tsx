'use client';

import { useForm } from 'react-hook-form';
import { CgClose } from 'react-icons/cg';
import InputError from '../helper/InputError';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';

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

  const [errorMessage, setErrorMessage] = useState('');

  const loginMutation = useMutation({
    mutationFn: (variables: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_NEXT_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: variables.email,
          password: variables.password,
        }),
      }),
    onSuccess: (response) => {
      switch (response.status) {
        case 201:
          //router.push('/home')
          //workaround to hit middleware each time user logs in.. with router it is not hit on first visit, idk why for now
          window.location.reload();
          return;
        case 401:
          setErrorMessage('Incorrect credentials');
          return;
        case 400:
          setErrorMessage('Wrong format of credentials');
          return;
        default:
          setErrorMessage('Something went wrong, please try again');
      }
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage('Something went wrong, please try again');
    },
  });

  const onSubmit = async (data: any) => {
    const formData: FormData = { ...data };
    loginMutation.mutate(formData);
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

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-green-100 border py-3 px-6 font-semibold text-md rounded"
          type="submit"
        >
          Submit
        </button>

        <div className="w-full flex justify-center gap-1">
          Don&apos;t have an account?
          <Link className="text-blue-500 hover:text-blue-700" href={'/signup'}>
            Sign up!
          </Link>
        </div>
      </form>
    </div>
  );
}
