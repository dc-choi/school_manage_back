import { Router } from 'express';

import StudentController from './student.controller';

import AuthMiddleware from '@/api/auth/auth.middleware'

export const path = '/student';
export const router = Router();

router.get('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().getStudents);
router.post('/', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().createStudent);

router.get('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().getStudent);
router.put('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().updateStudent);
router.delete('/:studentId', new AuthMiddleware().parseAuthToken, new AuthMiddleware().verifyAccount, new StudentController().deleteStudent);
