import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty('Nhập mã nhân viên'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;
