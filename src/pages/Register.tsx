import { useState } from "react";
import { Input } from "../components/Input";
import { Upload } from "../components/Upload";

export function Register() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resultadoValidacao, setResultadoValidacao] = useState<any>(null);
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!selectedFile) {
            alert('Por favor, selecione um documento');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', name);
        formData.append('cpf', cpf);
        formData.append('address', endereco);


        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Resposta do servidor:', data);
                setResultadoValidacao(data);
                alert('Arquivo enviado e validado com sucesso!');
            } else {
                alert(data.error || 'Erro ao enviar o arquivo!');
            }
        } catch (error) {
            console.error('Erro ao enviar o arquivo:', error);
            alert('Erro ao enviar o arquivo!');
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Cadastro do Fã</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                <Input placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                <Upload onFileSelect={(file) => setSelectedFile(file)} />

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mb-6">
                    Enviar
                </button>
            </form>

            {/* Mostrar o Resultado depois */}
            {resultadoValidacao && (
                <div className="mt-6 p-6 bg-gray-100 border rounded-xl w-full">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">📝 Resultado da Validação</h2>
                    <p><strong>OCR extraído:</strong> {resultadoValidacao.ocr_text}</p>
                    <p><strong>Nome digitado:</strong> {resultadoValidacao.nome_digitado || "Não informado"}</p>
                    <p><strong>CPF digitado:</strong> {resultadoValidacao.cpf_digitado || "Não informado"}</p>
                    <p><strong>Nome confere?</strong> {resultadoValidacao.nome_confere ? "✅ Sim" : "❌ Não"}</p>
                    <p><strong>CPF confere?</strong> {resultadoValidacao.cpf_confere ? "✅ Sim" : "❌ Não"}</p>

                    {resultadoValidacao.validacao_ia && (
                        <>
                            <h3 className="font-bold mt-4 text-gray-800">Análise via IA:</h3>
                            <pre className="whitespace-pre-wrap text-gray-700">
                                {JSON.stringify(resultadoValidacao.validacao_ia, null, 2)}
                            </pre>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
