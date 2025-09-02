const BlogPost = require("./model");
const User = require("../user/user/model");
const seedData = require("./seederData.json");

async function seedBlogPosts() {
  try {
    console.log("🌱 Starting blog posts seeding...");
    console.log(`📝 Found ${seedData.posts.length} posts to seed`);
    
    // Find the first available user to use as author
    const firstUser = await User.findOne({ where: { isActive: true } });
    if (!firstUser) {
      console.error("❌ No active user found. Cannot seed blog posts without an author.");
      return;
    }
    
    console.log(`👤 Using user as author: ${firstUser.firstName} ${firstUser.lastName} (ID: ${firstUser.id})`);
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const postData of seedData.posts) {
      try {
        if (!postData.slug) {
          console.warn(`⚠️ Skipping post '${postData.title}' - no slug provided`);
          skippedCount++;
          continue;
        }
        
        const [post, created] = await BlogPost.findOrCreate({
          where: { slug: postData.slug },
          defaults: {
            ...postData,
            authorId: firstUser.id, // Use the found user's ID
            publishedAt: postData.status === 'published' ? new Date() : null
          }
        });
        
        if (created) {
          console.log(`✅ Created blog post: ${post.title} (slug: ${post.slug})`);
          createdCount++;
        } else {
          console.log(`ℹ️ Blog post already exists: ${post.title} (slug: ${post.slug})`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error seeding post '${postData.title}':`, error.message);
        skippedCount++;
      }
    }
    
    console.log(`🎉 Blog posts seeding completed!`);
    console.log(`📊 Summary: ${createdCount} created, ${skippedCount} skipped`);
    
  } catch (error) {
    console.error("❌ Error seeding blog posts:", error);
    throw error;
  }
}

module.exports = seedBlogPosts;
