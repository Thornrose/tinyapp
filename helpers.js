


const getUserByEmail = function(testEmail, database) {
  for (const user in database) {
    if (database[user].email === testEmail) {
      return database[user];
    }
  }
  return null;
};


module.exports = { getUserByEmail };