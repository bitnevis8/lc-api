const BlogPost = require("./model");
const User = require("../user/user/model");
const Role = require("../user/role/model");
const UserRole = require("../user/userRole/model");
const seedData = require("./seederData.json");

async function seedBlogPosts() {
  try {
    console.log("🌱 Starting blog posts seeding...");

    // Get the first admin user through the user_roles junction table
    const adminRole = await Role.findOne({
      where: { nameEn: 'admin' }
    });

    if (!adminRole) {
      console.log("⚠️ No admin role found. Please create an admin role first.");
      return;
    }

    const adminUserRole = await UserRole.findOne({
      where: { roleId: adminRole.id }
    });

    if (!adminUserRole) {
      console.log("⚠️ No admin user found. Please create an admin user first.");
      return;
    }

    const adminUser = await User.findByPk(adminUserRole.userId);

    if (!adminUser) {
      console.log("⚠️ Admin user not found. Please create an admin user first.");
      return;
    }

    for (const postData of seedData.posts) {
      const [post, created] = await BlogPost.findOrCreate({
        where: { title: postData.title },
        defaults: {
          ...postData,
          authorId: adminUser.id,
          publishedAt: postData.status === 'published' ? new Date() : null
        }
      });

      if (created) {
        console.log(`✅ Created blog post: ${post.title}`);
      } else {
        console.log(`ℹ️ Blog post already exists: ${post.title}`);
      }
    }

    console.log("🎉 Blog posts seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding blog posts:", error);
  }
}

module.exports = { seedBlogPosts };
