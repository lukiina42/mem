export default function layout(props: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  console.log(props.header);
  return (
    <div className="w-full h-full flex flex-col">
      {props.header}
      {props.children}
    </div>
  );
}
