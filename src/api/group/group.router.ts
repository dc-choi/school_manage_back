import { Router } from 'express';

import GroupController from './group.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/group';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().list);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().create);

router.get('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().get);
router.put('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().update);
router.delete('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().delete);
