const Spacer = ({
  size,
  axis = "horizontal",
  delimiter,
  style = {},
  ...delegated
}: {
  size: number;
  axis?: "vertical" | "horizontal";
  delimiter?: string;
  style?: {};
}) => {
  const width = axis === "vertical" ? 1 : size;
  const height = axis === "horizontal" ? 1 : size;
  return (
    <span
      style={{
        display: "block",
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style,
      }}
      {...delegated}
    >
      {delimiter}
    </span>
  );
};
export default Spacer;
