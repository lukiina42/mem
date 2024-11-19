export default function Layout({
  modal,
  users,
  main,
  children,
}: {
  modal: React.ReactNode;
  users: React.ReactNode;
  main: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen">
        <div className="lg:max-w-[45rem] lg:min-w-[45rem] min-w-0 w-full">{main}</div>
        <div className="grow hidden lg:block h-full">{users}</div>
      </div>
      {modal}
      {children}
    </>
  );
}
