document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const categorySearchInput = document.getElementById('categorySearch');
    let allTalks = []; // To store the original fetched data

    const API_URL = 'http://localhost:3000/api/schedule'; // Node.js API endpoint

    async function fetchSchedule() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allTalks = await response.json();
            renderSchedule(allTalks);
        } catch (error) {
            console.error('Error fetching schedule:', error);
            scheduleContainer.innerHTML = '<p>Failed to load schedule. Please ensure the Node.js server is running.</p>';
        }
    }

    function renderSchedule(talksToRender) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule

        if (talksToRender.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found matching your search criteria.</p>';
            return;
        }

        talksToRender.forEach(talk => {
            const card = document.createElement('div');
            if (talk.id === 'lunch') {
                card.classList.add('lunch-break-card');
                card.innerHTML = `
                    <h2>${talk.title}</h2>
                    <p class="time">${talk.startTime} - ${talk.endTime}</p>
                    <p>${talk.description}</p>
                `;
            } else {
                card.classList.add('talk-card');
                const speakersHtml = talk.speakers.map(speaker => `<span>${speaker}</span>`).join('');
                const categoryHtml = talk.category.map(cat => `<span>${cat}</span>`).join('');
                card.innerHTML = `
                    <h2>${talk.title}</h2>
                    <p class="time">${talk.startTime} - ${talk.endTime}</p>
                    <p><strong>Speakers:</strong> ${speakersHtml}</p>
                    <p><strong>Categories:</strong> ${categoryHtml}</p>
                    <p>${talk.description}</p>
                `;
            }
            scheduleContainer.appendChild(card);
        });
    }

    categorySearchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredTalks = allTalks.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm)) ||
            talk.title.toLowerCase().includes(searchTerm) ||
            talk.speakers.some(speaker => speaker.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    // Initial fetch of the schedule
    fetchSchedule();
});
