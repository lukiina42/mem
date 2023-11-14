export default function layout(props: { children: React.ReactNode; header: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      {props.header}
      {props.children}
    </div>
  );
}
