const http = require('http');

class App {
    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            PUT: {},
            PATCH: {},
            DELETE: {}
        };
        this.middlewares = [];
    }
    
    use(middleware) {
        this.middlewares.push(middleware);
    }
    
    get(path, handler) {
        this.routes.GET[path] = handler;
    }
    
    post(path, handler) {
        this.routes.POST[path] = handler;
    }
    
    put(path, handler) {
        this.routes.PUT[path] = handler;
    }
    
    patch(path, handler) {
        this.routes.PATCH[path] = handler;
    }
    
    delete(path, handler) {
        this.routes.DELETE[path] = handler;
    }
    
    _findRoute(method, url) {
        const path = url.split('?')[0];
        const routes = this.routes[method];
        
        if (routes[path]) {
            return { handler: routes[path], params: {} };
        }
        
        for (const routePath in routes) {
            if (routePath.includes(':')) {
                const routeParts = routePath.split('/');
                const urlParts = path.split('/');
                
                if (routeParts.length === urlParts.length) {
                    let match = true;
                    let params = {};
                    
                    for (let i = 0; i < routeParts.length; i++) {
                        if (routeParts[i].startsWith(':')) {
                            const paramName = routeParts[i].substring(1);
                            params[paramName] = urlParts[i];
                        } else if (routeParts[i] !== urlParts[i]) {
                            match = false;
                            break;
                        }
                    }
                    
                    if (match) {
                        return { handler: routes[routePath], params };
                    }
                }
            }
        }
        
        return null;
    }
    
    listen(port, callback) {
        const server = http.createServer((req, res) => {
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data, null, 2));
            };
            
            res.status = (code) => {
                res.statusCode = code;
                return res;
            };
            
            const url = new URL(req.url, `http://${req.headers.host}`);
            req.query = Object.fromEntries(url.searchParams);
            req.path = url.pathname;
            
            let idx = 0;
            const next = () => {
                if (idx < this.middlewares.length) {
                    const middleware = this.middlewares[idx++];
                    middleware(req, res, next);
                } else {
                    this._handleRoute(req, res);
                }
            };
            next();
        });
        
        server.listen(port, callback);
        return server;
    }
    
    _handleRoute(req, res) {
        const found = this._findRoute(req.method, req.url);
        
        if (found) {
            req.params = found.params;
            try {
                found.handler(req, res);
            } catch (error) {
                console.error('Handler error:', error);
                res.status(500).json({ error: 'Handler error', message: error.message });
            }
        } else {
            res.status(404).json({ 
                error: 'Route not found',
                path: req.path,
                method: req.method 
            });
        }
    }
}

module.exports = App;