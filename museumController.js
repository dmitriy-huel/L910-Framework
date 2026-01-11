const fs = require('fs');
const path = require('path');

const MUSEUM_FILE = path.join(__dirname, '../data/museum.json');

function readData() {
    try {
        const data = fs.readFileSync(MUSEUM_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { museum: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(MUSEUM_FILE, JSON.stringify(data, null, 2));
}

const museumController = {
    getAll(req, res) {
        const data = readData();
        res.json(data.museum);
    },

    getById(req, res) {
        const data = readData();
        const item = data.museum.find(m => m.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Museum not found' });
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
        data.museum.push(newItem);
        writeData(data);
        res.status(201).json(newItem);
    },

    update(req, res) {
        const data = readData();
        const index = data.museum.findIndex(m => m.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Museum not found' });
        }
        data.museum[index] = { 
            ...data.museum[index], 
            ...req.body, 
            updatedAt: new Date().toISOString() 
        };
        writeData(data);
        res.json(data.museum[index]);
    },

    patch(req, res) {
        const data = readData();
        const item = data.museum.find(m => m.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Museum not found' });
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
        const index = data.museum.findIndex(m => m.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Museum not found' });
        }
        const deleted = data.museum.splice(index, 1)[0];
        writeData(data);
        res.json(deleted);
    }
};

module.exports = museumController;