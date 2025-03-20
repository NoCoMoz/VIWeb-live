const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from root directory
app.use(express.static(__dirname));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/voices_ignited';
const MONGODB_DB = process.env.MONGODB_DB || 'voices_ignited';
let db;

// Connect to MongoDB with timeout
async function connectToMongoDB() {
    return new Promise((resolve) => {
        console.log('Attempting to connect to MongoDB Atlas with URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'));
        console.log('Database name:', MONGODB_DB);
        
        // These are the options that were verified to work
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        
        // Set a timeout for the entire connection attempt
        const timeout = setTimeout(() => {
            console.error('MongoDB connection timed out after 30 seconds');
            resolve(false);
        }, 30000);
        
        MongoClient.connect(MONGODB_URI, options)
            .then(client => {
                clearTimeout(timeout);
                db = client.db(MONGODB_DB);
                console.log('Connected to MongoDB Atlas successfully');
                resolve(true);
            })
            .catch(error => {
                clearTimeout(timeout);
                console.error('MongoDB Atlas connection error:', error);
                console.error('Unable to connect to MongoDB Atlas. Please check your connection string and network connectivity.');
                resolve(false);
            });
    });
}

// API endpoint for BlueSky
app.get('/api/bluesky', (req, res) => {
    const blueSkyHandler = require('./api/bluesky/index');
    blueSkyHandler(req, res);
});

// API endpoints for events
app.get('/api/events', async (req, res) => {
    try {
        if (!db) {
            console.error('Database not connected when fetching events');
            return res.status(503).json({ 
                message: 'Database connection unavailable', 
                error: 'The server is currently unable to connect to the database. Please try again later.'
            });
        }
        
        // Check if this is an admin request
        const isAdmin = req.query.admin === 'true';
        console.log(`Fetching events with admin=${isAdmin}`);
        
        // For public requests, only return approved events
        // For admin requests, return all events
        const query = isAdmin ? {} : { status: 'approved' };
        
        const events = await db.collection('events').find(query).toArray();
        console.log(`Returning ${events.length} events`);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.get('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!db) {
            return res.status(500).json({ message: 'Database not connected' });
        }
        
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        
        const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        if (!db) {
            console.error('Database not connected when creating event');
            return res.status(503).json({ 
                message: 'Database connection unavailable', 
                error: 'The server is currently unable to connect to the database. Please try again later.'
            });
        }
        
        const event = req.body;
        // Add created date
        event.createdAt = new Date();
        
        // Set default status if not provided
        if (!event.status) {
            event.status = 'pending';
        }
        
        const result = await db.collection('events').insertOne(event);
        console.log('Event created successfully:', result.insertedId);
        res.status(201).json({
            message: 'Event created successfully',
            eventId: result.insertedId,
            event: { ...event, _id: result.insertedId }
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete event with ID: ${id}`);
        
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid event ID: ${id}`);
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        
        if (!db) {
            console.error('Database not connected');
            return res.status(500).json({ message: 'Database not connected' });
        }
        
        console.log(`Deleting event with ID: ${id}`);
        const result = await db.collection('events').deleteOne({
            _id: new ObjectId(id)
        });
        
        console.log(`Delete result:`, result);
        
        if (result.deletedCount === 0) {
            console.error(`Event not found with ID: ${id}`);
            return res.status(404).json({ message: 'Event not found' });
        }
        
        console.log(`Event deleted successfully with ID: ${id}`);
        res.json({ message: 'Event deleted successfully', eventId: id });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/events/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete event with ID: ${id}`);
        
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid event ID: ${id}`);
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        
        if (!db) {
            console.error('Database not connected when deleting event');
            return res.status(503).json({ 
                message: 'Database connection unavailable', 
                error: 'The server is currently unable to connect to the database. Please try again later.'
            });
        }
        
        console.log(`Deleting event with ID: ${id}`);
        const result = await db.collection('events').deleteOne({
            _id: new ObjectId(id)
        });
        
        console.log(`Delete result:`, result);
        
        if (result.deletedCount === 0) {
            console.error(`Event not found with ID: ${id}`);
            return res.status(404).json({ message: 'Event not found' });
        }
        
        console.log(`Event deleted successfully with ID: ${id}`);
        res.json({ message: 'Event deleted successfully', eventId: id });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/events/:id/approve', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to approve event with ID: ${id}`);
        
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid event ID: ${id}`);
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        
        if (!db) {
            console.error('Database not connected when approving event');
            return res.status(503).json({ 
                message: 'Database connection unavailable', 
                error: 'The server is currently unable to connect to the database. Please try again later.'
            });
        }
        
        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'approved', updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            console.error(`Event not found with ID: ${id}`);
            return res.status(404).json({ message: 'Event not found' });
        }
        
        console.log(`Event approved successfully with ID: ${id}`);
        res.json({ message: 'Event approved successfully', eventId: id });
    } catch (error) {
        console.error('Error approving event:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

app.put('/api/events/:id/reject', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to reject event with ID: ${id}`);
        
        if (!ObjectId.isValid(id)) {
            console.error(`Invalid event ID: ${id}`);
            return res.status(400).json({ message: 'Invalid event ID' });
        }
        
        if (!db) {
            console.error('Database not connected when rejecting event');
            return res.status(503).json({ 
                message: 'Database connection unavailable', 
                error: 'The server is currently unable to connect to the database. Please try again later.'
            });
        }
        
        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: 'rejected', updatedAt: new Date() } }
        );
        
        if (result.matchedCount === 0) {
            console.error(`Event not found with ID: ${id}`);
            return res.status(404).json({ message: 'Event not found' });
        }
        
        console.log(`Event rejected successfully with ID: ${id}`);
        res.json({ message: 'Event rejected successfully', eventId: id });
    } catch (error) {
        console.error('Error rejecting event:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Default route serves index.html from root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for specific pages
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'about.html'));
});

app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'join.html'));
});

app.get('/support', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'support.html'));
});

app.get('/break-the-ice', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'breaktheice.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'events.html'));
});

app.get('/admin/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'admin', 'events.html'));
});

app.get('/shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'Pages', 'shop.html'));
});

// Catch-all route for other pages
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'Pages', `${page}.html`);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Initialize the server
async function initServer() {
    const connected = await connectToMongoDB();
    if (!connected) {
        console.warn('Starting server without MongoDB connection. Some features may not work.');
        console.warn('Please ensure your MongoDB Atlas connection string is correct and the network allows the connection.');
        console.warn('The server will continue to try connecting to MongoDB Atlas periodically.');
        
        // Set up a periodic reconnection attempt
        setInterval(async () => {
            console.log('Attempting to reconnect to MongoDB Atlas...');
            const reconnected = await connectToMongoDB();
            if (reconnected) {
                console.log('Successfully reconnected to MongoDB Atlas!');
            }
        }, 60000); // Try every minute
    }
    
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}

// Start the server
initServer();
