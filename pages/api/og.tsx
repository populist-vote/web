import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export interface OGParams {
  cardType: string;
  imageSrc: string;
}

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const _cardType = searchParams.get("cardType");
  const imageSrc = searchParams.get("imageSrc");

  if (!imageSrc) {
    return new ImageResponse(
      <>Visit with &quot;?cardType=politician&slug=politician-name&quot;</>,
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "white",
          background: "hsl(200, 100%, 13%)",
          width: "100%",
          height: "100%",
          paddingTop: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 50,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="og"
          width="400"
          height="400"
          src={imageSrc}
          style={{
            borderRadius: 200,
            boxShadow: "0 0 0 10px hsl(200, 100%, 13%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Vercel"
            height={200}
            src="data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 120.06'%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%23d64646;%7D.cls-2%7Bfill:%23006586;%7D%3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M955.33,479.8h57a12,12,0,0,1,12,12h0a12,12,0,0,1-12,12h-57a12,12,0,0,1-12-12h0A12,12,0,0,1,955.33,479.8Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-1' d='M955.33,527.8h27a12,12,0,0,1,12,12h0a12,12,0,0,1-12,12h-27a12,12,0,0,1-12-12h0A12,12,0,0,1,955.33,527.8Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-1' d='M862.33,575.8h90a12,12,0,0,1,12,12h0a12,12,0,0,1-12,12h-90a12,12,0,0,1-12-12h0A12,12,0,0,1,862.33,575.8Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-1' d='M1054.33,479.8h4a12,12,0,0,1,12,12h0a12,12,0,0,1-12,12h-4a12,12,0,0,1-12-12h0A12,12,0,0,1,1054.33,479.8Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-1' d='M1024.33,527.7h34a12,12,0,0,1,12,12v.1a12,12,0,0,1-12,12h-34a12,12,0,0,1-12-12v-.1A12,12,0,0,1,1024.33,527.7Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-1' d='M994.33,575.8h64a12,12,0,0,1,12,12h0a12,12,0,0,1-12,12h-64a12,12,0,0,1-12-12h0A12,12,0,0,1,994.33,575.8Z' transform='translate(-850.33 -479.74)'/%3E%3Cpath class='cls-2' d='M893,482.5l6.6,20.2a3.87,3.87,0,0,0,3.7,2.7h21.3a3.8,3.8,0,0,1,3.8,3.8,3.84,3.84,0,0,1-1.6,3.1l-17.3,12.5a3.79,3.79,0,0,0-1.4,4.3l6.6,20.2a3.78,3.78,0,0,1-2.5,4.8,3.73,3.73,0,0,1-3.4-.5l-17.2-12.5a3.75,3.75,0,0,0-4.5,0l-17.3,12.5a3.94,3.94,0,0,1-5.4-.8,3.78,3.78,0,0,1-.5-3.4l6.6-20.3a4,4,0,0,0-1.4-4.3l-17.2-12.5a3.93,3.93,0,0,1-.9-5.4,3.84,3.84,0,0,1,3.1-1.6h21.3a3.75,3.75,0,0,0,3.6-2.7l6.6-20.2a3.9,3.9,0,0,1,4.8-2.5A4.19,4.19,0,0,1,893,482.5Z' transform='translate(-850.33 -479.74)'/%3E%3C/svg%3E"
            style={{ margin: "0 30px" }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
