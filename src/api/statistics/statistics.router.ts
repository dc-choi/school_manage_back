import { Router } from 'express';

import StatisticsController from './statistics.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/statistics';
export const router = Router();

// router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().getGroups);
// router.get('/student', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().getGroups);
router.get('/student/excellent', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StatisticsController().excellentStudent);
