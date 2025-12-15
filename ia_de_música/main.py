from fastapi import FastAPI, Form
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import traceback

# ─────────────────────────────────────────────
# APP
# ─────────────────────────────────────────────

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# GEMINI CLIENT (BASE SIMPLES)
# ─────────────────────────────────────────────

client = genai.Client(
    api_key="key"
)

# ─────────────────────────────────────────────
# PROMPT FIXO (SÓ MÚSICA)
# ─────────────────────────────────────────────

MUSIC_SYSTEM_PROMPT = """
Você é um assistente especializado exclusivamente em música.

Você pode falar apenas sobre:
- Teoria musical
- História da música
- Composição
- Harmonia, campo harmônico, acordes, escalas
- Letras e melodias
- Ritmo, BPM, tonalidade
- Instrumentos musicais
- Gêneros musicais
- Artistas musicais (somente músicos, cantores, compositores, produtores ou bandas)

Se a pergunta não for sobre música ou artistas musicais,
responda educadamente:
"Só posso falar sobre música e artistas musicais."
Mas pode ter uma conversa de amigos, mas sem distoar da musica.
Ensinar tambem
"""

# ─────────────────────────────────────────────
# ENDPOINT
# ─────────────────────────────────────────────

@app.post("/")
async def gerar_resposta(
    texto: Optional[str] = Form(None)
):
    try:
        user_prompt = texto.strip() if texto else "Olá! Vamos falar de música 🎵"

        final_prompt = f"""
{MUSIC_SYSTEM_PROMPT}

Pergunta do usuário:
{user_prompt}
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=final_prompt
        )

        return {
            "response": response.text
        }

    except Exception as e:
        return {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
