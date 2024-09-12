import OpenAI from "openai";
import type { NextApiRequest } from "next";

// This file demonstrates how to stream from a Next.JS server as
// a new-line separated JSON-encoded stream. This file cannot be run
// without Next.JS scaffolding.

export const runtime = "edge";

// See examples/stream-to-client-browser.ts for a more complete example.
export default async function handler(req: NextApiRequest) {
  const openai = new OpenAI();

  const stream = openai.beta.chat.completions.stream({
    model: "gpt-3.5-turbo",
    stream: true,
    // @ts-expect-error - blame next
    messages: [{ role: "user", content: await req.text() }],
  });

  return new Response(stream.toReadableStream());
}
