const { getEnv } = require('../getEnv');

describe('getEnv helper', () => {
  it('should throw error when env is not avaiable/undefined', () => {
    const targetEnvKey = 'NOT_AVAILABLE_ENV';
    expect(() => getEnv(targetEnvKey)).toThrowError(
      `[.env] process.env.${targetEnvKey} not found`
    );
  });

  it('should return correct env when env is available', () => {
    const targetEnvValue = 'available env values';
    process.env.AVAILABLE_ENV = targetEnvValue;
    const targetEnv = 'AVAILABLE_ENV';

    expect(getEnv(targetEnv)).toEqual(targetEnvValue);
  });
});
