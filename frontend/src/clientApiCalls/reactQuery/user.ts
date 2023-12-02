import { useMutation } from '@tanstack/react-query';
import { banUser, followUser } from '../userApi';

////heart mem
export const useBanUserMutation = (onSuccess: () => void, onError: () => void) => {
  return useMutation({ mutationFn: banUser, onSuccess, onError });
};

export const useFollowUserMutation = (onSuccess: () => void, onError: () => void) =>
  useMutation({ mutationFn: followUser, onSuccess, onError });
