import { define } from 'typeorm-seeding';

import { Category } from '../components/categories/entities/category.entity';

define(
  Category,
  (
    faker,
    {
      parent,
      name,
      canPopulate,
    }: { parent?: Category; name?: string; canPopulate?: boolean } = {
      name: faker.random.word(),
      canPopulate: false,
    },
  ) => {
    const category = new Category();

    category.name = name;
    category.canPopulate = canPopulate;

    if (parent) category.parent = parent;

    return category;
  },
);
