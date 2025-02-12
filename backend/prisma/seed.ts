import { PrismaClient } from '@prisma/client';
import { screens } from './data/screens';

const prisma = new PrismaClient();

async function addScreens() {
  await prisma.$transaction(
    screens.map((screen) =>
      prisma.screen.upsert({
        where: {
          id: screen.id,
        },
        create: {
          resource: screen.resource,
          actions: screen.actions,
          route: screen.route,
          display_name: screen.display_name,
          parent_screen_id: screen.parent_id,
        },
        update: {
          resource: screen.resource,
          actions: screen.actions,
          route: screen.route,
          display_name: screen.display_name,
          parent_screen_id: screen.parent_id,
        },
      }),
    ),
  );
}

addScreens()
  .then(() => console.log('SCREENS SEEDED'))
  .catch(console.log);
