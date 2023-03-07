import { Router } from 'express';

import AttendanceController from './attendance.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/attendance';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().list);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().modify);

router.get('/group/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().listByGroup);
