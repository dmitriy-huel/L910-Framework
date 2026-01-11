module.exports = function errorHandler(err, req, res, next) {
    console.error('Global Error Handler:', err);
    
    if (err instanceof SyntaxError && err.message.includes('JSON')) {
        return res.status(400).json({
            error: 'Invalid JSON',
            message: 'The request contains invalid JSON format'
        });
    }
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: err.errors
        });
    }
    
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
        timestamp: new Date().toISOString(),
        path: req.path
    });
};