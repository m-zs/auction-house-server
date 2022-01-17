import { Factory, Seeder } from 'typeorm-seeding';

import { User } from 'components/users/entities/user.entity';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(User)().createMany(10);
  }
}
