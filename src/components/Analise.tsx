import { useState } from "react";

export function Analise() {
    const [analise, setAnalise] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function fetchAnalise() {
        setLoading(true);
        setErro("");
        try {
            const response = await fetch("http://127.0.0.1:5000/social_real/analisar");
            const data = await response.json();
            setAnalise(data.analise);
        } catch (error) {
            setErro("Erro ao buscar análise.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🔎 Análise do Perfil</h2>

            {/* Botão para gerar análise */}
            <button
                onClick={fetchAnalise}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mb-6"
            >
                Gerar Análise
            </button>

            {/* Resultado */}
            {loading ? (
                <p className="text-gray-500">Carregando análise...</p>
            ) : erro ? (
                <p className="text-red-500">{erro}</p>
            ) : analise ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-left">
                    {typeof analise === 'object'
                        ? JSON.stringify(analise, null, 2)
                        : analise}
                </div>
            ) : (
                <p className="text-gray-400">Clique no botão acima para gerar uma análise</p>
            )}
        </div>
    );
}
