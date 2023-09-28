const validator = require("validator");

const validate = (params) => {
  let resultado = false;
  let name =
    !validator.isEmpty(params.name) &&
    validator.isLength(params.name, { min: 3, max: 18 }) &&
    validator.isAlpha(params.name);

  let nick =
    !validator.isEmpty(params.nick) &&
    validator.isLength(params.nick, { min: 4, max: 18 });

  let email = !validator.isEmpty(params.email) && validator.isEmail(params.email);

  let password = !validator.isEmpty(params.password);

  
  if (params.surname) {
    let surname =
      !validator.isEmpty(params.surname) &&
      validator.isLength(params.surname, { min: 3, max: 18 }) &&
      /^[a-zA-Z ]*$/.test(params.surname);

    if (!surname) {
      
      throw new Error(
        "El apellido debe tener mas de 3 caracteres y menos de 18, y no debe tener caracteres invalidos "
      );
    }
  }

  if (!name || !nick || !email || !password) {
    throw new Error("No se ha superado la validacion");
  } else {
    resultado = true;
  }

  return resultado;
};

module.exports = validate;
