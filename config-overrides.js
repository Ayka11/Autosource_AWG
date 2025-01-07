const { override } = require('customize-cra');  // Correct import

module.exports = {
  webpack: override(),  // This will allow you to customize the Webpack config if needed
  
  jest: (config) => {
    config.setupFiles = ["./jest.setup.js"];  // Add setup file
    config.transformIgnorePatterns = ["/node_modules/(?!gapi-script)/"];  // Handle gapi-script
    return config;
  },
};
