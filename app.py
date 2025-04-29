OPENROUTER_API_KEY = "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"

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
from PIL import Image
import json 
from flask import Flask, jsonify
import requests

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
    
# SEU ACCESS TOKEN AQUI
ACCESS_TOKEN = 'EAAIZAmiyOmHYBO3N0XNqa6R0cS4x7CnHOb51NaufnLIhxKRDh0J1d1bPqTHH1QwPbc88AoAt26yvnT5MDMhxpmiYULmsGQTqzZBu4hCx5DfKGWpC0sLHCRLV8V1AJ1V16m2d7gOQtYYZBcJwO7gQRDZCDaDqIY4WkRQLMUnPxbs21jiXdWxrjybJaZA3sMk3h142cpyT94mf7wMpNkhUTVDLkihjArYC4ElrdcnGJ4GEYgSTwfxfLd705Oq7ZAPAZDZD'

# Base da API do Facebook
BASE_URL = 'https://graph.facebook.com/v22.0'

#ID e Nome
@app.route('/social_real/profile', methods=['GET'])
def get_profile():
    url = f"{BASE_URL}/me"
    params = {
        'fields': 'id,name',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())

# Peginas curtidas
@app.route('/social_real/likes', methods=['GET'])
def get_likes():
    url = f"{BASE_URL}/me/likes"
    params = {
        'fields': 'name,category',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())

# eventos
@app.route('/social_real/events', methods=['GET'])
def get_events():
    url = f"{BASE_URL}/me/events"
    params = {
        'fields': 'name,start_time,end_time',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(debug=True)
