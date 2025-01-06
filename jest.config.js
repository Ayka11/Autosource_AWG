module.exports = {
  transformIgnorePatterns: [
    "/node_modules/(?!gapi-script)/" // This will transform the `gapi-script` module
  ]
};
