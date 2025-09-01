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
const pricingRouter = require('../modules/pricing/route');
const blogRouter = require('../modules/blog/route');

// Use routers
baseRouter.use('/user', userRouter);
baseRouter.use('/user/auth', authRouter);
baseRouter.use('/user/role', roleRouter);
baseRouter.use('/file-upload', fileUploadRouter);
baseRouter.use('/location', locationRouter);
baseRouter.use('/schedule', scheduleRouter);
baseRouter.use('/branch', branchRouter);
baseRouter.use('/pricing', pricingRouter);
baseRouter.use('/blog', blogRouter);

module.exports = baseRouter;
