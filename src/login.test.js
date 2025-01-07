// Login.test.js

jest.mock('gapi-script', () => ({
  gapi: {
    load: jest.fn(),
    auth2: {
      init: jest.fn(),
    },
  },
}));

// Your test cases here
describe('Login', () => {
  it('should do something', () => {
    // Test code here
  });
});
