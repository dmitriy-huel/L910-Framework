const App = require('./src/framework');
const fs = require('fs').promises;
const path = require('path');

const app = new App();

const readJSON = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return { data: [] };
    }
};

const writeJSON = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

const DATA_DIR = path.join(__dirname, 'data');
const AGENCY_FILE = path.join(DATA_DIR, 'agency.json');
const CIRCUS_FILE = path.join(DATA_DIR, 'circus.json');
const MUSEUM_FILE = path.join(DATA_DIR, 'museum.json');

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                req.body = body ? JSON.parse(body) : {};
            } catch (error) {
                req.body = {};
            }
            next();
        });
    } else {
        req.body = {};
        next();
    }
});

const agencyController = {
    getAll: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            res.json(data.agency || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to read agency data' });
        }
    },
    
    getById: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            const agency = (data.agency || []).find(a => a.id === req.params.id);
            
            if (agency) {
                res.json(agency);
            } else {
                res.status(404).json({ error: 'Agency not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read agency data' });
        }
    },
    
    create: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            const newAgency = {
                id: Date.now().toString(),
                ...req.body,
                createdAt: new Date().toISOString()
            };
            
            data.agency = data.agency || [];
            data.agency.push(newAgency);
            
            await writeJSON(AGENCY_FILE, data);
            res.status(201).json(newAgency);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create agency' });
        }
    },
    
    update: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            const index = (data.agency || []).findIndex(a => a.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Agency not found' });
            }
            
            data.agency[index] = {
                ...data.agency[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeJSON(AGENCY_FILE, data);
            res.json(data.agency[index]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update agency' });
        }
    },
    
    patch: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            const agency = (data.agency || []).find(a => a.id === req.params.id);
            
            if (!agency) {
                return res.status(404).json({ error: 'Agency not found' });
            }
            
            Object.assign(agency, req.body, { updatedAt: new Date().toISOString() });
            
            await writeJSON(AGENCY_FILE, data);
            res.json(agency);
        } catch (error) {
            res.status(500).json({ error: 'Failed to patch agency' });
        }
    },
    
    delete: async (req, res) => {
        try {
            const data = await readJSON(AGENCY_FILE);
            const index = (data.agency || []).findIndex(a => a.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Agency not found' });
            }
            
            const deleted = data.agency.splice(index, 1)[0];
            await writeJSON(AGENCY_FILE, data);
            
            res.json(deleted);
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete agency' });
        }
    }
};

const circusController = {
    getAll: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            res.json(data.circus || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to read circus data' });
        }
    },
    
    getById: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            const circus = (data.circus || []).find(c => c.id === req.params.id);
            
            if (circus) {
                res.json(circus);
            } else {
                res.status(404).json({ error: 'Circus not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read circus data' });
        }
    },
    
    create: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            const newCircus = {
                id: Date.now().toString(),
                ...req.body,
                createdAt: new Date().toISOString()
            };
            
            data.circus = data.circus || [];
            data.circus.push(newCircus);
            
            await writeJSON(CIRCUS_FILE, data);
            res.status(201).json(newCircus);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create circus' });
        }
    },
    
    update: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            const index = (data.circus || []).findIndex(c => c.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Circus not found' });
            }
            
            data.circus[index] = {
                ...data.circus[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeJSON(CIRCUS_FILE, data);
            res.json(data.circus[index]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update circus' });
        }
    },
    
    patch: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            const circus = (data.circus || []).find(c => c.id === req.params.id);
            
            if (!circus) {
                return res.status(404).json({ error: 'Circus not found' });
            }
            
            Object.assign(circus, req.body, { updatedAt: new Date().toISOString() });
            
            await writeJSON(CIRCUS_FILE, data);
            res.json(circus);
        } catch (error) {
            res.status(500).json({ error: 'Failed to patch circus' });
        }
    },
    
    delete: async (req, res) => {
        try {
            const data = await readJSON(CIRCUS_FILE);
            const index = (data.circus || []).findIndex(c => c.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Circus not found' });
            }
            
            const deleted = data.circus.splice(index, 1)[0];
            await writeJSON(CIRCUS_FILE, data);
            
            res.json(deleted);
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete circus' });
        }
    }
};

const museumController = {
    getAll: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            res.json(data.museum || []);
        } catch (error) {
            res.status(500).json({ error: 'Failed to read museum data' });
        }
    },
    
    getById: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            const museum = (data.museum || []).find(m => m.id === req.params.id);
            
            if (museum) {
                res.json(museum);
            } else {
                res.status(404).json({ error: 'Museum not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to read museum data' });
        }
    },
    
    create: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            const newMuseum = {
                id: Date.now().toString(),
                ...req.body,
                createdAt: new Date().toISOString()
            };
            
            data.museum = data.museum || [];
            data.museum.push(newMuseum);
            
            await writeJSON(MUSEUM_FILE, data);
            res.status(201).json(newMuseum);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create museum' });
        }
    },
    
    update: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            const index = (data.museum || []).findIndex(m => m.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Museum not found' });
            }
            
            data.museum[index] = {
                ...data.museum[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeJSON(MUSEUM_FILE, data);
            res.json(data.museum[index]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update museum' });
        }
    },
    
    patch: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            const museum = (data.museum || []).find(m => m.id === req.params.id);
            
            if (!museum) {
                return res.status(404).json({ error: 'Museum not found' });
            }
            
            Object.assign(museum, req.body, { updatedAt: new Date().toISOString() });
            
            await writeJSON(MUSEUM_FILE, data);
            res.json(museum);
        } catch (error) {
            res.status(500).json({ error: 'Failed to patch museum' });
        }
    },
    
    delete: async (req, res) => {
        try {
            const data = await readJSON(MUSEUM_FILE);
            const index = (data.museum || []).findIndex(m => m.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Museum not found' });
            }
            
            const deleted = data.museum.splice(index, 1)[0];
            await writeJSON(MUSEUM_FILE, data);
            
            res.json(deleted);
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete museum' });
        }
    }
};

app.get('/', (req, res) => {
    res.json({
        message: '🎉 L910 Framework - Работает с JSON данными!',
        version: '1.0.0',
        endpoints: {
            agency: {
                get_all: 'GET    /agency',
                get_one: 'GET    /agency/:id',
                create:  'POST   /agency',
                update:  'PUT    /agency/:id',
                patch:   'PATCH  /agency/:id',
                delete:  'DELETE /agency/:id'
            },
            circus: {
                get_all: 'GET    /circus',
                get_one: 'GET    /circus/:id',
                create:  'POST   /circus',
                update:  'PUT    /circus/:id',
                patch:   'PATCH  /circus/:id',
                delete:  'DELETE /circus/:id'
            },
            museum: {
                get_all: 'GET    /museum',
                get_one: 'GET    /museum/:id',
                create:  'POST   /museum',
                update:  'PUT    /museum/:id',
                patch:   'PATCH  /museum/:id',
                delete:  'DELETE /museum/:id'
            }
        }
    });
});

app.get('/agency', (req, res) => agencyController.getAll(req, res));
app.get('/agency/:id', (req, res) => agencyController.getById(req, res));
app.post('/agency', (req, res) => agencyController.create(req, res));
app.put('/agency/:id', (req, res) => agencyController.update(req, res));
app.patch('/agency/:id', (req, res) => agencyController.patch(req, res));
app.delete('/agency/:id', (req, res) => agencyController.delete(req, res));

app.get('/circus', (req, res) => circusController.getAll(req, res));
app.get('/circus/:id', (req, res) => circusController.getById(req, res));
app.post('/circus', (req, res) => circusController.create(req, res));
app.put('/circus/:id', (req, res) => circusController.update(req, res));
app.patch('/circus/:id', (req, res) => circusController.patch(req, res));
app.delete('/circus/:id', (req, res) => circusController.delete(req, res));

app.get('/museum', (req, res) => museumController.getAll(req, res));
app.get('/museum/:id', (req, res) => museumController.getById(req, res));
app.post('/museum', (req, res) => museumController.create(req, res));
app.put('/museum/:id', (req, res) => museumController.update(req, res));
app.patch('/museum/:id', (req, res) => museumController.patch(req, res));
app.delete('/museum/:id', (req, res) => museumController.delete(req, res));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`
    `);
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});