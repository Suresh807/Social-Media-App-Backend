// Required packages
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS setup
const corsOptions = {
  origin: 'http://localhost:3000', // Make sure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // Allow cookies to be sent with requests
};

app.use(cors(corsOptions));

// Access Control Headers Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Socket.io setup for real-time communication
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  SocketServer(socket); // Your socket server logic
});

// Routes
app.get('/', (req, res) => {
  res.send("Hi, Welcome to Social Media App API...");
});

// API Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));

// MongoDB Connection
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database Connected!!');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Error Handling for MongoDB Connection
mongoose.connection.on('error', (err) => {
  console.error(`Error in MongoDB connection: ${err}`);
});

// Starting the server
const port = process.env.PORT || 3001;
http.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
