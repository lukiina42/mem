import { useMutation } from '@tanstack/react-query';
import { heartMem } from '../memApi';
import { displayToast } from '@/utilComponents/toast';

////heart mem
export const useHeartMutation = () => {
  return useMutation({
    mutationFn: heartMem,
    onSuccess: () => {},
    onError: () => {
      displayToast(
        'Something went wrong while hearting mem, please try again',
        'bottom-center',
        'error'
      );
    },
  });
};
