import { define } from 'typeorm-seeding';
import * as bcrypt from 'bcrypt';

import { User } from 'components/users/entities/user.entity';
import { USER_ROLE, USER_STATUS } from 'components/users/user.types';

define(
  User,
  (
    faker,
    {
      role = USER_ROLE.USER,
      status = USER_STATUS.ACTIVE,
      password = faker.internet.password(),
      username = faker.internet.userName(),
      email = faker.internet.email(),
    }: {
      role?: USER_ROLE;
      status?: USER_STATUS.ACTIVE;
      password?: string;
      username?: string;
      email?: string;
    } = {},
  ) => {
    const user = new User();

    user.username = username;
    user.email = email;
    user.password = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
    user.status = status;
    user.role = role;

    return user;
  },
);
