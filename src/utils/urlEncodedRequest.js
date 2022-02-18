const qs = require('qs');

const urlEncodedRequest = async (data, method, url) => {
  const options = {
    method: method,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify(data),
    url,
  };

  return options;
};

module.exports = {
  urlEncodedRequest,
};
