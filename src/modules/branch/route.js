const express = require("express");
const BranchController = require("./controller");
const { authenticateUser } = require("../user/auth/middleware");

const router = express.Router();

// Public read endpoints
router.get("/getAll", BranchController.getAll);
router.get("/getOne/:id", BranchController.getOne);
// Protected write endpoints
router.post("/create", authenticateUser, BranchController.create);
router.put("/update/:id", authenticateUser, BranchController.update);
router.delete("/delete/:id", authenticateUser, BranchController.delete);

module.exports = router;


