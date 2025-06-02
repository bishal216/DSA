export default function OutlineIcon({
  Icon,
  className,
}: {
  Icon: React.ElementType;
  className?: string;
}) {
  return (
    <Icon
      stroke="currentColor"
      fill="none"
      strokeWidth={2}
      className={className}
    />
  );
}
