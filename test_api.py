import requests

# The URL of your local Flask server
url = 'http://127.0.0.1:5000/predict-chase'

# The mock data from a hypothetical frontend UI
match_data = {
    "batting_team": "Mumbai Indians",
    "bowling_team": "Chennai Super Kings",
    "city": "Mumbai",
    "runs_left": 50,
    "balls_left": 30,
    "wickets": 7,
    "target": 180
}

print("Sending request to the ML API...")

# Send the POST request
response = requests.post(url, json=match_data)

# Print the server's response
if response.status_code == 200:
    print("\n✅ API Response Received!")
    print(response.json())
else:
    print(f"❌ Error: {response.text}")