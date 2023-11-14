import SignupForm from '@/clientComponents/header/profileSettings/forms/signup/SignupForm';
import QueryProvider from '@/lib/reactQuery/QueryProvider';

export default function page() {
  return (
    <div className="h-full w-4/5 flex justify-center items-center">
      <QueryProvider>
        <SignupForm />
      </QueryProvider>
    </div>
  );
}
