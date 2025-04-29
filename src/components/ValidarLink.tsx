import { useState, useEffect } from "react";

export function ValidarLink() {
    const [link, setLink] = useState("");
    const [resposta, setResposta] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [podeValidar, setPodeValidar] = useState(false);

    function interpretarResposta(resposta: string): "aprovado" | "reprovado" | "indefinido" {
        const texto = resposta.toLowerCase();
        if (texto.includes("sim") || texto.includes("relevante") || texto.includes("é relevante")) {
            return "aprovado";
        } else if (texto.includes("não") || texto.includes("não é relevante")) {
            return "reprovado";
        } else {
            return "indefinido";
        }
    }

    async function verificarDadosFacebook() {
        try {
            const response = await fetch("http://127.0.0.1:5000/social_real/profile");
            if (response.ok) {
                setPodeValidar(true);
            } else {
                setPodeValidar(false);
            }
        } catch (error) {
            setPodeValidar(false);
        }
    }

    useEffect(() => {
        verificarDadosFacebook();
    }, []);

    async function handleValidarLink() {
        if (!link) {
            alert("Por favor, digite um link.");
            return;
        }

        setLoading(true);
        setErro("");
        setResposta("");
        try {
            const response = await fetch("http://127.0.0.1:5000/validar_link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ link })
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setErro("⚠️ Dados do Facebook não estão disponíveis. Verifique se o token ainda é válido.");
                } else {
                    setErro(data.error || "Erro ao validar o link.");
                }
                return;
            }

            setResposta(data.analise);
        } catch (error) {
            setErro("Erro na comunicação com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-white shadow-xl border border-gray-200 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🔗 Validação de Link de Perfil</h2>
            {podeValidar ? (
                <>
                    {!resposta ? ( // Se ainda não tem resposta: mostra o botão
                        <>
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                placeholder="Cole o link do perfil aqui..."
                                className="border border-gray-300 p-2 rounded w-full mb-4"
                            />

                            <button
                                onClick={handleValidarLink}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded mb-6"
                                disabled={loading}
                            >
                                {loading ? "Gerando análise..." : "Validar Link"}
                            </button>
                        </>
                    ) : ( // Se já tem resposta: mostra o resultado
                        <div className="flex flex-col items-center mt-6">
                            {interpretarResposta(resposta) === "aprovado" && (
                                <div className="bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg mb-4">
                                    ✅ Perfil Aprovado como Relevante!
                                </div>
                            )}

                            {interpretarResposta(resposta) === "reprovado" && (
                                <div className="bg-red-100 text-red-800 font-bold py-2 px-4 rounded-lg mb-4">
                                    ❌ Perfil Não é Relevante.
                                </div>
                            )}

                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-left border-t pt-4 mt-4">
                                {resposta}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500 text-center">
                    ⚠️ Para validar o link, conecte seu perfil do Facebook primeiro.
                </p>
            )}

        </div>
    );
}
