import { define } from 'typeorm-seeding';

import { getRadomArrayElement } from 'utils/other';
import { Ban } from '../components/bans/entities/ban.entity';
import { User } from '../components/users/entities/user.entity';

define(Ban, (faker, { issuer, users }: { issuer: User; users: User[] }) => {
  const ban = new Ban();

  ban.reason = faker.lorem.words(5);
  ban.endsAt = faker.date.past();
  ban.userId = getRadomArrayElement(users).id;
  ban.issuerId = issuer.id;

  return ban;
});
