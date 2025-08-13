const express = require("express");
const baseRouter = express.Router();

// Import routers
const userRouter = require('../modules/user/route');
const authRouter = require('../modules/user/auth/route');
const roleRouter = require('../modules/user/role/route');
const fileUploadRouter = require('../modules/fileUpload/route');
const locationRouter = require('../modules/location/route');
const scheduleRouter = require('../modules/schedule/route');
const branchRouter = require('../modules/branch/route');

// Use routers
baseRouter.use('/user', userRouter);
baseRouter.use('/user/auth', authRouter);
baseRouter.use('/user/role', roleRouter);
baseRouter.use('/file-upload', fileUploadRouter);
baseRouter.use('/location', locationRouter);
baseRouter.use('/schedule', scheduleRouter);
baseRouter.use('/branch', branchRouter);

module.exports = baseRouter;
