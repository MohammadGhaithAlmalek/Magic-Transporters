module.exports = {
  preset: 'ts-jest',  // Use ts-jest preset for TypeScript support
  testEnvironment: 'node',  // Test in Node.js environment
  transform: {
    '^.+\\.ts$': 'ts-jest',  // Use ts-jest for transforming TypeScript files
  },
  testMatch: ['**/*.test.ts'],  // Look for test files in the root directory and subdirectories
};
