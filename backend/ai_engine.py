from memory import ConversationMemory
from prompts import SYSTEM_PROMPT

memory = ConversationMemory()

def generate_ai_response(message):

    memory.add("user", message)

    # Temporary simulated intelligence
    response = intelligent_logic(message)

    memory.add("assistant", response)

    return response


def intelligent_logic(message):
    lower = message.lower()

    if "hello" in lower:
        return "Hello , How can I assist you today?"

    if "who are you" in lower:
        return "I am your advanced AI assistant powered by a Python backend."

    if "time" in lower:
        from datetime import datetime
        return f"Current time is {datetime.now().strftime('%H:%M:%S')}"

    return "Interesting question. In the full AI version, I can provide deep answers."