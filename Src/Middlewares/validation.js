const reqMethods = ["body", "query", "params", "headers", "file", "files"];
const validationCoreFunction = (schema) => {
  return (req, res, next) => {
    const validationErrorArr = [];
    for (const key of reqMethods) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        // console.log(validationResult);
        if (validationResult.error) {
          validationErrorArr.push(validationResult.error.details);
        }
      }
    }
    if (validationErrorArr.length) {
      res.status(400).json({ message: "Validation Error", validationErrorArr });
    } else {
      next();
    }
  };
};

export default validationCoreFunction;