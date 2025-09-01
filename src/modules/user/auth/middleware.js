// src/modules/user/auth/middleware.js

const { jwtVerify } = require("jose");
const config = require("config");
const cookieParser = require("cookie-parser");

// 📌 بررسی احراز هویت کاربر
const authenticateUser = async (req, res, next) => {
  try {
    console.log('=== Authentication Debug ===');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Method:', req.method);
    console.log('All Cookies:', req.cookies);
    console.log('Cookie Header:', req.headers.cookie);
    console.log('=========================');
    
    // گرفتن توکن از کوکی‌های درخواست
    const token = req.cookies?.token;
    
    // اگر توکن در cookies نبود، از header cookie بگیریم
    if (!token && req.headers.cookie) {
      console.log('Trying to parse cookie header manually');
      const cookieHeader = req.headers.cookie;
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const manualToken = tokenMatch[1];
        console.log('Token found in cookie header:', manualToken);
        req.cookies = { ...req.cookies, token: manualToken };
      }
    }
    
    // دوباره توکن را بررسی کنیم
    const finalToken = req.cookies?.token;
    if (!finalToken) {
      console.log('No token found in cookies');
      return res
        .status(401)
        .json({ success: false, message: "احراز هویت انجام نشده است" });
    }

    console.log('Token found:', finalToken);

    // بررسی اعتبار توکن
    const { payload } = await jwtVerify(
      finalToken,
      new TextEncoder().encode(config.get("JWT.KEY"))
    );

    console.log('Token payload:', payload);

    // ذخیره اطلاعات کاربر در req برای استفاده در کنترلرها
    req.user = payload;
    console.log('User authenticated successfully:', req.user);

    next(); // ادامه پردازش درخواست
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "توکن نامعتبر است، لطفاً دوباره وارد شوید",
    });
  }
};

// 📌 بررسی مجوز نقش کاربر
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "احراز هویت انجام نشده است"
        });
      }

      // بررسی نقش کاربر
      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: "شما مجوز دسترسی به این بخش را ندارید"
        });
      }

      next();
    } catch (error) {
      console.error("Role authorization failed:", error.message);
      return res.status(500).json({
        success: false,
        message: "خطا در بررسی مجوز نقش"
      });
    }
  };
};

module.exports = {
  authenticateUser,
  authorizeRole
};