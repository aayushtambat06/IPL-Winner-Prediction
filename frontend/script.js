const API_URL = "http://127.0.0.1:5000";

// Chart instances
let liveChart = null;
let tourneyChart = null;

// --- Tab Switching Logic ---
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-nav'));
    document.getElementById('tab-' + tab).style.display = 'block';
    if(tab === 'chase') {
        document.getElementById('btn-chase').classList.add('active-nav');
    } else {
        document.getElementById('btn-tour').classList.add('active-nav');
    }
}

// --- Live Predictor Logic ---
async function predictChase() {
    const data = {
        batting_team: document.getElementById('batting_team').value,
        bowling_team: document.getElementById('bowling_team').value,
        city: document.getElementById('city').value,
        target: parseInt(document.getElementById('target').value),
        runs_left: parseInt(document.getElementById('runs_left').value),
        balls_left: parseInt(document.getElementById('balls_left').value),
        wickets: parseInt(document.getElementById('wickets').value)
    };

    if (isNaN(data.target) || isNaN(data.runs_left) || isNaN(data.balls_left)) {
        alert("Please enter valid numbers.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/predict-chase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.error) return alert("Error: " + result.error);

        // Update UI Text & Bar
        document.getElementById('prob-bar').style.width = result.batting_team_prob + "%";
        document.getElementById('team1-text').innerText = `Batting: ${result.batting_team_prob}%`;
        document.getElementById('team2-text').innerText = `Bowling: ${result.bowling_team_prob}%`;

        // UPDATE CHART
        renderLiveChart(data.batting_team, result.batting_team_prob, data.bowling_team, result.bowling_team_prob);

    } catch (error) {
        alert("Could not connect to the server.");
    }
}

// --- Tournament Simulation Logic ---
async function simulateTournament() {
    const loader = document.getElementById('tournament-loader');
    const list = document.getElementById('tournament-list');
    loader.style.display = 'block';
    list.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/simulate-tournament`);
        const data = await response.json();
        if (data.error) return alert("Error: " + data.error);

        // Build Table
        let html = "<table><tr><th style='text-align:left;'>Team</th><th style='text-align:right;'>Win Probability</th></tr>";
        let teams = [];
        let probabilities = [];

        for (let team in data) {
            html += `<tr><td>${team}</td><td style="text-align:right; color:#00d2ff; font-weight:bold;">${data[team]}%</td></tr>`;
            teams.push(team);
            probabilities.push(data[team]);
        }
        html += "</table>";
        list.innerHTML = html;

        // UPDATE CHART
        renderTourneyChart(teams, probabilities);

    } catch (error) {
        alert("Simulation failed.");
    } finally {
        loader.style.display = 'none';
    }
}

// --- CHART.JS RENDERING FUNCTIONS ---
function renderLiveChart(batTeam, batProb, bowlTeam, bowlProb) {
    const ctx = document.getElementById('liveChart').getContext('2d');
    if (liveChart) liveChart.destroy(); // Destroy old chart to prevent overlap

    liveChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [batTeam, bowlTeam],
            datasets: [{
                data: [batProb, bowlProb],
                backgroundColor: ['#00d2ff', '#ff007f'], // Neon Blue and Neon Pink
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: 'white' } }
            }
        }
    });
}

function renderTourneyChart(teams, probabilities) {
    const ctx = document.getElementById('tournamentChart').getContext('2d');
    if (tourneyChart) tourneyChart.destroy();

    tourneyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams,
            datasets: [{
                label: 'Championship Win Probability (%)',
                data: probabilities,
                backgroundColor: '#00d2ff',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                x: { ticks: { color: 'white', display: false }, grid: { display: false } } // Hidden X labels for clean look
            },
            plugins: {
                legend: { labels: { color: 'white' } }
            }
        }
    });
}