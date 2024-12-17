import os
from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "speedcubing-timer-secret"

@app.route('/')
def index():
    return render_template('index.html')
