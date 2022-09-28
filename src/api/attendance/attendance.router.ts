import { Router } from 'express';

import AttendanceController from './attendance.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/attendance';
export const router = Router();

router.get('/', new AuthMiddleware().authorization, new AttendanceController().initAttendance);
router.get('/:groupId', new AuthMiddleware().authorization, new AttendanceController().getAttendanceByGroup);

router.post('/blankData', new AuthMiddleware().authorization, new AttendanceController().createBlankAttendance);
router.post('/fullData', new AuthMiddleware().authorization, new AttendanceController().createFullAttendance);
