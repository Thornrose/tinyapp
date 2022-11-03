


const getUserByEmail = function(testEmail, database) {
  for (const user in database) {
    if (database[user].email === testEmail) {
      return database[user];
    }
  }
  return undefined;
};


module.exports = { getUserByEmail };