import { Factory, Seeder } from 'typeorm-seeding';

import { USER_ROLE } from 'components/users/user.types';
import { User } from 'components/users/entities/user.entity';
import { Ban } from '../components/bans/entities/ban.entity';

export default class CreateBans implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const issuer = await factory(User)({ role: USER_ROLE.ADMIN }).create();
    const users = await factory(User)().createMany(20);

    await factory(Ban)({ issuer, users }).createMany(10);
  }
}
