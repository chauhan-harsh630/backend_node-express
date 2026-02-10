import { body, validationResult } from 'express-validator';


const studentValidator = [
    body("name")
        .notEmpty()
        .withMessage("Name is require"),
    
    body("email")
        .isEmail({ min: 5, max: 100 })
        .withMessage("Invalid Email address"),
    
    body("age")
        .isInt()
        .withMessage("Age must be 5 to 100"),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg,
                })),
            });
        }
        next();
    },
];

export default studentValidator