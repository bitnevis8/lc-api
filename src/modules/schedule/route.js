const express = require("express");
const ScheduleController = require("./controller");
const { authenticateUser } = require("../user/auth/middleware");

const router = express.Router();

router.get("/getAll", authenticateUser, ScheduleController.getAll);
router.get("/getOne/:id", authenticateUser, ScheduleController.getOne);
router.post("/create", authenticateUser, ScheduleController.create);
router.put("/update/:id", authenticateUser, ScheduleController.update);
router.delete("/delete/:id", authenticateUser, ScheduleController.delete);

module.exports = router;


