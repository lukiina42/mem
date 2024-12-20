'use client';

import React, { useState } from 'react';

import { ImFilePicture } from 'react-icons/im';
import { GrClose } from 'react-icons/gr';
import { createMem } from '@/clientApiCalls/memApi';
import LoadingSpinner from '@/utilComponents/Loading';
import { displayToast } from '@/utilComponents/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/types/queryKeys';
import { SessionUser } from '@/app/api/login/route';
import { useRouter } from 'next/navigation';
import {BeatLoader} from "react-spinners";

type Props = {
  userData: SessionUser;
  revalidateMems: () => Promise<void>
}

export default function NewTweetForm({ userData, revalidateMems }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [inputContent, setInputContent] = useState('');
  const [error, setError] = useState(false);

  const queryClient = useQueryClient();

  const fileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      error && setError(false);
      event.target.files[0] && setFile(event.target.files[0]);
    }
  };

  const createMemMutation = useMutation({
    mutationFn: createMem,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: [...QueryKeys.memsPaginationQueryKey, '/'] });
      await queryClient.invalidateQueries({
        queryKey: [...QueryKeys.memsPaginationQueryKey, '/home/newest'],
      });
      displayToast('You successfully memd', 'bottom-center', 'success');
      setFile(null);
      setInputContent('');
    },
    onError: () => {
      displayToast('Something went wrong, please try again', 'bottom-center', 'error');
    },
  });

  const handleContentInputChange = (text: string) => {
    error && setError(false);
    setInputContent(text);
  };

  const loading = createMemMutation.isPending;

  const onSubmit = async () => {
    if (!inputContent && !file) {
      setError(true);
      return;
    }
    createMemMutation.mutate({
      content: inputContent,
      image: file,
      userEmail: userData.user.email as string,
      token: userData.token,
    });
    await revalidateMems()
  };

  return (
    <div className="h-fit w-full flex justify-center items-center">
      <div className="relative flex flex-col h-full w-[90%] pb-1 z-0">
        <div className="font-bold text-lg">Insert some mem!</div>
        <textarea
          className={`text-xl active:border-none focus:outline-none py-1 resize-none ${
            error ? 'placeholder:text-red-300' : 'placeholder:text-gray-400'
          }`}
          placeholder={error ? 'Insert image or text first' : 'Remember, only funny, no cringe'}
          value={inputContent}
          onChange={(e) => handleContentInputChange(e.target.value)}
        />
        {file && (
          <div className="w-full h-full relative pb-2">
            <div className="absolute top-2 right-2" onClick={() => setFile(null)}>
              <GrClose
                className="text-black rounded-full p-1 hover:bg-blue-200 hover:cursor-pointer transition-all duration-150"
                size={30}
              />
            </div>
            <img // eslint-disable-line @next/next/no-img-element
              className="w-fit max-w-[100%]"
              alt="submitted picture"
              src={URL.createObjectURL(file)}
            />
          </div>
        )}
        <div className="w-full flex justify-between items-center mt-2">
          <label htmlFor="file">
            <ImFilePicture
              size={25}
              className="hover:text-blue-500 transition-all duration-150 hover:cursor-pointer"
            />
          </label>
          <input
            id="file"
            onChange={fileSelected}
            type="file"
            accept="image/*"
            className="hidden"
          ></input>

          <button
            disabled={loading}
            className="basic-button w-24 h-10 flex justify-center items-center"
            type="submit"
            onClick={onSubmit}
          >
            {loading ? <BeatLoader
                size={8}
                color={'white'}
                cssOverride={{ alignItems: 'center' }}
                aria-label="Loading Spinner"
            /> : 'Mem'}
          </button>
        </div>
      </div>
    </div>
  );
}
