import { Router } from 'express';
import { authController } from '~/modules/auth/auth.controller';
import { requestValidator } from '~/middlewares/request-validator';
import { authenticate } from '~/middlewares/authenticate';
import { changePasswordSchema, loginSchema, registerSchema } from 'itam-shared/schemas/auth';

const router = Router();

router.post('/login', requestValidator(loginSchema), authController.login);
router.post('/register', requestValidator(registerSchema), authController.register);
router.post('/refresh', authController.refresh);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put(
  '/change-password',
  authenticate,
  requestValidator(changePasswordSchema),
  authController.changePassword,
);

export default router;
