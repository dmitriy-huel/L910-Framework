const fs = require('fs');
const path = require('path');

const CIRCUS_FILE = path.join(__dirname, '../data/circus.json');

function readData() {
    try {
        const data = fs.readFileSync(CIRCUS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { circus: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(CIRCUS_FILE, JSON.stringify(data, null, 2));
}

const circusController = {
    getAll(req, res) {
        const data = readData();
        res.json(data.circus);
    },

    getById(req, res) {
        const data = readData();
        const item = data.circus.find(c => c.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Circus not found' });
        }
        res.json(item);
    },

    create(req, res) {
        const data = readData();
        const newItem = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.circus.push(newItem);
        writeData(data);
        res.status(201).json(newItem);
    },

    update(req, res) {
        const data = readData();
        const index = data.circus.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Circus not found' });
        }
        data.circus[index] = { 
            ...data.circus[index], 
            ...req.body, 
            updatedAt: new Date().toISOString() 
        };
        writeData(data);
        res.json(data.circus[index]);
    },

    patch(req, res) {
        const data = readData();
        const item = data.circus.find(c => c.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Circus not found' });
        }
        Object.keys(req.body).forEach(key => {
            item[key] = req.body[key];
        });
        item.updatedAt = new Date().toISOString();
        writeData(data);
        res.json(item);
    },

    delete(req, res) {
        const data = readData();
        const index = data.circus.findIndex(c => c.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Circus not found' });
        }
        const deleted = data.circus.splice(index, 1)[0];
        writeData(data);
        res.json(deleted);
    }
};

module.exports = circusController;