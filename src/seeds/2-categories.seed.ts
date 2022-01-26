import { Factory, Seeder } from 'typeorm-seeding';

import { Category } from '../components/categories/entities/category.entity';

interface CategoryBase {
  name: string;
  children?: CategoryBase[];
}

const CATEGORIES: CategoryBase[] = [
  {
    name: 'Automotive',
    children: [
      {
        name: 'Cars',
        children: [{ name: 'BMW' }, { name: 'Skoda' }, { name: 'Toyota' }],
      },
      {
        name: 'Motocycles',
        children: [{ name: 'BMW' }, { name: 'Harley' }, { name: 'Yamaha' }],
      },
    ],
  },
  {
    name: 'Culture',
    children: [
      {
        name: 'Books',
        children: [
          { name: 'Comedy' },
          { name: 'Eductation' },
          { name: 'Fantasy' },
          { name: 'Horror' },
          { name: 'Thriller' },
        ],
      },
      {
        name: 'Movies',
        children: [
          { name: 'Comedy' },
          { name: 'Eductation' },
          { name: 'Fantasy' },
          { name: 'Horror' },
          { name: 'Thriller' },
        ],
      },
    ],
  },
  {
    name: 'Electronics',
    children: [
      {
        name: 'Phones',
        children: [
          { name: 'Apple' },
          { name: 'LG' },
          { name: 'Nokia' },
          { name: 'Samsung' },
          { name: 'Sony' },
          { name: 'Xiaomi' },
        ],
      },
      {
        name: 'TV',
        children: [
          { name: 'LG' },
          { name: 'Panasonic' },
          { name: 'Samsung' },
          { name: 'Sony' },
        ],
      },
      {
        name: 'PC',
        children: [
          { name: 'RAM' },
          { name: 'MOBO' },
          { name: 'CPU' },
          { name: 'GPU' },
        ],
      },
    ],
  },
  {
    name: 'Fashion',
    children: [
      {
        name: 'Male',
        children: [
          { name: 'Boots' },
          { name: 'Jackets' },
          { name: 'Pants' },
          { name: 'Sweatshirts' },
          { name: 'T-shirts' },
        ],
      },
      {
        name: 'Female',
        children: [
          { name: 'Boots' },
          { name: 'Jackets' },
          { name: 'Pants' },
          { name: 'Sweatshirts' },
          { name: 'T-shirts' },
        ],
      },
      {
        name: 'Children',
        children: [
          { name: 'Boots' },
          { name: 'Jackets' },
          { name: 'Pants' },
          { name: 'Sweatshirts' },
          { name: 'T-shirts' },
        ],
      },
    ],
  },
];

export default class CreateCategories implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const factoryBase = factory(Category);

    await Promise.all(
      CATEGORIES.map(async (category) => {
        const parent = await factoryBase({ name: category.name }).create();

        return await Promise.all(
          category.children.map(async (subCategory) => {
            const child = await factoryBase({
              name: subCategory.name,
              parent,
            }).create();

            return await Promise.all(
              subCategory.children.map(async (deep) => {
                return await factoryBase({
                  name: deep.name,
                  parent: child,
                  canPopulate: true,
                }).create();
              }),
            );
          }),
        );
      }),
    );
  }
}
