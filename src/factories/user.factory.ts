import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

import { User } from '../components/users/entities/user.entity';
import { USER_ROLE, USER_STATUS } from '../components/users/user.types';

define(User, (faker) => {
  const user = new User();

  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.password = bcrypt.hashSync(
    faker.internet.password(),
    Number(process.env.SALT_ROUNDS),
  );
  user.status = USER_STATUS.ACTIVE;
  user.role = USER_ROLE.USER;

  return user;
});
