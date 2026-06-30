import type { Request, Response } from 'express';
import { authService } from '~/modules/auth/auth.service';

export const authController = {
  login: async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json(result);
  },

  register: async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },

  refresh: async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body);
    res.json(result);
  },
};
