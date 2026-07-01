import { Router } from 'express';
import { authController } from '~/modules/auth/auth.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authenticate } from '~/middlewares/authenticate';
import { loginSchema, registerSchema } from 'itam-shared/schemas/auth';

const router = Router();

router.post('/login', requestValidator(loginSchema), authController.login);
router.post('/register', requestValidator(registerSchema), authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
