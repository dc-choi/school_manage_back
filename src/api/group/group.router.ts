import { Router } from 'express';

import GroupController from './group.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/group';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().getGroups);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().createGroup);

router.get('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().getGroup);
router.put('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().updateGroup);
router.delete('/:groupId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new GroupController().deleteGroup);
