import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChatCompletionStream } from "openai/lib/ChatCompletionStream"; // Make sure this import is correct

function useStreamResponse({
  streamCallback,
}: {
  streamCallback: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [responses, setResponses] = useState("");
  const [data, setData] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: startStream } = useMutation({
    mutationFn: async (messageContent: string) => {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: messageContent,
      });

      if (!response.body) {
        throw new Error("ReadableStream not supported in this browser.");
      }

      const runner = ChatCompletionStream.fromReadableStream(response.body);
      return runner;
    },
    onSuccess: async (runner) => {
      setIsLoading(true);

      runner.on("content", (delta, _snapshot) => {
        setResponses((prev) => prev + delta);
        streamCallback((prevValue) => prevValue + delta);
      });

      const finalCompletion = await runner.finalChatCompletion();
      setData(finalCompletion);
      setIsLoading(false);
    },
  });

  return { responses, data, startStream, isLoading };
}

export default useStreamResponse;
