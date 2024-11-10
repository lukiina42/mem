export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex">
        <div className="lg:max-w-[45rem] lg:min-w-[45rem] min-w-0 w-full">{children}</div>
        <div className="grow hidden lg:block"></div>
      </div>
    </>
  );
}
