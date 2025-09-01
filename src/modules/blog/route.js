const express = require("express");
const router = express.Router();
const BlogController = require("./controller");
const { authenticateUser } = require("../user/auth/middleware");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require('fs');

// اطمینان از وجود دایرکتوری موقت برای آپلود تصاویر بلاگ
const blogImagePath = "tmp/blog-images";
if (!fs.existsSync(blogImagePath)) {
  fs.mkdirSync(blogImagePath, { recursive: true });
}

// تنظیمات multer برای آپلود تصاویر بلاگ
const blogImageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, blogImagePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    cb(null, `blog-${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const blogImageFilter = (req, file, cb) => {
  // اعتبارسنجی نوع فایل تصویر
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('فقط فایل‌های تصویری مجاز هستند'), false);
  }
};

const uploadBlogImage = multer({
  storage: blogImageStorage,
  fileFilter: blogImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Public routes
router.get("/posts/getAll", BlogController.getAllPosts);
router.get("/posts/getOne/:slug", BlogController.getOnePost);

// Admin routes (protected)
router.get("/posts/admin/getAll", authenticateUser, BlogController.getAllPostsAdmin);
router.get("/posts/admin/getOne/:id", authenticateUser, BlogController.getOnePostAdmin);

// Add error handling for multer
const uploadWithErrorHandling = (req, res, next) => {
  uploadBlogImage.single("image")(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'خطا در آپلود فایل'
      });
    }
    next();
  });
};

router.post("/posts/create", authenticateUser, uploadWithErrorHandling, BlogController.createPost);
router.put("/posts/update/:id", authenticateUser, uploadWithErrorHandling, BlogController.updatePost);
router.delete("/posts/delete/:id", authenticateUser, BlogController.deletePost);
router.put("/posts/toggle-status/:id", authenticateUser, BlogController.togglePostStatus);

module.exports = router;
