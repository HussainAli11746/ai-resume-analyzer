const express = require('express');
const authRouter = require('./routes/auth.route');
const interviewRouter = require('./routes/interview.route');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ai-resume-analyzer-nine-taupe.vercel.app',
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is active' });
});

app.use('/auth', authRouter);
app.use('/api/interview', interviewRouter);
app.use('/resume', interviewRouter);


module.exports = app;