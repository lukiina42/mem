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
      <div className="flex">
        <div className="lg:max-w-[45rem] lg:min-w-[45rem] min-w-0 w-full">{main}</div>
        <div className="grow hidden lg:block">{users}</div>
      </div>
      {modal}
      {children}
    </>
  );
}
