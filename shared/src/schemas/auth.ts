import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty('Nhập mã nhân viên').length(8, 'Mã nhân viên phải đúng 8 ký tự'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().nonempty('Nhập mã nhân viên').length(8, 'Mã nhân viên phải đúng 8 ký tự'),
  email: z.email('Email không hợp lệ'),
  name: z.string().nonempty('Nhập họ tên'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
