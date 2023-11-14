import { useMutation } from 'react-query';
import { banUser, followUser } from '../userApi';

////heart mem
export const useBanUserMutation = (onSuccess: () => void, onError: () => void) => {
  return useMutation(banUser, {
    onSuccess,
    onError,
  });
};

export const useFollowUserMutation = (onSuccess: () => void, onError: () => void) =>
  useMutation(followUser, {
    onSuccess,
    onError,
  });
