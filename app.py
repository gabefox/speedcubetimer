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
    writer.writerow(['Solve Number', 'Time (seconds)', 'Date'])
    
    times = request.form.get('times', '[]')
    times = json.loads(times)
    
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
    
    # Set up PDF styling
    pdf.set_font('Arial', 'B', 16)
    pdf.cell(0, 10, 'Speedcubing Solve Times', ln=True, align='C')
    pdf.set_font('Arial', '', 12)
    
    # Add header
    pdf.cell(60, 10, 'Solve Number', 1)
    pdf.cell(60, 10, 'Time (seconds)', 1)
    pdf.cell(70, 10, 'Date', 1)
    pdf.ln()
    
    # Create the PDF
    pdf_output = pdf.output(dest='S').encode('latin-1')
    
    # Create response
    response = make_response(pdf_output)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f"attachment; filename=solve_times_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return response
