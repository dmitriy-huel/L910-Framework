module.exports = function jsonParser(req, res, next) {

    const hasBody = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH';
    
    if (!hasBody) {
        req.body = {};
        return next();
    }
    
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
        req.body = {};
        return next();
    }
    
    let bodyData = '';
    
    req.on('data', chunk => {
        bodyData += chunk.toString('utf8');
    });
    
    req.on('end', () => {
        try {
            if (!bodyData.trim()) {
                req.body = {};
            } else {
                req.body = JSON.parse(bodyData);
            }
            next();
        } catch (error) {
            console.error('JSON parsing error:', error.message);
            if (res.json) {
                res.status(400).json({
                    error: 'Invalid JSON format',
                    message: error.message
                });
            } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                    error: 'Invalid JSON format',
                    message: error.message
                }));
            }
        }
    });
    
    req.on('error', (error) => {
        console.error('Request error:', error);
        if (res.json) {
            res.status(500).json({
                error: 'Error reading request body',
                message: error.message
            });
        } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                error: 'Error reading request body',
                message: error.message
            }));
        }
    });
};