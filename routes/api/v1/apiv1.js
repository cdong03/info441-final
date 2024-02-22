import express from 'express';
var router = express.Router();

import usersRouter from './controllers/users.js';
import artsRouter from './controllers/arts.js';
import galleriesRouter from './controllers/galleries.js';
import commentsRouter from './controllers/comments.js';

router.use('/users', usersRouter);
router.use('/arts', artsRouter);
router.use('/galleries', galleriesRouter);
router.use('/comments', commentsRouter);

export default router;