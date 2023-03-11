import { Router } from 'express';

import GroupController from './group.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/group';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().list);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().add);

router.get('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().get);
router.put('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().modify);
router.delete('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().remove);

router.get('/:groupId/attendance', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().attendanceForGroup);
