import joi from "joi";

const signUpSchema = {
  body: joi
    .object({
      username: joi.string().min(3).max(15).required().messages({
        "any.required": "userName is required",
      }),
      email: joi
        .string()
        .email({ tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        .required(),
      cPassword: joi.valid(joi.ref("password")).required(),
      gender: joi.string().optional(),
    })
    .required(),
  query: joi
    .object({
      test: joi.string().min(3).max(5).required(),
    })
    .required(),
};

const signInSchema = {
  body: joi
    .object({
      email: joi.string().email({ tlds: { allow: ["com", "net", "org"] } }),
      password: joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/),
    })
    .options({ presence: "required" })
    .required(),
};

export { signUpSchema, signInSchema };
