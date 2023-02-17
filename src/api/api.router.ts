import { Router } from 'express';

import * as auth from './auth/auth.router';
import * as account from './account/account.router';
import * as group from './group/group.router';
import * as student from './student/student.router';
import * as attendance from './attendance/attendance.router';
import * as statistics from './statistics/statistics.router';

export const path = '/api';
export const router = Router();

router.use(auth.path, auth.router);
router.use(account.path, account.router);
router.use(group.path, group.router);
router.use(student.path, student.router);
router.use(attendance.path, attendance.router);
router.use(statistics.path, statistics.router);
