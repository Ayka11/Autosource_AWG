module.exports = {
  setupFiles: ["./jest.setup.js"], // Point to your setup file
  transformIgnorePatterns: ["/node_modules/(?!gapi-script)/"], // Ensure gapi-script is processed
};
