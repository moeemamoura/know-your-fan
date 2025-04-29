# 🎮 Know Your Fan [HARD Challenge]

Projeto desenvolvido como parte de um desafio de experiência conversacional para a FURIA. O objetivo é criar uma solução que colete e valide o máximo de informações sobre um usuário para entender seu perfil como fã de e-sports.

## 🧠 Funcionalidades

- ✅ **Cadastro do Fã**  
  Formulário para coleta de dados básicos: nome, CPF e endereço, com máscara no campo de CPF (`react-input-mask`).

- 🖼️ **Upload de Documento com OCR + IA**  
  - O usuário pode subir uma imagem de documento.
  - A imagem é processada usando **OCR (Tesseract)** para extrair texto.
  - A IA (OpenRouter API com GPT-3.5-turbo) valida se nome e CPF conferem com o documento.

- 🤖 **Análise de Perfil via Facebook Graph API**  
  - Coleta dados como: nome, páginas curtidas e eventos.
  - A IA interpreta o comportamento do fã com base nesses dados.
  - Mostra a análise completa do perfil, com uma avaliação se o fã é **relevante ou não** para e-sports.

- 🔗 **Validação de Links de Perfis**  
  - O usuário cola um link de perfil de e-sports.
  - A IA avalia se o link está relacionado ao perfil do fã.
  - Mostra se o link é **aprovado** como relevante.

## 🛠️ Tecnologias e Ferramentas

### Front-end
- [React + Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Input Mask](https://www.npmjs.com/package/react-input-mask)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### Back-end
- [Python 3 + Flask](https://flask.palletsprojects.com/)
- [Flask-CORS](https://flask-cors.readthedocs.io/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [Pillow](https://pypi.org/project/Pillow/)
- [OpenRouter API (GPT-3.5-turbo)](https://openrouter.ai/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)

## 🧪 Como rodar o projeto

### 🖥️ Front-end

```bash
# Instale as dependências
npm install

# Rode o Vite
npm run dev
```

### ⚙️ Back-end (Flask)

```bash
# Instale as dependências
pip install flask flask-cors pytesseract pillow requests

# Rode o backend
python app.py
```

> **Requisitos**: Python 3, Node.js, Tesseract OCR instalado no sistema (`tesseract --version`)

## 📁 Estrutura do Projeto

```
├── public/
├── src/
│   ├── components/
│   │   ├── Input.tsx
│   │   ├── Upload.tsx
│   │   ├── Analise.tsx
│   │   └── ValidarLink.tsx
│   ├── pages/
│   │   └── Register.tsx
│   ├── App.tsx
│   └── main.tsx
├── uploads/            # Pasta onde o Flask salva imagens
└── app.py              # Servidor Flask
```

## 📌 Observações

- O projeto foi pensado para simular uma experiência real de **KYC (Know Your Customer)**, voltado para e-sports.
- O backend e a IA podem ser facilmente adaptados para outro tipo de análise (ex: validação de perfil para eventos, promoções, patrocínios etc).
- O app não armazena dados, todas as validações são feitas em tempo real.

## 👩‍💻 Feito por

**Jessica (Moema Moura)**  
Estudante de Sistemas de Informação • Projeto para FURIA  
🚀 _"Conhecer o fã é o primeiro passo para criar conexões reais!"_
