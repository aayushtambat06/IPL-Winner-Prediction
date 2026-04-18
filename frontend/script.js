const API_URL = "http://127.0.0.1:5000";

// --- Tab Switching Logic ---
function showTab(tab) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    // Remove active class from all nav buttons
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active-nav'));
    
    // Show selected content and highlight button
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

    // Simple validation
    if (isNaN(data.target) || isNaN(data.runs_left) || isNaN(data.balls_left)) {
        alert("Please enter valid numbers for the match details.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/predict-chase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        if (result.error) {
            alert("Error: " + result.error);
            return;
        }

        // Update UI Visuals
        const bar = document.getElementById('prob-bar');
        bar.style.width = result.batting_team_prob + "%";
        
        document.getElementById('team1-text').innerText = `Batting: ${result.batting_team_prob}%`;
        document.getElementById('team2-text').innerText = `Bowling: ${result.bowling_team_prob}%`;
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Could not connect to the Python server. Make sure app.py is running!");
    }
}

// --- Tournament Simulation Logic ---
async function simulateTournament() {
    const loader = document.getElementById('tournament-loader');
    const list = document.getElementById('tournament-list');
    
    // Reset UI
    loader.style.display = 'block';
    list.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/simulate-tournament`);
        const data = await response.json();
        
        if (data.error) {
            alert("Error: " + data.error);
            loader.style.display = 'none';
            return;
        }

        let html = "<table>";
        html += "<tr><th style='text-align:left; padding:10px;'>Team</th><th style='text-align:right; padding:10px;'>Win Probability</th></tr>";
        
        for (let team in data) {
            html += `
                <tr>
                    <td style="padding:10px;">${team}</td>
                    <td style="text-align:right; padding:10px; color:#00d2ff; font-weight:bold;">${data[team]}%</td>
                </tr>`;
        }
        html += "</table>";
        
        list.innerHTML = html;
    } catch (error) {
        console.error("Connection Error:", error);
        alert("Simulation failed. Check if the server is running.");
    } finally {
        loader.style.display = 'none';
    }
}