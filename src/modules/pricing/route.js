const express = require("express");
const PricingController = require("./controller");
const { authenticateUser } = require("../user/auth/middleware");

const router = express.Router();

// Categories - public read
router.get("/categories/getAll", PricingController.getAllCategories);
router.get("/categories/getOne/:id", PricingController.getOneCategory);
// Categories - protected write
router.post("/categories/create", authenticateUser, PricingController.createCategory);
router.put("/categories/update/:id", authenticateUser, PricingController.updateCategory);
router.delete("/categories/delete/:id", authenticateUser, PricingController.deleteCategory);

// Devices - public read
router.get("/devices/getAll", PricingController.getAllDevices);
router.get("/devices/getOne/:id", PricingController.getOneDevice);
// Devices - protected write
router.post("/devices/create", authenticateUser, PricingController.createDevice);
router.put("/devices/update/:id", authenticateUser, PricingController.updateDevice);
router.delete("/devices/delete/:id", authenticateUser, PricingController.deleteDevice);

module.exports = router;


