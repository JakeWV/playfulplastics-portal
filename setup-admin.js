const { PrismaClient } = require('./node_modules/@prisma/client');
const { PrismaPg } = require('./node_modules/@prisma/adapter-pg');
const pg = require('./node_modules/pg');
const bcrypt = require('bcryptjs');

async function main() {
  const pool = new pg.Pool({ connectionString: 'postgresql://pgportal:PgPortalPass123@localhost:5432/pgportal' });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hash = await bcrypt.hash('PlayfulPlastics2026!', 12);
  const user = await prisma.user.create({
    data: {
      email: 'admin@playfulplastics.com',
      passwordHash: hash,
      role: 'ADMIN',
      passwordLoginEnabled: true,
    },
  });
  console.log('Admin created:', user.email);
  await prisma.$disconnect();
  pool.end();
}

main().catch(console.error);
