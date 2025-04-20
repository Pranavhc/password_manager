import StatusCodes from "http-status-codes";

const errorHandlerMiddleware = (err, req, res, next) => {
    // Defaults
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong, try again later",
    };

    // Cast error
    if (err.name === "CastError") {
        customError.msg = `No Item Found With ID: ${err.value}`;
        customError.statusCode = 404;
    }

    // Validation error
    if (err.name === "ValidationError") {
        customError.msg = `Please Provide ${Object.values(err.errors)
            .map((item) => item.path)
            .join(", ")}`;
        customError.statusCode = 400;
    }
    // user already exists error
    if (err.code && err.code === 11000) {
        customError.msg = `This ${Object.keys(err.keyValue)} already exists`;
        customError.statusCode = 400;
    }
    next();
    return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;