import LoadingSpinner from '@/utilComponents/Loading';

export default function loading() {
  return (
    <div className="w-full h-full flex justify-center mt-16">
      <LoadingSpinner />
    </div>
  );
}
