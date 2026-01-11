module.exports = function logger(req, res, next) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}]  ${req.method} ${req.url}`);
    
    const originalEnd = res.end;
    
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        const statusCode = res.statusCode;
        
        let statusColor = '\x1b[0m';
        if (statusCode >= 200 && statusCode < 300) statusColor = '\x1b[32m';
        else if (statusCode >= 300 && statusCode < 400) statusColor = '\x1b[36m';
        else if (statusCode >= 400 && statusCode < 500) statusColor = '\x1b[33m';
        else if (statusCode >= 500) statusColor = '\x1b[31m';
        console.log(`[${timestamp}]  ${req.method} ${req.url} - ${statusColor}${statusCode}\x1b[0m - ${duration}ms`);
        
        originalEnd.apply(res, args);
    };
    
    next();
};