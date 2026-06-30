import { Router } from 'express';
import { authController } from '~/modules/auth/auth.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authenticate } from '~/middlewares/authenticate';
import { loginSchema } from 'itam-shared/schemas/auth';

const router = Router();

router.post('/login', requestValidator(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
