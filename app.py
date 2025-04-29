

OPENROUTER_API_KEY =  "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"

ACCESS_TOKEN = 'EAAIZAmiyOmHYBOxf76Jw7HMCHJ8OnlYlZBPPZCczS4Eoe3sOFZAvF53zyCiRZAPy3rob08p0IY4V7ECuLqh6u2tkxcaN5GsavKpCrie7DlZCqy78LPMijalGDXKShiizBBVf9ZCxVIlSuRfiEqjMib9QfNvfbi4diOeQrjayhciGkuyUPd2OTTX0pdnZBy7Ifswg3jSG7DUEPFbXtRpGarWoWnCWLG67zZAdFLZANG5G6urbqneSpo5uNPvf0G7BWVeQZDZD'

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pytesseract
from PIL import Image
import json

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return '✅ API Know Your Fan está rodando!'

@app.route('/upload', methods=['POST'])
def upload_file():
    nome_digitado = request.form.get('name')
    cpf_digitado = request.form.get('cpf')
    endereco_digitado = request.form.get('address', '')

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
        'cpf_confere': resultado_cpf,
        'validacao_ia': validacao_ia
    })

def validar_texto_com_openrouter(texto_ocr):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY.strip()}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",
        "X-Title": "Know Your Fan"
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "Você é um assistente especializado em verificar documentos. Analise o texto extraído por OCR e identifique o nome completo e CPF."
            },
            {
                "role": "user",
                "content": f"Analise este texto extraído por OCR e identifique o nome completo e CPF: {texto_ocr}"
            }
        ]
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        try:
            data = response.json()
            mensagem = data['choices'][0]['message']['content']
            return mensagem
        except Exception as e:
            return f"Erro ao processar resposta: {str(e)}"
    else:
        return {
            "erro": f"Erro OpenRouter: {response.status_code}",
            "status": response.status_code
        }

# Dados do Facebook

BASE_URL = 'https://graph.facebook.com/v22.0'

@app.route('/social_real/profile', methods=['GET'])
def get_profile():
    url = f"{BASE_URL}/me"
    params = {
        'fields': 'id,name',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())

@app.route('/social_real/likes', methods=['GET'])
def get_likes():
    url = f"{BASE_URL}/me/likes"
    params = {
        'fields': 'name,category',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())

@app.route('/social_real/events', methods=['GET'])
def get_events():
    url = f"{BASE_URL}/me/events"
    params = {
        'fields': 'name,start_time,end_time',
        'access_token': ACCESS_TOKEN
    }
    response = requests.get(url, params=params)
    return jsonify(response.json())
def gerar_analise_com_ia(texto):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY.strip()}",
        "Content-Type": "application/json"
    }

    prompt = [
        {
            "role": "system",
            "content": "Você é um analista de comportamento de fãs de e-sports. A partir de nome, páginas curtidas e eventos, gere uma análise personalizada sobre os interesses do fã, nível de engajamento e comportamento online (casual, engajado, entusiasta, etc)."
        },
        {
            "role": "user",
            "content": texto
        }
    ]

    response = requests.post(url, headers=headers, json={
        "model": "openai/gpt-3.5-turbo",
        "messages": prompt
    })

    if response.status_code == 200:
        try:
            return response.json()['choices'][0]['message']['content']
        except Exception as e:
            return f"Erro ao interpretar resposta da IA: {str(e)}"
    else:
        return f"Erro ao conectar com OpenRouter: {response.status_code}"
@app.route('/social_real/analisar', methods=['GET'])
def analisar_perfil():
    perfil = requests.get(f"{BASE_URL}/me", params={'access_token': ACCESS_TOKEN}).json()
    likes = requests.get(f"{BASE_URL}/me/likes", params={'access_token': ACCESS_TOKEN}).json()
    eventos = requests.get(f"{BASE_URL}/me/events", params={'access_token': ACCESS_TOKEN}).json()

    # Coletar dados brutos
    nome = perfil.get("name", "Desconhecido")
    lista_likes = [item.get("name", "") for item in likes.get("data", [])]
    lista_eventos = [item.get("name", "") for item in eventos.get("data", [])]

    # Preparar o texto para IA
    texto_para_ia = f"""
    Nome: {nome}
    Páginas curtidas: {', '.join(lista_likes) or 'Nenhuma curtida encontrada'}
    Eventos participados: {', '.join(lista_eventos) or 'Nenhum evento encontrado'}
    """

    # Chamar função para gerar a análise com IA
    analise_gerada = gerar_analise_com_ia(texto_para_ia)

    return jsonify({
        "nome": nome,
        "likes_count": len(lista_likes),
        "eventos_count": len(lista_eventos),
        "analise": analise_gerada
    })
    
@app.route('/validar_link', methods=['POST'])
def validar_link():
    data = request.get_json()
    link = data.get('link', '')

    if not link:
        return jsonify({'error': 'Link não fornecido'}), 400

    prompt = f"Este é o link informado: {link}. Esse link é relevante para o perfil de um fã de e-sports?"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY.strip()}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "Você é um assistente especializado em validar links de perfis de fãs de e-sports com base no contexto de interesse do usuário."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)

        if response.status_code == 200:
            data = response.json()
            return jsonify({"analise": data['choices'][0]['message']['content']})
        elif response.status_code == 401:
            return jsonify({"error": "Token do OpenRouter inválido (401)"}), 401
        else:
            return jsonify({"error": f"Erro do OpenRouter: {response.status_code}"}), response.status_code

    except Exception as e:
        return jsonify({"error": f"Erro ao conectar com o OpenRouter: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
