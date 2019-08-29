const yesNoSchema = (errorMessageString = "errors.yesNo") => {
  return {
    isIn: {
      errorMessage: errorMessageString,
      options: [["Yes", "No"]]
    }
  };
};

const Schema = {
  confirm: yesNoSchema()
};

module.exports = {
  Schema
};
