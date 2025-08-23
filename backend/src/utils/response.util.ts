import { Response } from 'express';

export const success = (
  res: Response,
  message: string,
  data?: unknown,
  code = 200
) => res.status(code).json({ success: true, message, data });
