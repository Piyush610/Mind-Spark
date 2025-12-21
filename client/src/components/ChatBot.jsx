import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "model", text: "Hi there! I'm your AI study buddy. Ask me anything!" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Reset chat when user changes (e.g. login/logout)
    useEffect(() => {
        setMessages([
            { role: "model", text: "Hi there! I'm your AI study buddy. Ask me anything!" },
        ]);
        setIsOpen(false);
    }, [user?.email]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Filter out the initial welcome message to ensure history starts with 'user' or is empty
            const historyMessages = messages.filter((_, index) => index !== 0);

            const history = historyMessages.map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: [{ text: m.text }]
            }));

            const response = await fetch("http://localhost:5000/api/chat/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: history,
                    message: input
                }),
            });

            const data = await response.json();
            const botMessage = { role: "model", text: data.response };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "model", text: "Oops! I encountered an error. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null; // Only show for logged in users

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 h-96 bg-[var(--bg-secondary)] rounded-2xl shadow-[var(--shadow-soft)] border border-[var(--border-color)] flex flex-col overflow-hidden animate-fade-in origin-bottom-right">
                    {/* Header */}
                    <div className="p-4 bg-[var(--primary)] text-white flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <h3 className="font-bold">Study Buddy</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            Close
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-tertiary)]">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                        ? "bg-[var(--primary)] text-white rounded-br-none"
                                        : "bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-none shadow-sm"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-[var(--bg-secondary)] p-3 rounded-2xl rounded-bl-none border border-[var(--border-color)] flex gap-1 items-center">
                                    <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-[var(--bg-secondary)] border-t border-[var(--border-color)]">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] focus:outline-none focus:border-[var(--primary)] text-sm"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="p-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-[var(--primary)] text-white rounded-full shadow-lg hover:bg-[var(--primary-hover)] transition-all transform hover:scale-110 flex items-center justify-center text-3xl"
                >
                    💬
                </button>
            )}
        </div>
    );
};
