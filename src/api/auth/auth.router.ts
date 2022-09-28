import { Router } from 'express';

import AuthController from './auth.controller';

export const path = '/auth';
export const router = Router();

router.post('/login', new AuthController().login);
// router.post('/logout', new AuthController().logout);

// router.post('/accessToken', new AuthController().accessToken);
