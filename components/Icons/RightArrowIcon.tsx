// import Image from "next/image";
// import RightArrowSVG from "public/images/RightArrow40.svg";

// export default function RightArrowIcon({ ...rest }) {
//   return <Image src={RightArrowSVG} alt="Left Arrow" priority {...rest} />;
// }

export default function LeftArrowIcon({
  height = 40,
  color = "white"
}) {
  return (
    <svg
      width="17"
      height={height}
      viewBox="0 0 17 40"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="none"/>
      <path d="M0.389649 39.7501C-0.0625825 39.3616 -0.131209 38.659 0.236559 38.1813L13.7085 20.6606C14.0234 20.2498 14.0234 19.6625 13.7067 19.2517L0.238318 1.8202C-0.129449 1.3425 -0.0625825 0.639884 0.389649 0.251402C0.84188 -0.138938 1.50703 -0.0664461 1.8748 0.411256L16.4289 19.2498C16.7456 19.6587 16.7456 20.248 16.4307 20.6588L1.8748 39.5884C1.50703 40.0661 0.84188 40.1386 0.389649 39.7501Z"/>
    </svg>

  );
}