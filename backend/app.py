from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import webbrowser

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ✅ Simple in-memory session (for demo)
conversation_history = []
user_memory = {
    "name": None
}

def handle_commands(message: str):
    lower = message.lower()

    if "open youtube" in lower:
        webbrowser.open("https://youtube.com")
        return "Opening YouTube."

    if "open google" in lower:
        webbrowser.open("https://google.com")
        return "Opening Google."

    if "open github" in lower:
        webbrowser.open("https://github.com")
        return "Opening GitHub."

    return None

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_message = data.get("message")

        if not user_message:
            return jsonify({"response": "Empty message received."})

        # ✅ Check smart commands first
        command_response = handle_commands(user_message)
        if command_response:
            return jsonify({"response": command_response})

        # ✅ Detect name learning
        if "my name is" in user_message.lower():
            name = user_message.lower().split("my name is")[-1].strip().title()
            user_memory["name"] = name
            return jsonify({"response": f"Nice to meet you, {name}! I'll remember your name."})

        # ✅ Inject memory context
        system_prompt = "You are a helpful AI voice assistant."

        if user_memory["name"]:
            system_prompt += f" The user's name is {user_memory['name']}."

        messages = [
            {"role": "system", "content": system_prompt},
        ]

        # include short history
        messages.extend(conversation_history[-6:])

        messages.append({"role": "user", "content": user_message})

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages
        )

        ai_reply = completion.choices[0].message.content

        # ✅ Save history
        conversation_history.append({"role": "user", "content": user_message})
        conversation_history.append({"role": "assistant", "content": ai_reply})

        return jsonify({"response": ai_reply})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"response": "AI backend error occurred."})

if __name__ == "__main__":
    app.run(debug=True)