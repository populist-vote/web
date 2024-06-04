import { AwsRegion, RenderMediaOnLambdaOutput } from "@remotion/lambda/client";
import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
import { DISK, RAM, REGION, SITE_NAME, TIMEOUT } from "../../../config.mjs";
import { executeApi } from "../../../helpers/api-response";
import type { RenderRequest } from "../../../types/schema";

const render = executeApi<RenderMediaOnLambdaOutput, RenderRequest>(
  async (req, body) => {
    if (req.method !== "POST") {
      throw new Error("Only POST requests are allowed");
    }

    if (
      !process.env.AWS_ACCESS_KEY_ID &&
      !process.env.REMOTION_AWS_ACCESS_KEY_ID
    ) {
      throw new TypeError(
        "Set up Remotion Lambda to render videos. See the README.md for how to do so."
      );
    }
    if (
      !process.env.AWS_SECRET_ACCESS_KEY &&
      !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ) {
      throw new TypeError(
        "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file."
      );
    }

    if (!body.inputProps.billResult) {
      throw new Error("billResult is null or undefined");
    }

    const videoTitle = body.inputProps.billResult.slug + ".mp4";

    const result = await renderMediaOnLambda({
      codec: "h264",
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
      composition: body.id,
      outName: videoTitle,
      inputProps: body.inputProps,
      framesPerLambda: undefined,
      logLevel: "verbose",
      downloadBehavior: {
        type: "download",
        fileName: videoTitle,
      },
    });
    return result;
  }
);

export default render;
