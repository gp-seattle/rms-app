const blacklist = require('metro-config/src/defaults/blacklist');

// Blacklists #current-cloud-backend directory in the amplify folder.
// Otherwise will have multiple AWS Lambda function package definitions in the same repo,
// which breaks expo builds.
module.exports = {
  resolver: {
    blacklistRE: blacklist([/#current-cloud-backend\/.*/])
  }
};