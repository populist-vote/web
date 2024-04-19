// import { Sequence } from "remotion";
// import React from "react";
// import Image from "next/legacy/image";
// import billInConsiderationDark from "public/images/video-generator/bill-status-in-consideration-darkbg.svg";
// import type { Sponsor } from "generated";

// export const Sponsors = ({ sponsors }: { sponsors: Sponsor[] }) => {
//   // console.log("Data in Sponsors:", billData);

//   return (
//     <Sequence>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "left",
//           justifyContent: "top",
//           padding: "8rem 4rem",
//           gap: "4rem",
//           width: "100%",
//         }}
//       >
//         <h1
//           style={{
//             color: "white",
//             fontSize: "6rem",
//             fontWeight: "600",
//             margin: "10rem 0 0 0",
//           }}
//         >
//           Sponsors
//         </h1>
//         {sponsors.map((sponsor, index) => (
//           <div
//             key={index}
//             style={{ display: "flex", alignItems: "center", gap: "2rem" }}
//           >
//             <Image
//               src={sponsor.thumbnailImageUrl}
//               alt={sponsor.fullName}
//               width={160}
//               height={160}
//               style={{ borderRadius: "80px" }}
//             />
//             <div>
//               <h2 style={{ color: "white", fontSize: "3rem" }}>
//                 {sponsor.fullName}
//               </h2>
//               <p style={{ color: "white", fontSize: "2rem" }}>
//                 {sponsor.party.name}
//               </p>
//             </div>
//           </div>
//         ))}
//         <div style={{ position: "absolute", bottom: "20%", width: "400px" }}>
//           <Image
//             src={billInConsiderationDark}
//             alt="Bill Status: In Consideration"
//             layout="responsive"
//           />
//         </div>
//       </div>
//     </Sequence>
//   );
// };
