from app import app
from flask import request, send_file, jsonify
from reportlab.lib.pagesizes import A4, letter
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import PageTemplate, Frame, Spacer
from reportlab.lib.units import mm
import io
from pymongo import MongoClient

#connencting with the database (MongoDB)
client = MongoClient('mongodb://localhost:27017/')
db = client['pdf-generator']
collection = db['pdf-Content']



@app.route('/')
def dk():
    return "hello dk"

def addPageNumber(canvas, doc):
    """
    Add the page number
    """
    page_num = canvas.getPageNumber()
    text = "%s" % page_num
    canvas.drawRightString(200*mm, 20*mm, text)

@app.route('/create-pdf', methods=['POST'])
def create_pdf():
    data = request.json

    if not data or not any(data.values()):
        return jsonify({"error": "Empty data provided"}), 400

    # Check for duplicate data
    if collection.find_one(data):
        return jsonify({"error": "Duplicate data provided"}), 409

    collection.insert_one(data)

    pdf_output = io.BytesIO()

    # Set up the PDF document with A4 page size
    doc = SimpleDocTemplate(pdf_output, pagesize=letter)

    # style sheet
    custom_style = ParagraphStyle(
        name='CustomStyle',
        fontName='Helvetica',
        fontSize=14,
        leading=18,
        wordWrap=True,
        wordSpacing=60,
        # leftIndent=inch/2,
        # rightIndent=inch/2,  
        textColor='black',
        # backColor='yellow'  
    )


    content = []
    for key, value in data.items():
        paragraph = Paragraph(f"<b>{key.capitalize()}:</b> {value}", custom_style)
        content.append(paragraph)


    doc.build(content,onFirstPage=addPageNumber, onLaterPages=addPageNumber)
    pdf_output.seek(0)

    response = send_file(pdf_output, as_attachment=True, download_name='document.pdf', mimetype='application/pdf')
    response.status_code = 201 # 201 means created successfully
    print("file created successfully")

    return response