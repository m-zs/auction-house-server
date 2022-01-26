import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as faker from 'faker';

import {
  AuthUserWithToken,
  clearDB,
  createAuthUserWithToken,
  makeRequest,
} from 'utils/test';
import { USER_ROLE } from 'components/users/user.types';
import { AppModule } from 'app.module';
import { UsersResolver } from 'components/users/users.resolver';
import { UsersRepository } from 'components/users/users.repository';
import { UsersService } from 'components/users/users.service';
import { HashService } from 'utils/hash/hash.service';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CategoriesResolver } from './categories.resolver';
import { BaseCategoryResponse } from './responses/base-category.response';

describe('categories - e2e', () => {
  let app: INestApplication;
  let usersResolver: UsersResolver;
  let categoriesResolver: CategoriesResolver;

  const createTree = async () => {
    let root: BaseCategoryResponse;
    let middle: BaseCategoryResponse;
    let outer: BaseCategoryResponse;

    const rootResponse = await categoriesResolver.createCategory({
      name: faker.datatype.uuid(),
    });

    if (rootResponse) {
      root = rootResponse;

      const middleResult = await categoriesResolver.createCategory({
        name: faker.datatype.uuid(),
        parentId: rootResponse.id,
      });

      if (middleResult) {
        middle = middleResult;

        const outerResponse = await categoriesResolver.createCategory({
          name: faker.datatype.uuid(),
          parentId: middleResult.id,
        });

        if (outerResponse) {
          outer = outerResponse;

          return [root, middle, outer];
        }
      }
    }

    throw new Error('Unable to create category tree');
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        UsersRepository,
        UsersResolver,
        UsersService,
        HashService,
        CategoriesResolver,
        CategoriesService,
        CategoriesRepository,
      ],
    }).compile();

    app = module.createNestApplication();
    usersResolver = module.get<UsersResolver>(UsersResolver);
    categoriesResolver = module.get<CategoriesResolver>(CategoriesResolver);

    await app.init();
  });

  afterAll(async () => {
    await clearDB();
    await app.close();
  });

  describe('findAll', () => {
    let tree: BaseCategoryResponse[];

    beforeAll(async () => {
      tree = await createTree();
    });

    it('should return whole category tree', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            categories {
              id
              children {
                id
                children {
                  id
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data.categories[0].id).toBe(tree[0].id);
      expect(data.categories[0].children[0].id).toBe(tree[1].id);
      expect(data.categories[0].children[0].children[0].id).toBe(tree[2].id);
    });
  });

  describe('findCategoryTree', () => {
    let tree: BaseCategoryResponse[];

    beforeAll(async () => {
      tree = await createTree();
    });

    it('should return subtree when id argument is provided', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            categoryTree(options: { id: "${tree[1].id}" }) {
              id
              children {
                id
                children {
                  id
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data.categoryTree.id).toBe(tree[1].id);
      expect(data.categoryTree.children[0].id).toBe(tree[2].id);
    });

    it('should return subtree when name argument is provided', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            categoryTree(options: { name: "${tree[1].name}" }) {
              id
              children {
                id
                children {
                  id
                }
              }
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data.categoryTree.id).toBe(tree[1].id);
      expect(data.categoryTree.children[0].id).toBe(tree[2].id);
    });
  });

  describe('findOne', () => {
    let tree: BaseCategoryResponse[];

    beforeAll(async () => {
      tree = await createTree();
    });

    it('should return category when id argument is provided', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            category(options: { id: "${tree[2].id}" }) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data.category.id).toBe(tree[2].id);
    });

    it('should return category when id argument is provided', async () => {
      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          {
            category(options: { name: "${tree[2].name}" }) {
              id
            }
          }
        `,
      });

      expect(errors).toBeFalsy();
      expect(data.category.id).toBe(tree[2].id);
    });
  });

  describe('createCategory', () => {
    let admin: AuthUserWithToken;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
    });

    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);
      const category = { name: faker.datatype.uuid() };

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
      expect(data.createCategory).toBe(null);
    });

    it('should create new root category for user with required access', async () => {
      const category = { name: faker.datatype.uuid() };

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.createCategory.name).toBe(category.name);
    });

    it('should create new nested category for user with required access', async () => {
      const category = { name: faker.datatype.uuid() };

      const {
        body: { data: rootData },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${category.name}", parentId: "${rootData.createCategory.id}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.createCategory.name).toBe(category.name);
    });
  });

  describe('updateCategory', () => {
    let admin: AuthUserWithToken;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
    });

    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);
      const category = { name: faker.datatype.uuid() };

      const {
        body: { data: createData },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateCategory(id: "${createData.createCategory.id}", data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
      expect(data.updateCategory).toBe(null);
    });

    it('should update category for user with required access', async () => {
      const category = { name: faker.datatype.uuid() };

      const {
        body: { data: createData },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${faker.datatype.uuid()}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            updateCategory(id: "${createData.createCategory.id}", data: { name: "${category.name}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.updateCategory.name).toBe(category.name);
    });
  });

  describe('removeCategory', () => {
    let admin: AuthUserWithToken;

    beforeAll(async () => {
      admin = await createAuthUserWithToken(usersResolver, app, {
        role: USER_ROLE.ADMIN,
      });
    });

    it('should return an error for a user without permission', async () => {
      const regularUser = await createAuthUserWithToken(usersResolver, app);

      const {
        body: { data: createData },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${faker.datatype.uuid()}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            removeCategory(id: "${createData.createCategory.id}") {
              id
            }
          }
        `,
        token: regularUser.token,
      });

      expect(errors[0].statusCode).toBe(403);
      expect(errors.length).toBe(1);
      expect(data.removeCategory).toBe(null);
    });

    it('should remove category for user with required access', async () => {
      const {
        body: { data: createData },
      } = await makeRequest({
        app,
        query: `
          mutation {
            createCategory(data: { name: "${faker.datatype.uuid()}" }) {
              id
              name
            }
          }
        `,
        token: admin.token,
      });

      const {
        body: { errors, data },
      } = await makeRequest({
        app,
        query: `
          mutation {
            removeCategory(id: "${createData.createCategory.id}") {
              id
            }
          }
        `,
        token: admin.token,
      });

      expect(errors).toBeFalsy();
      expect(data.removeCategory.id).toBe(createData.createCategory.id);

      const {
        body: { errors: categoryErrors, data: categoryData },
      } = await makeRequest({
        app,
        query: `
          {
            category(options: {id: "${createData.createCategory.id}"}) {
              id
            }
          }
        `,
      });

      expect(categoryErrors).toBeFalsy();
      expect(categoryData.category).toBeFalsy();
    });
  });
});
