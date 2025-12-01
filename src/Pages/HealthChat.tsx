
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  Calendar,
  FileText,
  Pill,
  Heart,
} from "lucide-react";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface Conversation {
  id: string;
  // add any extra fields that base44 returns if needed
}

interface QuickQuestion {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
}

export default function HealthChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void initConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initConversation = async () => {
    const conv = (await base44.agents.createConversation({
      agent_name: "HealthAssistant",
      metadata: { name: "Health Chat" },
    })) as Conversation;

    setConversation(conv);

    // Subscribe to updates
    base44.agents.subscribeToConversation(conv.id, (data: { messages?: ChatMessage[] }) => {
      if (data?.messages) {
        setMessages(data.messages);
      }
    });

    // Add welcome message
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! 👋 I'm your MediCare Health Assistant. I can help you with:\n\n• **Appointment enquiries** - Check your bookings\n• **Health tips** - General wellness advice\n• **Preparation guides** - Get ready for procedures\n• **Hospital information** - Services & directions\n\nHow can I assist you today?",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !conversation || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Optimistic add
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      await base44.agents.addMessage(conversation.id, {
        role: "user",
        content: userMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions: QuickQuestion[] = [
    { icon: Calendar, text: "View my appointments" },
    { icon: FileText, text: "How to prepare for surgery?" },
    { icon: Pill, text: "Medication reminders" },
    { icon: Heart, text: "General health tips" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={createPageUrl("Dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AI Health Assistant</span>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                    ? "bg-teal-600 text-white"
                    : "bg-white border shadow-sm"
                    }`}
                >
                  {message.role === "user" ? (
                    <p className="text-sm">{message.content}</p>
                  ) : (

                    <div className="text-sm prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4 mb-2">{children}</ul>
                          ),
                          li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">{children}</strong>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>


                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="bg-white"
                  onClick={() => {
                    setInput(q.text);
                  }}
                >
                  <q.icon className="w-4 h-4 mr-2" />
                  {q.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSend();
              }}
              className="flex gap-3"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your health..."
                className="flex-1 h-12 border-gray-200"
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 h-12 w-12"
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              <Sparkles className="w-3 h-3 inline mr-1" />
              AI-powered assistance • For emergencies, call +27 12 345 6700
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

