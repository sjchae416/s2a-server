function validateEmail(email) {
	// const regex = /^\w+([\.-]?\w+)*@gmail\.com$/;
	const regex = /^[a-zA-Z0-9\.]{6,30}@gmail\.com$/;
	return regex.test(email);
}

module.exports = validateEmail;
