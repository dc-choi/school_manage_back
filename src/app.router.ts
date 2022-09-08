import { Router } from 'express';
import httpStatus from 'http-status';

import * as api from './api/api.router';

export const router = Router();
export const path = '';

/**
 * 독립적인 Route path
 */
router.get('/healthCheck', function (req, res) {
    res.status(httpStatus.OK).json({result: 'OK'});
});

/* API */
router.use(api.path, api.router);
