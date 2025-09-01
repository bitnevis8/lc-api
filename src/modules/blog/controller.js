const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../core/database/mysql/connection");
const Joi = require("joi");
const fs = require('fs');
const path = require('path');
const BlogPost = require("./model");
const User = require("../user/user/model");

// Helper function to delete old blog image
const deleteOldBlogImage = (imageUrl) => {
  if (imageUrl && imageUrl.startsWith('/tmp/blog-images/')) {
    const imagePath = path.join(process.cwd(), imageUrl);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log('Old blog image deleted:', imagePath);
      } catch (error) {
        console.error('Error deleting old blog image:', error);
      }
    }
  }
};

class BlogController {
  // Get all blog posts (public)
  static async getAllPosts(req, res) {
    try {
      const { page = 1, limit = 10, status = 'published' } = req.query;
      const offset = (page - 1) * limit;

      const where = { isActive: true };
      if (status) {
        where.status = status;
      }

      const { count, rows } = await BlogPost.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ],
        order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error("Error in getAllPosts:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت پست‌ها"
      });
    }
  }

  // Get single blog post (public)
  static async getOnePost(req, res) {
    try {
      const { slug } = req.params;
      
      const post = await BlogPost.findOne({
        where: { 
          slug,
          isActive: true,
          status: 'published'
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ]
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "پست یافت نشد"
        });
      }

      // Increment view count
      await post.increment('viewCount');

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error("Error in getOnePost:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت پست"
      });
    }
  }

  // Get all blog posts (admin)
  static async getAllPostsAdmin(req, res) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const offset = (page - 1) * limit;

      const where = {};
      if (status) {
        where.status = status;
      }

      const { count, rows } = await BlogPost.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      console.error("Error in getAllPostsAdmin:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت پست‌ها"
      });
    }
  }

  // Get single blog post (admin)
  static async getOnePostAdmin(req, res) {
    try {
      const { id } = req.params;
      
      const post = await BlogPost.findByPk(id, {
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'firstName', 'lastName'],
            required: false
          }
        ]
      });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "پست یافت نشد"
        });
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      console.error("Error in getOnePostAdmin:", error);
      res.status(500).json({
        success: false,
        message: "خطا در دریافت پست"
      });
    }
  }

  // Create blog post
  static async createPost(req, res) {
    try {
      console.log('=== Create Post Debug ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('Request files:', req.files);
      console.log('Request headers:', req.headers);
      console.log('========================');

      const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        content: Joi.string().min(10).required(),
        excerpt: Joi.string().max(500).optional(),
        status: Joi.string().valid('draft', 'published').default('draft'),
        order: Joi.number().integer().min(0).default(0)
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      // Generate slug from title
      const slug = value.title
        .replace(/[^\u0600-\u06FF\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase()
        .trim();

      // Handle image upload
      let imageUrl = null;
      if (req.file) {
        console.log('File uploaded successfully:', req.file);
        // در اینجا می‌توانید تصویر را به سرور FTP یا CDN آپلود کنید
        // فعلاً مسیر موقت را ذخیره می‌کنیم
        imageUrl = `/tmp/blog-images/${req.file.filename}`;
      } else {
        console.log('No file uploaded');
      }

      const postData = {
        ...value,
        slug,
        authorId: req.user.userId, // Fix: use userId instead of id
        imageUrl,
        publishedAt: value.status === 'published' ? new Date() : null
      };

      console.log('Post data to create:', postData);

      const post = await BlogPost.create(postData);

      res.status(201).json({
        success: true,
        message: "پست با موفقیت ایجاد شد",
        data: post
      });
    } catch (error) {
      console.error("Error in createPost:", error);
      res.status(500).json({
        success: false,
        message: "خطا در ایجاد پست"
      });
    }
  }

  // Update blog post
  static async updatePost(req, res) {
    try {
      const { id } = req.params;
      
      console.log('=== Update Post Debug ===');
      console.log('Request body:', req.body);
      console.log('Request file:', req.file);
      console.log('Request files:', req.files);
      console.log('Request headers:', req.headers);
      console.log('========================');
      
      const schema = Joi.object({
        title: Joi.string().min(3).max(255).optional(),
        content: Joi.string().min(10).optional(),
        excerpt: Joi.string().max(500).optional(),
        status: Joi.string().valid('draft', 'published').optional(),
        order: Joi.number().integer().min(0).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const post = await BlogPost.findByPk(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "پست یافت نشد"
        });
      }

      // Generate new slug if title changed
      if (value.title && value.title !== post.title) {
        value.slug = value.title
          .replace(/[^\u0600-\u06FF\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .toLowerCase()
          .trim();
      }

      // Handle image upload
      if (req.file) {
        console.log('File uploaded successfully:', req.file);
        // Delete old image if exists
        if (post.imageUrl) {
          deleteOldBlogImage(post.imageUrl);
        }
        
        // در اینجا می‌توانید تصویر را به سرور FTP یا CDN آپلود کنید
        // فعلاً مسیر موقت را ذخیره می‌کنیم
        value.imageUrl = `/tmp/blog-images/${req.file.filename}`;
      } else {
        console.log('No file uploaded for update');
      }

      // Set publishedAt if status changes to published
      if (value.status === 'published' && post.status !== 'published') {
        value.publishedAt = new Date();
      }

      await post.update(value);

      res.json({
        success: true,
        message: "پست با موفقیت بروزرسانی شد",
        data: post
      });
    } catch (error) {
      console.error("Error in updatePost:", error);
      res.status(500).json({
        success: false,
        message: "خطا در بروزرسانی پست"
      });
    }
  }

  // Delete blog post
  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      
      const post = await BlogPost.findByPk(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "پست یافت نشد"
        });
      }

      // Delete associated image if exists
      if (post.imageUrl) {
        deleteOldBlogImage(post.imageUrl);
      }

      await post.destroy();

      res.json({
        success: true,
        message: "پست با موفقیت حذف شد"
      });
    } catch (error) {
      console.error("Error in deletePost:", error);
      res.status(500).json({
        success: false,
        message: "خطا در حذف پست"
      });
    }
  }

  // Toggle post status
  static async togglePostStatus(req, res) {
    try {
      const { id } = req.params;
      
      const post = await BlogPost.findByPk(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "پست یافت نشد"
        });
      }

      const newStatus = post.status === 'published' ? 'draft' : 'published';
      const publishedAt = newStatus === 'published' ? new Date() : null;

      await post.update({
        status: newStatus,
        publishedAt
      });

      res.json({
        success: true,
        message: `وضعیت پست به ${newStatus === 'published' ? 'منتشر شده' : 'پیش‌نویس'} تغییر یافت`,
        data: post
      });
    } catch (error) {
      console.error("Error in togglePostStatus:", error);
      res.status(500).json({
        success: false,
        message: "خطا در تغییر وضعیت پست"
      });
    }
  }
}

module.exports = BlogController;
