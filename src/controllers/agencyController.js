const fs = require('fs');
const path = require('path');

const AGENCY_FILE = path.join(__dirname, '../data/agency.json');

function readData() {
    try {
        const data = fs.readFileSync(AGENCY_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { agency: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(AGENCY_FILE, JSON.stringify(data, null, 2));
}

const agencyController = {
    getAll(req, res) {
        const data = readData();
        res.json(data.agency);
    },

    getById(req, res) {
        const data = readData();
        const item = data.agency.find(a => a.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Agency not found' });
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
        data.agency.push(newItem);
        writeData(data);
        res.status(201).json(newItem);
    },

    update(req, res) {
        const data = readData();
        const index = data.agency.findIndex(a => a.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Agency not found' });
        }
        data.agency[index] = { 
            ...data.agency[index], 
            ...req.body, 
            updatedAt: new Date().toISOString() 
        };
        writeData(data);
        res.json(data.agency[index]);
    },

    patch(req, res) {
        const data = readData();
        const item = data.agency.find(a => a.id === req.params.id);
        if (!item) {
            return res.status(404).json({ error: 'Agency not found' });
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
        const index = data.agency.findIndex(a => a.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Agency not found' });
        }
        const deleted = data.agency.splice(index, 1)[0];
        writeData(data);
        res.json(deleted);
    }
};

module.exports = agencyController;