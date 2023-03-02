function validateEmail(email){
  const regex = /^\w+([\.-]?\w+)*@gmail\.com$/;
  return regex.test(email);
}

module.exports = validateEmail;