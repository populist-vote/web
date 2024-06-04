import { CompositionProps } from "./constants";

export interface RenderRequest {
  id: string;
  inputProps: CompositionProps;
}

export interface ProgressRequest {
  bucketName: string;
  id: string;
}

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
