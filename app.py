from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from itertools import permutations

app = Flask(__name__)
CORS(app)

# 1. Load Models
print("--- Loading Machine Learning Models ---")
try:
    in_play_model = pickle.load(open('models/ipl_win_predictor.pkl', 'rb'))
    pre_match_model = pickle.load(open('models/ipl_tournament_predictor.pkl', 'rb'))
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")

# 2. Endpoint: In-Play Run Chase
@app.route('/predict-chase', methods=['POST'])
def predict_chase():
    try:
        data = request.get_json()
        target = data['target']
        runs_left = data['runs_left']
        balls_left = data['balls_left']
        crr = ((target - runs_left) * 6) / (120 - balls_left)
        rrr = (runs_left * 6) / balls_left
        
        input_df = pd.DataFrame({
            'batting_team': [data['batting_team']], 'bowling_team': [data['bowling_team']], 'city': [data['city']],
            'runs_left': [runs_left], 'balls_left': [balls_left], 'wickets_remaining': [data['wickets']],
            'target': [target], 'crr': [crr], 'rrr': [rrr]
        })
        result = in_play_model.predict_proba(input_df)
        return jsonify({'batting_team_prob': round(result[0][1] * 100, 2), 'bowling_team_prob': round(result[0][0] * 100, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 3. Endpoint: Full Tournament Simulation
@app.route('/simulate-tournament', methods=['GET'])
def simulate_tournament():
    try:
        active_teams = ['Chennai Super Kings', 'Delhi Capitals', 'Gujarat Titans', 'Kolkata Knight Riders', 
                        'Lucknow Super Giants', 'Mumbai Indians', 'Punjab Kings', 'Rajasthan Royals', 
                        'Royal Challengers Bengaluru', 'Sunrisers Hyderabad']
        home_cities = {'Chennai Super Kings': 'Chennai', 'Delhi Capitals': 'Delhi', 'Gujarat Titans': 'Ahmedabad',
                       'Kolkata Knight Riders': 'Kolkata', 'Lucknow Super Giants': 'Lucknow', 'Mumbai Indians': 'Mumbai',
                       'Punjab Kings': 'Chandigarh', 'Rajasthan Royals': 'Jaipur', 'Royal Challengers Bengaluru': 'Bengaluru',
                       'Sunrisers Hyderabad': 'Hyderabad'}

        matchups = []
        for home_team, away_team in permutations(active_teams, 2):
            matchups.append({'team1': home_team, 'team2': away_team, 'city': home_cities[home_team]})
        
        schedule_df = pd.DataFrame(matchups)
        schedule_df['team1_win_prob'] = pre_match_model.predict_proba(schedule_df[['team1', 'team2', 'city']])[:, 1]

        def simulate_playoff_match(t1, t2):
            m_data = pd.DataFrame([{'team1': t1, 'team2': t2, 'city': 'Ahmedabad'}])
            prob = pre_match_model.predict_proba(m_data)[0][1]
            return t1 if np.random.rand() < prob else t2

        championships_won = []
        for _ in range(1000):
            points = {team: 0 for team in active_teams}
            for _, row in schedule_df.iterrows():
                if np.random.rand() < row['team1_win_prob']: points[row['team1']] += 2
                else: points[row['team2']] += 2
            
            t4 = [t for t, p in sorted(points.items(), key=lambda x: x[1], reverse=True)[:4]]
            q1w = simulate_playoff_match(t4[0], t4[1])
            q1l = t4[1] if q1w == t4[0] else t4[0]
            ew = simulate_playoff_match(t4[2], t4[3])
            q2w = simulate_playoff_match(q1l, ew)
            championships_won.append(simulate_playoff_match(q1w, q2w))

        res = pd.Series(championships_won).value_counts(normalize=True) * 100
        standings = {t: 0.0 for t in active_teams}
        for t, p in res.items(): standings[t] = round(p, 2)
        return jsonify(dict(sorted(standings.items(), key=lambda x: x[1], reverse=True)))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# --- THE STARTER MOTOR ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)