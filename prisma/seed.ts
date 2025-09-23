import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Helper function to generate random data
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function generateRandomName(): string {
  const firstNames = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Edward',
    'Fiona',
    'George',
    'Helen',
    'Isaac',
    'Julia',
    'Kevin',
    'Luna',
    'Marcus',
    'Nina',
    'Oliver',
    'Penny',
  ]
  const lastNames = [
    'Anderson',
    'Brooks',
    'Carter',
    'Davis',
    'Evans',
    'Foster',
    'Garcia',
    'Harris',
    'Johnson',
    'King',
    'Lopez',
    'Miller',
    'Nelson',
    'Parker',
    'Roberts',
    'Smith',
  ]

  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`
}

function generateRandomEmail(name: string): string {
  const domain = getRandomElement(['gmail.com', 'yahoo.com', 'outlook.com', 'prisma.io', 'example.com'])
  const username = name.toLowerCase().replace(' ', '.')
  const randomNum = Math.floor(Math.random() * 999)
  return `${username}${randomNum}@${domain}`
}

function generateRandomBio(): string {
  const bios = [
    'Passionate developer who loves coding and solving complex problems.',
    'Full-stack engineer with a focus on modern web technologies.',
    'Tech enthusiast and coffee addict. Always learning something new.',
    'Software architect with 10+ years of experience in enterprise solutions.',
    'Frontend specialist who enjoys creating beautiful user experiences.',
    'Backend developer focused on scalable and efficient systems.',
    'DevOps engineer passionate about automation and cloud infrastructure.',
    'Mobile app developer creating innovative solutions for everyday problems.',
    'Data scientist turning complex data into actionable insights.',
    'UI/UX designer who codes. Best of both worlds!',
    'Open source contributor and community organizer.',
    'Startup founder building the next big thing in tech.',
  ]

  return getRandomElement(bios)
}

function generateRandomPostTitle(): string {
  const adjectives = [
    'Amazing',
    'Incredible',
    'Fantastic',
    'Brilliant',
    'Revolutionary',
    'Innovative',
    'Essential',
    'Ultimate',
  ]
  const subjects = [
    'Web Development',
    'Database Design',
    'API Architecture',
    'User Experience',
    'Performance Optimization',
    'Security Best Practices',
    'Cloud Computing',
    'AI Integration',
  ]
  const types = ['Guide', 'Tutorial', 'Tips', 'Strategies', 'Insights', 'Techniques', 'Approaches', 'Solutions']

  return `${getRandomElement(adjectives)} ${getRandomElement(subjects)} ${getRandomElement(types)}`
}

function generateRandomPostContent(): string {
  const contents = [
    "This comprehensive guide covers everything you need to know about modern development practices. From setting up your environment to deploying production-ready applications, we'll walk through each step with practical examples and best practices.",
    "In this tutorial, we'll explore advanced techniques that can significantly improve your workflow. You'll learn how to optimize performance, enhance security, and create more maintainable code that scales with your project's growth.",
    "Discover the latest trends and methodologies that are shaping the future of software development. We'll discuss real-world applications, common pitfalls to avoid, and how to implement these concepts in your own projects.",
    'Learn from industry experts as we dive deep into professional development practices. This article provides actionable insights that you can immediately apply to improve your development process and deliver better results.',
    "Master the fundamentals with this step-by-step approach to building robust applications. We'll cover architecture decisions, testing strategies, and deployment considerations that every developer should know.",
  ]

  return getRandomElement(contents)
}

async function seed() {
  console.log('🌱 Starting seed process...')

  // Clean existing data
  await prisma.post.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️ Cleaned existing data')

  // Create 10 users with profiles and posts
  for (let i = 0; i < 10; i++) {
    const name = generateRandomName()
    const email = generateRandomEmail(name)

    console.log(`👤 Creating user ${i + 1}: ${name}`)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        profile: {
          create: {
            bio: generateRandomBio(),
          },
        },
        posts: {
          create: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => ({
            title: generateRandomPostTitle(),
            content: generateRandomPostContent(),
            published: Math.random() > 0.3, // 70% chance of being published
          })),
        },
      },
      include: {
        profile: true,
        posts: true,
      },
    })

    console.log(`  ✅ Created ${user.posts.length} posts for ${user.name}`)
  }

  console.log('🎉 Seed completed successfully!')

  // Print summary
  const userCount = await prisma.user.count()
  const profileCount = await prisma.profile.count()
  const postCount = await prisma.post.count()
  const publishedPostCount = await prisma.post.count({ where: { published: true } })

  console.log('\n📊 Summary:')
  console.log(`  Users created: ${userCount}`)
  console.log(`  Profiles created: ${profileCount}`)
  console.log(`  Posts created: ${postCount}`)
  console.log(`  Published posts: ${publishedPostCount}`)
}

seed()
  .then(() => {
    console.log('✨ Disconnecting from database...')
    return prisma.$disconnect()
  })
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
