import { AwsRegion, RenderMediaOnLambdaOutput } from "@remotion/lambda/client";
import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
import { DISK, RAM, REGION, SITE_NAME, TIMEOUT } from "../../../config.mjs";
import { executeApi } from "../../../helpers/api-response";
import { RenderRequest } from "../../../types/schema";
// import util from "util";

const render = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    console.log(
      "5. before rendermediaonlambda body: ",
      JSON.stringify(body, null, 2)
    );

    // console.log(
    //   "5. before rendermediaonlambda body: ",
    //   util.inspect(body, { showHidden: false, depth: null, colors: true })
    // );
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
      inputProps: body.inputProps,
      framesPerLambda: undefined,
      downloadBehavior: {
        type: "download",
        fileName: "video.mp4",
      },
      logLevel: "verbose",
    });
    console.log("6. renderMediaONLambda result", result);
    return result;
  }
);

export default render;
