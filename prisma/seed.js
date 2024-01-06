const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

function randomPick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

function generateStudent() {
  return {
    schoolId: faker.datatype.number({ min: 200000, max: 240999 }),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    hashedPassword: '$2b$10$H1Ud0TTNuwkxQn7iEcdbkOex7HKI4aE8KyDiXjy8kyNnV/DriaK76', // Replace with a hashed password using bcrypt
    age: faker.datatype.number({ min: 25, max: 60 }),
    status: true,
    role: 'Student',
    yearLevel: faker.datatype.number({ min: 1, max: 4 }),
    section: faker.helpers.arrayElement(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']),   
    group: faker.helpers.arrayElement(['A', 'B']),
  };
}

async function seedStudents(numStudents) {
  try {
    const students = Array.from({ length: numStudents }, generateStudent);

    await prisma.user.createMany({
      data: students,
    });

    console.log(`Successfully seeded ${numStudents} students`);
  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const numStudents = 100;

seedStudents(numStudents);
