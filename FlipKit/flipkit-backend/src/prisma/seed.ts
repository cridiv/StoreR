// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'data', 'Vendor.json');
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const vendors = JSON.parse(raw);

  if (!Array.isArray(vendors)) {
    throw new Error('JSON must be an array of vendors');
  }

  console.log(`Starting restore of ${vendors.length} vendors...`);

  for (let i = 0; i < vendors.length; i++) {
    const v = vendors[i];
    try {
      await prisma.vendor.upsert({
        where: { id: v.id },
        update: {}, // we don't update existing (they shouldn't exist yet)
        create: {
          id: v.id,
          name: v.name,
          contact: v.contact ?? null,
          picture: v.picture ?? null,
          category: v.category ?? null,
          avg_price: v.avg_price ?? null,
          ratings: v.ratings ?? null,
          res_time: v.res_time ?? null,
          tot_prod: v.tot_prod ?? null,
          url: v.url ?? null,
          price: v.price ?? null,
          createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
        },
      });

      if ((i + 1) % 10 === 0 || i === vendors.length - 1) {
        console.log(`Inserted ${i + 1}/${vendors.length}`);
      }
    } catch (error: any) {
      console.error(`Failed on vendor ${v.id}:`, error.message);
      // Don't stop on one bad record
    }
  }

  console.log('All vendors restored!');
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });