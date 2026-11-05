const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statuscode || err.status || 500;
    let message = err.message || "Internal server error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource ID";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
        .map((error)=> error.message)
        .join(" , ");
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = "A record with these details already exists";
    }

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        statusCode = 400;
        message = "Invalid JSON request body";
    }

    // Avoid exposing internal error details to clients.
    if (statusCode >= 500) {
        message = "Internal server error";
    }

    return res.status(statusCode).json({
        success: false,
        message,
    });
    };

module.exports = errorMiddleware;