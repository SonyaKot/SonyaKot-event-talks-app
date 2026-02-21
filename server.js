const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Helper function to format time
const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// Generate schedule data
const generateSchedule = () => {
    const talks = [];
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

    const talkDuration = 60; // 1 hour in minutes
    const transitionDuration = 10; // 10 minutes

    for (let i = 1; i <= 6; i++) {
        const startTime = new Date(currentTime);
        const endTime = new Date(startTime.getTime() + talkDuration * 60 * 1000);

        talks.push({
            id: `talk-${i}`,
            title: `Technical Talk ${i}: Topic ${i}`,
            speakers: [`Speaker ${i} A`, `Speaker ${i} B`],
            category: [`category-${i % 3}`, `technology`],
            duration: talkDuration,
            description: `This is a fascinating description for Technical Talk ${i}. It covers advanced concepts in Topic ${i} and its real-world applications.`,
            startTime: formatTime(startTime),
            endTime: formatTime(endTime)
        });

        currentTime = new Date(endTime.getTime() + transitionDuration * 60 * 1000);

        // Insert lunch break after the 3rd talk
        if (i === 3) {
            const lunchStartTime = new Date(currentTime);
            const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000); // 1 hour lunch

            talks.push({
                id: 'lunch',
                title: 'Lunch Break',
                speakers: [],
                category: ['break', 'food'],
                duration: 60,
                description: 'Enjoy a delicious lunch and network with fellow attendees!',
                startTime: formatTime(lunchStartTime),
                endTime: formatTime(lunchEndTime)
            });
            currentTime = new Date(lunchEndTime.getTime() + transitionDuration * 60 * 1000); // Add transition after lunch
        }
    }
    return talks;
};

const schedule = generateSchedule();

// API endpoint to get the schedule
app.get('/api/schedule', (req, res) => {
    res.json(schedule);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Static files served from http://localhost:${PORT}/index.html`);
});
