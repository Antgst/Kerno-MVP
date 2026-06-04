const prisma = require("./lib/prisma");

async function main() {
  const users = await prisma.user.findMany();

  console.log(users);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  