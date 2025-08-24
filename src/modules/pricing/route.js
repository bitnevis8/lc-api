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

// Services - public read
router.get("/services/getAll", PricingController.getAllServices);
router.get("/services/getOne/:id", PricingController.getOneService);
// Services - protected write
router.post("/services/create", authenticateUser, PricingController.createService);
router.put("/services/update/:id", authenticateUser, PricingController.updateService);
router.delete("/services/delete/:id", authenticateUser, PricingController.deleteService);

module.exports = router;


