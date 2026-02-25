class ConversationMemory:
    def __init__(self, max_history=10):
        self.max_history = max_history
        self.history = []

    def add(self, role, content):
        self.history.append({"role": role, "content": content})
        self.history = self.history[-self.max_history:]

    def get(self):
        return self.history