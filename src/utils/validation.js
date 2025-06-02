const validator = require("validator");

const validateSignUpData = (req)=>{

  const {firstName, lastName, emailId, password} = req.body;
  if(!firstName)
    throw new Error("Enter first name");
  if(!validator.isEmail(emailId))
    throw new Error("Enter correct emailId");
  if(!validator.isStrongPassword(password))
    throw new Error("Enter Strong password")
}

module.exports  = validateSignUpData;