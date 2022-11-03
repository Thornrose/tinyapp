
const generateRandomString = function() {
  const randomString = Math.random().toString(36).replace('0.', ''); // right now only able to set lower-case letters and 0-9
  return randomString.slice(0, 6);
};

const getUserByEmail = function(testEmail, database) {
  for (const user in database) {
    if (database[user].email === testEmail) {
      return database[user];
    }
  }
  return undefined;
};

const urlsForUser = function(id, database) {
  const userURLs = {};
  for (const urlID in database) {
    if (database[urlID].userID === id) {
      userURLs[urlID] = database[urlID];
    }
  }
  return userURLs;
};

const urlChecker = function(urlToCheck, database) {

  for (const url in database) {
    if (urlToCheck === url) {
      return true;
    }
  }
  return false;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  urlChecker
};