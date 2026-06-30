import { Router } from 'express';
import { authController } from '~/modules/auth/auth.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { loginSchema, registerSchema } from 'itam-shared/schemas/auth';

const router = Router();

router.post('/login', requestValidator(loginSchema), authController.login);
router.post('/register', requestValidator(registerSchema), authController.register);
router.post('/refresh', authController.refresh);

export default router;
