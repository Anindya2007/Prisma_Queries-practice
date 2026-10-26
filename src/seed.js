require("dotenv/config");

const prisma = require("./db");
const bcrypt = require("bcrypt");

async function main() {
  // Clear existing data first
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create users with bcrypt-hashed passwords
  await prisma.user.createMany({
    data: [
      {
        username: "alice",
        email: "alice@example.com",
        fullName: "Alice Johnson",
        bio: "Software Developer",
        isPrivate: false,
        password: await bcrypt.hash("password123", 10)
      },
      {
        username: "bob",
        email: "bob@example.com",
        fullName: "Bob Smith",
        bio: "UI Designer",
        isPrivate: true,
        password: await bcrypt.hash("password123", 10)
      },
      {
        username: "charlie",
        email: "charlie@example.com",
        fullName: "Charlie Brown",
        bio: "Photographer",
        isPrivate: false,
        password: await bcrypt.hash("password123", 10)
      },
      {
        username: "david",
        email: "david@example.com",
        fullName: "David Wilson",
        bio: "Backend Developer",
        isPrivate: false,
        password: await bcrypt.hash("password123", 10)
      },
      {
        username: "emma",
        email: "emma@example.com",
        fullName: "Emma Davis",
        bio: "Travel Blogger",
        isPrivate: true,
        password: await bcrypt.hash("password123", 10)
      }
    ]
  });

  // Get user IDs to associate posts and profiles
  const users = await prisma.user.findMany();

  const userIds = Object.fromEntries(
    users.map((user) => [user.username, user.id])
  );

  // Create posts linked to existing users
  await prisma.post.createMany({
    data: [
      {
        imageUrl: "https://example.com/img1.jpg",
        caption: "Exploring Delhi streets",
        location: "Delhi",
        userId: userIds.alice
      },
      {
        imageUrl: "https://example.com/img2.jpg",
        caption: "Beautiful beach day",
        location: "Goa",
        userId: userIds.bob
      },
      {
        imageUrl: "https://example.com/img3.jpg",
        caption: "Food and travel memories",
        location: "Delhi",
        userId: userIds.alice
      },
      {
        imageUrl: "https://example.com/img4.jpg",
        caption: "Mountain adventure",
        location: "Manali",
        userId: userIds.charlie
      },
      {
        imageUrl: "https://example.com/img5.jpg",
        caption: "Coding from cafe",
        location: "Bangalore",
        userId: userIds.david
      },
      {
        imageUrl: "https://example.com/img6.jpg",
        caption: "Amazing sunset view",
        location: "Goa",
        userId: userIds.emma
      },
      {
        imageUrl: "https://example.com/img7.jpg",
        caption: "Street photography",
        location: "Mumbai",
        userId: userIds.charlie
      },
      {
        imageUrl: "https://example.com/img8.jpg",
        caption: "Weekend trip",
        location: "Delhi",
        userId: userIds.alice
      },
      {
        imageUrl: "https://example.com/img9.jpg",
        caption: "Nature photography",
        location: "Manali",
        userId: userIds.charlie
      },
      {
        imageUrl: "https://example.com/img10.jpg",
        caption: "Learning Prisma ORM",
        location: "Bangalore",
        userId: userIds.david
      },
      {
        imageUrl: "https://example.com/img11.jpg",
        caption: "Travel diary",
        location: "Goa",
        userId: userIds.emma
      },
      {
        imageUrl: "https://example.com/img12.jpg",
        caption: "Backend development",
        location: "Hyderabad",
        userId: userIds.bob
      }
    ]
  });

  // Create profiles linked to existing users
  await prisma.profile.createMany({
    data: [
      {
        bio: "Full-stack developer profile",
        userId: userIds.alice
      },
      {
        bio: "Designer profile",
        userId: userIds.bob
      },
      {
        bio: "Photography portfolio",
        userId: userIds.charlie
      }
    ]
  });

  console.log("Database seeded successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });