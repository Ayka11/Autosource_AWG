// jest.config.js
module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!gapi-script).*/"  // Ensure gapi-script is transformed by Babel
  ],
  testEnvironment: "jsdom"  // Ensure the environment is set to jsdom for React tests
};
