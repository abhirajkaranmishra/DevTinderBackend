const validateEditProfileData = (req)=>{

  const allowedEditField = ["firstName","lastName","about","photoURL","skills"];
  const isEditAllowed = Object.keys(req.body).every((field)=>
  allowedEditField.includes(field)
  );
   return isEditAllowed;
}

module.exports = validateEditProfileData;