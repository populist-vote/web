import { NextApiRequest, NextApiResponse } from "next";

export type ApiResponse<Res> =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "success";
      data: Res;
    };

export const executeApi =
  <Res, Req>(
    handler: (
      req: NextApiRequest,
      body: Req,
      res: NextApiResponse<ApiResponse<Res>>
    ) => Promise<Res>
  ) =>
  async (req: NextApiRequest, res: NextApiResponse<ApiResponse<Res>>) => {
    try {
      const parsed = req.body as Req;
      const data = await handler(req, parsed, res);
      res.status(200).json({
        type: "success",
        data: data,
      });
    } catch (err) {
      res.status(500).json({ type: "error", message: (err as Error).message });
    }
  };
