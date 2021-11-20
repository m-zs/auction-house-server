import { getErrorData } from './psql-db.helpers';

describe('errors: psql', () => {
  describe('getErrorData', () => {
    it('should return proper message', () => {
      const expectedResult = { name: 'test-key', value: 'test-value' };

      const result = getErrorData(
        'Key (test-key)=(test-value) already exists.',
      );

      expect(result).toMatchObject(expectedResult);
    });
  });
});
