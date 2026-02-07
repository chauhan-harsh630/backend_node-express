const errorHandler = (err,req, res, next) => {
    res.status(err.statusCode || 500).json({
        succees: false,
        message: err.message,
    });
}

export default errorHandler