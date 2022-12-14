import { Router } from 'express';

import AttendanceController from './attendance.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/attendance';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().setAttendance);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().createAttendance);

router.get('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().getAttendanceByGroup);
