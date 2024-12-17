import os
import csv
import json
from io import StringIO
from datetime import datetime
from flask import Flask, render_template, send_file, make_response, request
from fpdf import FPDF

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "speedcubing-timer-secret"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/export/csv', methods=['POST'])
def export_csv():
    si = StringIO()
    writer = csv.writer(si)
    
    times = request.form.get('times', '[]')
    times = json.loads(times)
    
    # Calculate statistics
    best_solve = min(times) if times else 0
    session_avg = sum(times) / len(times) if times else 0
    
    # Write header and statistics
    writer.writerow(['Speedcubing Session Statistics'])
    writer.writerow(['Best Solve', f"{best_solve:.2f}"])
    writer.writerow(['Session Average', f"{session_avg:.2f}"])
    writer.writerow([])  # Empty row for spacing
    writer.writerow(['Solve Number', 'Time (seconds)', 'Date'])
    
    for i, time in enumerate(times, 1):
        writer.writerow([i, f"{time:.2f}", datetime.now().strftime('%Y-%m-%d')])
    
    # Create response
    output = make_response(si.getvalue())
    output.headers["Content-Disposition"] = f"attachment; filename=solve_times_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    output.headers["Content-type"] = "text/csv"
    return output

@app.route('/export/pdf', methods=['POST'])
def export_pdf():
    pdf = FPDF()
    pdf.add_page()
    
    times = request.form.get('times', '[]')
    times = json.loads(times)
    
    # Calculate statistics
    best_solve = min(times) if times else 0
    session_avg = sum(times) / len(times) if times else 0
    
    # Set up PDF styling
    pdf.set_font('Arial', 'B', 20)
    pdf.cell(0, 15, 'Speedcubing Session Report', ln=True, align='C')
    
    # Add statistics
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Session Statistics', ln=True)
    pdf.set_font('Arial', '', 12)
    pdf.cell(60, 8, f'Best Solve: {best_solve:.2f}s', ln=True)
    pdf.cell(60, 8, f'Session Average: {session_avg:.2f}s', ln=True)
    pdf.ln(5)
    
    # Add solve times table
    pdf.set_font('Arial', 'B', 14)
    pdf.cell(0, 10, 'Solve Times', ln=True)
    pdf.set_font('Arial', '', 12)
    
    # Add header
    pdf.cell(60, 10, 'Solve Number', 1)
    pdf.cell(60, 10, 'Time (seconds)', 1)
    pdf.cell(70, 10, 'Date', 1)
    pdf.ln()
    
    # Add solve times
    for i, time in enumerate(times, 1):
        pdf.cell(60, 10, str(i), 1)
        pdf.cell(60, 10, f"{time:.2f}", 1)
        pdf.cell(70, 10, datetime.now().strftime('%Y-%m-%d'), 1)
        pdf.ln()
    
    # Create the PDF
    pdf_output = pdf.output(dest='S').encode('latin-1')
    
    # Create response
    response = make_response(pdf_output)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f"attachment; filename=solve_times_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return response
