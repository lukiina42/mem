export default function layout(props: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col">
      {props.children}
    </div>
  );
}
