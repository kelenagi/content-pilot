"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import { getSettings } from "@/lib/store";
import {
  Send,
  Copy,
  Check,
  Bot,
  User,
  Settings,
  Sparkles,
  FileText,
  AtSign,
  Image as ImageIcon,
  Briefcase,
} from "lucide-react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const quickPrompts = [
  { icon: FileText, labelEn: "Blog Post", labelId: "Postingan Blog", prompt: "Write a 500-word SEO-optimized blog post about" },
  { icon: AtSign, labelEn: "Tweet Thread", labelId: "Thread Tweet", prompt: "Create a viral tweet thread (5-7 tweets) about" },
  { icon: ImageIcon, labelEn: "Instagram Caption", labelId: "Caption Instagram", prompt: "Write an engaging Instagram caption with hashtags about" },
  { icon: Briefcase, labelEn: "LinkedIn Post", labelId: "Postingan LinkedIn", prompt: "Write a professional LinkedIn post about" },
];

export default function ChatPage() {
  const { locale } = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const settings = getSettings();
  const isConfigured = settings.baseUrl && settings.apiKey && settings.model;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const systemMessage: Message = {
      role: "system",
      content: t("chat.system.prompt", locale),
    };

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const apiMessages = [systemMessage, ...newMessages];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed JSON chunks
          }
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `${t("chat.error", locale)}\n\n${msg}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function handleQuickPrompt(prompt: string) {
    setInput(prompt + " ");
    textareaRef.current?.focus();
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-lg px-4 text-center">
              <div className="mx-auto mb-6 inline-flex rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-950">
                <Sparkles size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                {t("chat.welcome", locale)}
              </h2>
              <p className="mb-8 text-gray-600 dark:text-gray-400">
                {t("chat.welcome.desc", locale)}
              </p>

              {!isConfigured && (
                <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  <p className="mb-2 font-medium">{t("chat.configure", locale)}</p>
                  <Link
                    href="/settings"
                    className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    <Settings size={14} />
                    {t("nav.settings", locale)}
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {quickPrompts.map(({ icon: Icon, labelEn, labelId, prompt }) => (
                  <button
                    key={labelEn}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-left text-sm text-gray-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-800 dark:hover:bg-indigo-950"
                  >
                    <Icon size={16} className="shrink-0 text-indigo-500" />
                    {locale === "en" ? labelEn : labelId}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-6 animate-fade-in ${msg.role === "user" ? "flex justify-end" : ""}`}
              >
                <div
                  className={`flex max-w-[85%] gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    <div className="prose-content whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </div>
                    {msg.role === "assistant" && msg.content && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => copyToClipboard(msg.content, idx)}
                          className="rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                          title={t("common.copy", locale)}
                        >
                          {copiedIdx === idx ? (
                            <Check size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="mb-6 flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  <Bot size={16} />
                </div>
                <div className="rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
                  <div className="flex gap-1.5">
                    <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                    <span className="typing-dot h-2 w-2 rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-indigo-700 dark:focus-within:ring-indigo-900">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t("chat.placeholder", locale)}
              rows={1}
              className="max-h-[200px] flex-1 resize-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 rounded-xl bg-indigo-600 p-2 text-white transition-all hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            {locale === "en"
              ? "Press Enter to send, Shift+Enter for new line"
              : "Tekan Enter untuk kirim, Shift+Enter untuk baris baru"}
          </p>
        </div>
      </div>
    </div>
  );
}
