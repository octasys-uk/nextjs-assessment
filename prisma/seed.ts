import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
    },
  })

  // Create sessions
  await prisma.session.upsert({
    where: { token: 'test-token-1' },
    update: {},
    create: {
      token: 'test-token-1',
      userId: user1.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  await prisma.session.upsert({
    where: { token: 'test-token-2' },
    update: {},
    create: {
      token: 'test-token-2',
      userId: user2.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  // Create test projects
  const project1 = await prisma.project.create({
    data: {
      name: 'My First App',
      description: 'A sample AI-generated application',
      userId: user1.id,
      components: {
        create: [
          {
            name: 'Header',
            code: 'export default function Header() { return <header>My App</header> }',
            type: 'react',
            order: 0,
          },
          {
            name: 'Footer',
            code: 'export default function Footer() { return <footer>Footer</footer> }',
            type: 'react',
            order: 1,
          },
        ],
      },
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'E-commerce Site',
      description: 'Online store builder',
      userId: user1.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Johns App',
      description: 'Private project',
      userId: user2.id,
    },
  })

  console.log('Database seeded successfully!')
  console.log(`Created users: ${user1.email}, ${user2.email}`)
  console.log(`Created projects: ${project1.name}, ${project2.name}, ${project3.name}`)
  console.log('\nTest tokens:')
  console.log('User 1:', 'test-token-1')
  console.log('User 2:', 'test-token-2')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
