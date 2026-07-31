const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cutoff date is July 31, 2026, 00:00:00 in UTC+7 (Jakarta time)
  // Which is July 30, 2026, 17:00:00 UTC
  const cutoff = new Date('2026-07-30T17:00:00.000Z');

  console.log(`Searching for records created before cutoff: ${cutoff.toISOString()}`);

  // Find users to delete
  const oldUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        lt: cutoff
      }
    },
    select: {
      id: true
    }
  });

  const oldUserIds = oldUsers.map(u => u.id);
  console.log(`Found ${oldUserIds.length} users created before cutoff.`);

  // Find users to keep
  const keepUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: cutoff
      }
    }
  });
  console.log(`Found ${keepUsers.length} users to KEEP (should be around 26).`);

  if (oldUserIds.length > 0) {
    // Delete assessments for old users
    const deleteAssessments = await prisma.assessment.deleteMany({
      where: {
        userId: {
          in: oldUserIds
        }
      }
    });
    console.log(`Deleted ${deleteAssessments.count} assessments.`);

    // Delete surveys for old users
    const deleteSurveys = await prisma.survey.deleteMany({
      where: {
        userId: {
          in: oldUserIds
        }
      }
    });
    console.log(`Deleted ${deleteSurveys.count} surveys.`);

    // Delete old users
    const deleteUsers = await prisma.user.deleteMany({
      where: {
        id: {
          in: oldUserIds
        }
      }
    });
    console.log(`Deleted ${deleteUsers.count} users.`);
  }

  console.log("Database cleanup completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
