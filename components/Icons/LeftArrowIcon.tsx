export default function LeftArrowIcon({
  height = 40,
  color = "white",
  className,
}: {
  height?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="17"
      height={height}
      viewBox="0 0 17 40"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path fill="none" />
      <path d="M16.2771 0.249882C16.7293 0.638363 16.798 1.34098 16.4302 1.81868L2.95828 19.3394C2.6433 19.7502 2.6433 20.3375 2.96004 20.7483L16.4284 38.1798C16.7962 38.6575 16.7293 39.3601 16.2771 39.7486C15.8249 40.1389 15.1597 40.0664 14.792 39.5887L0.237855 20.7502C-0.0788829 20.3413 -0.0788819 19.752 0.236096 19.3412L14.792 0.411596C15.1597 -0.0661059 15.8249 -0.1386 16.2771 0.249882Z" />
    </svg>
  );
}
