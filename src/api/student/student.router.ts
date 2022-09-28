import { Router } from 'express';

import StudentController from './student.controller';

import AuthMiddleware from '../auth/auth.middleware'

export const path = '/student';
export const router = Router();

router.get('/', new AuthMiddleware().authorization, new StudentController().getStudents);
router.get('/:studentId', new AuthMiddleware().authorization, new StudentController().getStudent);

router.post('/', new AuthMiddleware().authorization, new StudentController().createStudent);
router.put('/:studentId', new AuthMiddleware().authorization, new StudentController().updateStudent);
router.delete('/:studentId', new AuthMiddleware().authorization, new StudentController().deleteStudent);
