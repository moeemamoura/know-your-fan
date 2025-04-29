import { useState } from "react";
import { Input } from "../components/Input";
import { Upload } from "../components/Upload";

export function Register() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        formData.append('endereco', endereco);

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Resposta do servidor:', data);
            alert('Arquivo enviado com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar o arquivo:', error);
            alert('Erro ao enviar o arquivo!');
        }

    }

    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Cadastro do Fã</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <Input placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />

                <Input placeholder="Endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                />

                {/* Upload de Documento */}
                <Upload onFileSelect={(file) => setSelectedFile(file)} />

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Enviar
                </button>
            </form>
        </div>
    );
}
