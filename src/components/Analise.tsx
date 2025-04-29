import { useState } from "react";

// Prop opcional para avisar que a análise terminou
type AnaliseProps = {
    onAnaliseCompleta?: () => void;
};

// Função que interpreta o texto da análise
function interpretarResposta(resposta: string): "aprovado" | "reprovado" | "indefinido" {
    const texto = resposta.toLowerCase();
    if (
        texto.includes("fã de e-sports") ||
        texto.includes("curtiu páginas de e-sports") ||
        texto.includes("curtiu as páginas oficiais de brawl stars") ||
        texto.includes("cs:go") ||
        texto.includes("interesse por jogos") ||
        texto.includes("diversidade de interesses")
    ) {
        return "aprovado";
    }
    else if (texto.includes("não") || texto.includes("não é relevante")) {
        return "reprovado";
    } else {
        return "indefinido";
    }
}

export function Analise({ onAnaliseCompleta }: AnaliseProps) {
    const [analise, setAnalise] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function fetchAnalise() {
        setLoading(true);
        setErro("");
        try {
            const response = await fetch("http://127.0.0.1:5000/social_real/analisar");
            const data = await response.json();
            const texto = data.analise;

            setAnalise(texto);

            if (onAnaliseCompleta) {
                onAnaliseCompleta();
            }
        } catch (error) {
            setErro("Erro ao buscar análise.");
        } finally {
            setLoading(false);
        }
    }

    const status = interpretarResposta(analise);

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🔎 Análise do Perfil</h2>

            <button
                onClick={fetchAnalise}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mb-6"
            >
                Gerar Análise
            </button>

            {loading ? (
                <p className="text-gray-500">Carregando análise...</p>
            ) : erro ? (
                <p className="text-red-500">{erro}</p>
            ) : analise ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-left w-full">
                    <p className="mb-6">{analise}</p>

                    <div className="flex flex-col items-center mt-6">
                        {status === "aprovado" && (
                            <div className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg mb-4">
                                ✅ Perfil Aprovado como Relevante como fã de e-sports!
                            </div>
                        )}
                        {status === "reprovado" && (
                            <div className="bg-red-100 text-red-800 font-bold py-2 px-4 rounded-lg mb-4">
                                ❌ Perfil Não é Relevante.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Clique no botão acima para gerar uma análise</p>
            )}
        </div>
    );
}
