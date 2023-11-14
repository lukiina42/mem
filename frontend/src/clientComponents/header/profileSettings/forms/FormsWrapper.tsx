'use client';

import LoginForm from './login/LoginForm';
import SignupForm from './signup/SignupForm';
import ModalWrapper from '@/utilComponents/ModalWrapper';
import QueryProvider from '@/lib/reactQuery/QueryProvider';

interface FormsWrapperProps {
  resetMenu: () => void;
  showModal: 'none' | 'signup' | 'login';
  signUpToLoginChange: () => void;
}

export default function FormsWrapper(props: FormsWrapperProps) {
  const { resetMenu, showModal, signUpToLoginChange } = props;
  return (
    <>
      <ModalWrapper closeModal={resetMenu}>
        {/*content*/}
        <QueryProvider>
          {showModal === 'signup' ? (
            <SignupForm resetMenu={resetMenu} signUpToLoginChange={signUpToLoginChange} />
          ) : (
            <LoginForm resetMenu={resetMenu} />
          )}
        </QueryProvider>
      </ModalWrapper>
    </>
  );
}
