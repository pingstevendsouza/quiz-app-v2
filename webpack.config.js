const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.json$/,
        type: 'json',
      },
    ],
  },
}; 