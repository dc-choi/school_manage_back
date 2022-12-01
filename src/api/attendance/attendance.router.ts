import { Router } from 'express';

import AttendanceController from './attendance.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/attendance';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().initAttendance);
router.get('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().getAttendanceByGroup);

router.post('/blankData', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().createBlankAttendance);
router.post('/fullData', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new AttendanceController().createFullAttendance);
