const {generatePassword} = require("./randompassword");

const password = generatePassword();

console.log("Ваш новый пароль - " + password);