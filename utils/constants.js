const URI_REGEX = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
const OBJECTID_REGEX = /^[a-f\d]{24}$/i;

const MONGO_DUPLICATE_CODE = 11000;

module.exports = { URI_REGEX, OBJECTID_REGEX, MONGO_DUPLICATE_CODE };
