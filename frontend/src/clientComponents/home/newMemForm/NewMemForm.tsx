'use client';

import { useState } from 'react';

import { ImFilePicture } from 'react-icons/im';
import { GrClose } from 'react-icons/gr';
import { createMem } from '@/clientApiCalls/memApi';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import LoadingSpinner from '@/utilComponents/Loading';
import { displayToast } from '@/utilComponents/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/types/queryKeys';

//lazy solution
const getAmountOfRows = (input: string) => {
  const amountOfEnter = input.split('\n').length - 1;
  if (input.length < 35 && amountOfEnter < 2) return 2;
  return 3;
};

export default function NewTweetForm() {
  const [file, setFile] = useState<File | null>(null);
  const [inputContent, setInputContent] = useState('');
  const [error, setError] = useState(false);

  const { data } = useSession();

  const user = data?.user as User;

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

  const loading = createMemMutation.status === 'pending';

  const onSubmit = () => {
    if (!inputContent && !file) {
      setError(true);
      return;
    }
    createMemMutation.mutate({
      content: inputContent,
      image: file,
      userEmail: user.email as string,
      token: user.token,
    });
  };

  return (
    <div className="h-fit w-full flex justify-center items-center">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="relative flex flex-col h-full w-4/5 pb-1">
          <div className="font-bold text-lg">Insert some mem!</div>
          <textarea
            className={`text-xl active:border-none focus:outline-none py-2 resize-none ${
              error ? 'placeholder:text-red-300' : 'placeholder:text-gray-400'
            }`}
            rows={getAmountOfRows(inputContent)}
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

            <button className="basic-button w-24" type="submit" onClick={onSubmit}>
              Mem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
