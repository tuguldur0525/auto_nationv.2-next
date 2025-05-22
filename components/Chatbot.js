import { useState } from "react"

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Сайн байна уу? Юу асуух вэ?" },
  ])
  const [input, setInput] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [isBotTyping, setIsBotTyping] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setMessages([...messages, { from: "user", text: input }])
    const userInput = input
    setInput("")
    setIsBotTyping(true)
    // AI API руу илгээх
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      })
      const data = await res.json()
      setMessages((msgs) => [...msgs, { from: "bot", text: data.reply }])
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "AI-с хариу авахад алдаа гарлаа." },
      ])
    } finally {
      setIsBotTyping(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: "linear-gradient(135deg, #1976d2 60%, #42a5f5 100%)",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 2px 8px #0003",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label="Open chatbot"
      >
        <span style={{ fontSize: 28, color: "#fff" }}>💬</span>
      </button>
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 340,
        maxWidth: "95vw",
        background: "linear-gradient(135deg, #f5fafd 60%, #e3f2fd 100%)",
        border: "1.5px solid #b3c6e0",
        borderRadius: 18,
        boxShadow: "0 4px 24px #0002",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px 12px 16px",
          borderBottom: "1px solid #e3eaf2",
          fontWeight: 700,
          fontSize: 18,
          background: "linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)",
          color: "#fff",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🤖</span> Чатбот
        </span>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
            opacity: 0.8,
            transition: "opacity 0.2s",
          }}
          aria-label="Close chatbot"
          onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 0.8)}
        >
          ×
        </button>
      </div>
      {/* Chat area */}
      <div
        style={{
          flex: 1,
          minHeight: 220,
          maxHeight: 340,
          overflowY: "auto",
          padding: 16,
          background: "#f5fafd",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background:
                  msg.from === "user"
                    ? "linear-gradient(135deg, #1976d2 60%, #42a5f5 100%)"
                    : "#e3f2fd",
                color: msg.from === "user" ? "#fff" : "#222",
                borderRadius: 16,
                padding: "8px 16px",
                margin: "2px 0",
                maxWidth: "80%",
                fontSize: 15,
                boxShadow:
                  msg.from === "user"
                    ? "0 2px 8px #1976d233"
                    : "0 1px 4px #90caf933",
                transition: "background 0.2s",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isBotTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <span
              style={{
                display: "inline-block",
                background: "#e3f2fd",
                color: "#222",
                borderRadius: 16,
                padding: "8px 16px",
                fontSize: 15,
                maxWidth: "80%",
                opacity: 0.7,
                fontStyle: "italic",
              }}
            >
              Бот бичиж байна...
            </span>
          </div>
        )}
      </div>
      {/* Input area */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #e3eaf2",
          background: "#f5fafd",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          padding: 10,
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          style={{
            flex: 1,
            border: "1.5px solid #b3c6e0",
            borderRadius: 24,
            padding: "10px 16px",
            outline: "none",
            fontSize: 15,
            background: "#fff",
            transition: "border 0.2s, box-shadow 0.2s",
            boxShadow: "0 1px 4px #b3c6e022",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Асуултаа бичнэ үү..."
        />
        <button
          onClick={handleSend}
          style={{
            border: "none",
            background: input.trim()
              ? "linear-gradient(135deg, #1976d2 60%, #42a5f5 100%)"
              : "#b3c6e0",
            color: "#fff",
            padding: "0 18px",
            borderRadius: 24,
            fontSize: 18,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: input.trim() ? "pointer" : "not-allowed",
            transition: "background 0.2s, color 0.2s",
            boxShadow: input.trim() ? "0 2px 8px #1976d233" : "none",
          }}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <span style={{ fontSize: 20, marginRight: 2 }}>➤</span>
        </button>
      </div>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 500px) {
          div[style*='position: fixed'] {
            width: 98vw !important;
            right: 1vw !important;
            bottom: 1vw !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}
