import "./button.module.css";

export default function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return <button onClick={onClick}>{children}</button>;
}
