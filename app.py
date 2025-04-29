OPENROUTER_API_KEY = "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"

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
from PIL import Image
import json 

def validar_texto_com_openrouter(texto_ocr):
    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer " + OPENROUTER_API_KEY,
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-3.5-turbo", 
        "messages": [
            {"role": "system", "content": "Você é um assistente que valida documentos extraídos via OCR."},
            {"role": "user", "content": f"Texto extraído do OCR:\n\n{texto_ocr}\n\nOrganize os dados de Nome, CPF e Endereço. Informe se falta algo."}
        ]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        mensagem = data['choices'][0]['message']['content']
        return mensagem
    else:
        print("Erro OpenRouter:", response.status_code, response.text)
        return f"Erro {response.status_code}: {response.text}"

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.route('/upload', methods=['POST'])

def upload_file():
    nome_digitado = request.form.get('name')
    cpf_digitado = request.form.get('cpf')
    endereco_digitado = request.form.get('endereco')

    # OCR
    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    text_extracted = pytesseract.image_to_string(Image.open(file_path))

    resultado_nome = nome_digitado.lower() in text_extracted.lower()
    resultado_cpf = cpf_digitado.lower() in text_extracted.lower()

    validacao_ia = validar_texto_com_openrouter(text_extracted)

    return jsonify({
        'ocr_text': text_extracted,
        'nome_digitado': nome_digitado,
        'cpf_digitado': cpf_digitado,
        'nome_confere': resultado_nome,
        'cpf_confere': resultado_cpf
    })
    
@app.route('/social', methods=['GET'])
def get_social_data():
    try:
        with open('social_data.json', 'r', encoding='utf-8') as file:
            dados = json.load(file)
        return jsonify(dados)
    except Exception as e:
        return jsonify({'error': 'Erro ao ler o arquivo de redes sociais', 'details': str(e)}), 500

