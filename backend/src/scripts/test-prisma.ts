import prisma from '../config/prisma';

async function main() {
  const transaction = await prisma.transaction.create({
    data: {
      amount: 99.99,
      description: "Prueba de transacción",
      type: "expense",
      category: "Ocio"
    }
  });

  console.log("Transacción creada:", transaction);

  const allTransactions = await prisma.transaction.findMany();
  console.log("Todas las transacciones:", allTransactions);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });