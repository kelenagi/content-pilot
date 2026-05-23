"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import { getSettings, saveSettings, ApiSettings } from "@/lib/store";
import { Save, Zap, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
  const { locale } = useLocale();
  const [settings, setSettings] = useState<ApiSettings>({
    baseUrl: "",
    apiKey: "",
    model: "",
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: "Say 'Connection successful!' in one sentence." }],
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
        }),
      });

      if (res.ok) {
        setTestResult("success");
      } else {
        setTestResult("error");
      }
    } catch {
      setTestResult("error");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("settings.title", locale)}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("settings.subtitle", locale)}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-5">
          {/* Base URL */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("settings.baseUrl", locale)}
            </label>
            <input
              type="url"
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
              placeholder={t("settings.baseUrl.placeholder", locale)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
            />
            <p className="mt-1 text-xs text-gray-400">
              {locale === "en"
                ? "Examples: https://api.openai.com/v1, https://api.groq.com/openai/v1, http://localhost:11434/v1"
                : "Contoh: https://api.openai.com/v1, https://api.groq.com/openai/v1, http://localhost:11434/v1"}
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("settings.apiKey", locale)}
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder={t("settings.apiKey.placeholder", locale)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("settings.model", locale)}
            </label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              placeholder={t("settings.model.placeholder", locale)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
            />
            <p className="mt-1 text-xs text-gray-400">
              {locale === "en"
                ? "Examples: gpt-4o-mini, gpt-4o, llama-3.3-70b-versatile, deepseek-chat, claude-3-5-sonnet"
                : "Contoh: gpt-4o-mini, gpt-4o, llama-3.3-70b-versatile, deepseek-chat, claude-3-5-sonnet"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
          >
            <Save size={16} />
            {saved ? t("settings.saved", locale) : t("settings.save", locale)}
          </button>

          <button
            onClick={handleTest}
            disabled={!settings.baseUrl || !settings.apiKey || !settings.model || testing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-750"
          >
            <Zap size={16} />
            {testing ? t("settings.testing", locale) : t("settings.test", locale)}
          </button>

          {testResult === "success" && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
              <CheckCircle size={16} />
              {t("settings.test.success", locale)}
            </span>
          )}

          {testResult === "error" && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400">
              <XCircle size={16} />
              {t("settings.test.error", locale)}
            </span>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
          {locale === "en" ? "Quick Setup Guide" : "Panduan Setup Cepat"}
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">OpenAI</p>
            <p>Base URL: https://api.openai.com/v1</p>
            <p>Model: gpt-4o-mini, gpt-4o</p>
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Groq</p>
            <p>Base URL: https://api.groq.com/openai/v1</p>
            <p>Model: llama-3.3-70b-versatile, mixtral-8x7b-32768</p>
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">Ollama (Local)</p>
            <p>Base URL: http://localhost:11434/v1</p>
            <p>Model: llama3.2, mistral, deepseek-r1</p>
          </div>
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">OpenRouter</p>
            <p>Base URL: https://openrouter.ai/api/v1</p>
            <p>Model: google/gemini-2.0-flash-exp, anthropic/claude-3.5-sonnet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
