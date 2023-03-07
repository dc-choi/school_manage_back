import { Router } from 'express';

import StudentController from './student.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/student';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().list);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().add);

router.get('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().get);
router.put('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().modify);
router.delete('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().remove);

router.post('/graduation', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().graduate);
