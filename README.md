# 🏏 IPL 2026 Winner Predictor AI

![IPL Predictor AI](https://img.shields.io/badge/Status-Completed-success) 
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg) 
![Flask](https://img.shields.io/badge/Flask-Backend-black) 
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-Machine%20Learning-orange)

A full-stack, end-to-end Machine Learning web application that predicts real-time IPL match outcomes and simulates entire tournament seasons using historical and current 2026 data.

## 🌟 Key Features

* **Live Run-Chase Predictor:** Calculates real-time win probabilities for the batting and bowling teams based on target score, runs left, balls remaining, and current wickets down.
* **Monte Carlo Tournament Simulator:** Plays out the remainder of the IPL season 1,000 times to calculate the mathematical probability of each team winning the overall championship.
* **Interactive Visual Analytics:** Features dynamic Doughnut and Bar charts built with Chart.js to visualize live probabilities and tournament leaderboards.
* **Modern UI/UX:** A responsive, dark-mode dashboard styled with CSS Glassmorphism.

## 🛠️ Tech Stack

**Machine Learning & Data Processing:**
* **Python:** Core logic and scripting.
* **Scikit-Learn:** Logistic Regression modeling, Data Pipelines, and OneHotEncoding.
* **Pandas & NumPy:** Data cleaning, manipulation, and statistical calculations.
* **Data Source:** Cricsheet (Historical + Latest 2026 Match Data).

**Backend API:**
* **Flask:** RESTful API creation to serve ML model predictions.
* **Flask-CORS:** Handling Cross-Origin Resource Sharing.

**Frontend UI:**
* **HTML5 & CSS3:** Structural layout and Glassmorphism design.
* **JavaScript (Vanilla):** DOM manipulation and Fetch API for backend communication.
* **Chart.js:** Data visualization.

## 🧠 How the AI Works

1. **In-Play Model:** The Logistic Regression model was trained on thousands of past IPL matches. It dynamically evaluates the Current Run Rate (CRR) against the Required Run Rate (RRR) and factors in the historical strength of the specific teams and host city to output a live win percentage.
2. **Tournament Simulation:** To predict the eventual champion, the system generates a schedule of remaining matches. It uses the pre-match ML model to get the win probability of every single matchup, and then runs a **Monte Carlo Simulation** (1,000 iterations) through the playoff brackets to generate a definitive leaderboard.


IPL-Winner-Prediction-2026/
│
├── models/                     # Saved Machine Learning models (.pkl)
├── frontend/                   # UI files
│   ├── index.html              # Main dashboard
│   ├── style.css               # Glassmorphism styling
│   └── script.js               # API calls and Chart.js logic
│
├── app.py                      # Flask REST API backend
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
