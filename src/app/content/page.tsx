"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/lib/locale-context";
import { t } from "@/lib/i18n";
import {
  getSettings,
  getColumns,
  saveColumns,
  ContentColumn,
} from "@/lib/store";
import {
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  FileText,
  AtSign,
  Image as ImageIcon,
  Briefcase,
  Mail,
  Video,
} from "lucide-react";
import Link from "next/link";

interface Template {
  id: string;
  titleKey: string;
  descKey: string;
  icon: typeof FileText;
  platform: string;
  promptEn: string;
  promptId: string;
}

const templates: Template[] = [
  {
    id: "blog",
    titleKey: "template.blog.title",
    descKey: "template.blog.desc",
    icon: FileText,
    platform: "blog",
    promptEn:
      "You are a content column assistant. Create a list of 5 SEO-optimized blog post topics with title, target keyword, and brief outline for each. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik postingan blog yang dioptimasi SEO dengan judul, kata kunci target, dan garis besar singkat untuk masing-masing. Arah kolom adalah: {goal}",
  },
  {
    id: "tweet",
    titleKey: "template.tweet.title",
    descKey: "template.tweet.desc",
    icon: AtSign,
    platform: "twitter",
    promptEn:
      "You are a content column assistant. Create a list of 5 viral tweet thread topics with hooks, key points, and engagement strategy. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik thread tweet viral dengan hook, poin utama, dan strategi engagement. Arah kolom adalah: {goal}",
  },
  {
    id: "instagram",
    titleKey: "template.instagram.title",
    descKey: "template.instagram.desc",
    icon: ImageIcon,
    platform: "instagram",
    promptEn:
      "You are a content column assistant. Create a list of 5 Instagram post topics with caption hooks, visual ideas, and hashtag groups. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik postingan Instagram dengan hook caption, ide visual, dan grup hashtag. Arah kolom adalah: {goal}",
  },
  {
    id: "linkedin",
    titleKey: "template.linkedin.title",
    descKey: "template.linkedin.desc",
    icon: Briefcase,
    platform: "linkedin",
    promptEn:
      "You are a content column assistant. Create a list of 5 LinkedIn post topics for thought leadership with hook, narrative structure, and CTA. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik postingan LinkedIn untuk thought leadership dengan hook, struktur narasi, dan CTA. Arah kolom adalah: {goal}",
  },
  {
    id: "newsletter",
    titleKey: "template.newsletter.title",
    descKey: "template.newsletter.desc",
    icon: Mail,
    platform: "newsletter",
    promptEn:
      "You are a content column assistant. Create a list of 5 newsletter edition topics with subject line, sections outline, and key takeaway. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik edisi newsletter dengan subject line, garis besar bagian, dan key takeaway. Arah kolom adalah: {goal}",
  },
  {
    id: "tiktok",
    titleKey: "template.tiktok.title",
    descKey: "template.tiktok.desc",
    icon: Video,
    platform: "tiktok",
    promptEn:
      "You are a content column assistant. Create a list of 5 TikTok video script topics with hooks (first 3 seconds), content structure, and trending sounds/effects suggestions. The column direction is: {goal}",
    promptId:
      "Kamu adalah asisten kolom konten. Buat daftar 5 topik skrip video TikTok dengan hook (3 detik pertama), struktur konten, dan saran sounds/effects trending. Arah kolom adalah: {goal}",
  },
];

export default function ContentPage() {
  const { locale } = useLocale();
  const [columns, setColumns] = useState<ContentColumn[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [platform, setPlatform] = useState("blog");
  const [language, setLanguage] = useState<"en" | "id" | "both">("en");
  const [expandedCol, setExpandedCol] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const settings = getSettings();
  const isConfigured = settings.baseUrl && settings.apiKey && settings.model;

  useEffect(() => {
    setColumns(getColumns());
  }, []);

  function createColumn() {
    if (!name.trim() || !goal.trim()) return;
    const col: ContentColumn = {
      id: Date.now().toString(),
      name: name.trim(),
      goal: goal.trim(),
      platform,
      language,
      topics: [],
      drafts: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [col, ...columns];
    setColumns(updated);
    saveColumns(updated);
    setName("");
    setGoal("");
    setShowForm(false);
    setExpandedCol(col.id);
  }

  function deleteColumn(id: string) {
    const updated = columns.filter((c) => c.id !== id);
    setColumns(updated);
    saveColumns(updated);
  }

  function useTemplate(tpl: Template) {
    setName(t(tpl.titleKey, locale));
    setGoal("");
    setPlatform(tpl.platform);
    setShowForm(true);
  }

  async function generateTopics(col: ContentColumn) {
    if (!isConfigured) return;
    setGenerating(col.id + "-topics");

    const prompt =
      locale === "id"
        ? `Kamu adalah asisten kolom konten. Buat daftar 7 topik konten untuk kolom "${col.name}" di platform ${col.platform}. Arah kolom: ${col.goal}. Bahasa output: ${col.language === "both" ? "English dan Bahasa Indonesia" : col.language === "id" ? "Bahasa Indonesia" : "English"}. Untuk setiap topik, berikan: nomor, judul, dan deskripsi singkat 1 baris.`
        : `You are a content column assistant. Create a list of 7 content topics for the column "${col.name}" on ${col.platform}. Column direction: ${col.goal}. Output language: ${col.language === "both" ? "English and Bahasa Indonesia" : col.language === "id" ? "Bahasa Indonesia" : "English"}. For each topic, provide: number, title, and a brief 1-line description.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let content = "";
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
            if (delta) content += delta;
          } catch {
            // skip
          }
        }
      }

      const updated = columns.map((c) =>
        c.id === col.id ? { ...c, topics: [...c.topics, content] } : c
      );
      setColumns(updated);
      saveColumns(updated);
    } catch {
      // error handled silently
    } finally {
      setGenerating(null);
    }
  }

  async function generateDraft(col: ContentColumn, topicIdx: number) {
    if (!isConfigured || !col.topics[topicIdx]) return;
    setGenerating(col.id + "-draft-" + topicIdx);

    const prompt =
      locale === "id"
        ? `Kamu adalah asisten konten profesional. Berdasarkan topik berikut, buat draf konten lengkap untuk platform ${col.platform}. Bahasa: ${col.language === "both" ? "Tulis dalam English dan Bahasa Indonesia" : col.language === "id" ? "Bahasa Indonesia" : "English"}.\n\nTopik:\n${col.topics[topicIdx]}\n\nBuat draf yang siap publish, lengkap dengan hook pembuka, konten utama, dan CTA penutup.`
        : `You are a professional content assistant. Based on the following topic, create a complete content draft for the ${col.platform} platform. Language: ${col.language === "both" ? "Write in both English and Bahasa Indonesia" : col.language === "id" ? "Bahasa Indonesia" : "English"}.\n\nTopic:\n${col.topics[topicIdx]}\n\nCreate a publish-ready draft with an opening hook, main content, and closing CTA.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let content = "";
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
            if (delta) content += delta;
          } catch {
            // skip
          }
        }
      }

      const updated = columns.map((c) =>
        c.id === col.id ? { ...c, drafts: [...c.drafts, content] } : c
      );
      setColumns(updated);
      saveColumns(updated);
    } catch {
      // error handled silently
    } finally {
      setGenerating(null);
    }
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("content.title", locale)}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t("content.subtitle", locale)}
        </p>
      </div>

      {!isConfigured && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <p className="mb-2 font-medium">{t("chat.configure", locale)}</p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            {t("nav.settings", locale)}
          </Link>
        </div>
      )}

      {/* Templates */}
      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t("content.templates", locale)}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t(tpl.titleKey, locale)}
                  </h3>
                </div>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {t(tpl.descKey, locale)}
                </p>
                <button
                  onClick={() => useTemplate(tpl)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  {t("content.use.template", locale)} &rarr;
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Column */}
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
        >
          <Plus size={16} />
          {t("content.create", locale)}
        </button>

        {showForm && (
          <div className="mt-4 animate-fade-in rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("content.name", locale)}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("content.name.placeholder", locale)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("content.platform", locale)}
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="blog">{t("platform.blog", locale)}</option>
                  <option value="twitter">{t("platform.twitter", locale)}</option>
                  <option value="instagram">{t("platform.instagram", locale)}</option>
                  <option value="linkedin">{t("platform.linkedin", locale)}</option>
                  <option value="newsletter">{t("platform.newsletter", locale)}</option>
                  <option value="tiktok">{t("platform.tiktok", locale)}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("content.goal", locale)}
                </label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder={t("content.goal.placeholder", locale)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-indigo-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("content.language", locale)}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "id" | "both")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value="en">{t("common.english", locale)}</option>
                  <option value="id">{t("common.indonesian", locale)}</option>
                  <option value="both">{t("common.both", locale)}</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={createColumn}
                  disabled={!name.trim() || !goal.trim()}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
                >
                  {t("content.create", locale)}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Columns List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          {t("content.columns", locale)}
        </h2>

        {columns.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">{t("content.no.columns", locale)}</p>
        ) : (
          <div className="space-y-4">
            {columns.map((col) => (
              <div
                key={col.id}
                className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
              >
                {/* Column header */}
                <div
                  className="flex cursor-pointer items-center justify-between p-4"
                  onClick={() => setExpandedCol(expandedCol === col.id ? null : col.id)}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{col.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {t(`platform.${col.platform}`, locale)} &middot;{" "}
                      {col.language === "both"
                        ? t("common.both", locale)
                        : col.language === "id"
                        ? t("common.indonesian", locale)
                        : t("common.english", locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteColumn(col.id);
                      }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950"
                    >
                      <Trash2 size={16} />
                    </button>
                    {expandedCol === col.id ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded content */}
                {expandedCol === col.id && (
                  <div className="animate-fade-in border-t border-gray-200 p-4 dark:border-gray-800">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{col.goal}</p>

                    {/* Generate Topics */}
                    <div className="mb-4">
                      <button
                        onClick={() => generateTopics(col)}
                        disabled={!isConfigured || generating === col.id + "-topics"}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-40 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
                      >
                        <Sparkles size={14} />
                        {generating === col.id + "-topics"
                          ? t("common.loading", locale)
                          : t("content.generate.topics", locale)}
                      </button>
                    </div>

                    {/* Topics */}
                    {col.topics.map((topic, tIdx) => (
                      <div
                        key={tIdx}
                        className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            {t("content.topics", locale)} #{tIdx + 1}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => copyText(topic, `topic-${col.id}-${tIdx}`)}
                              className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              {copiedId === `topic-${col.id}-${tIdx}` ? (
                                <Check size={14} className="text-green-500" />
                              ) : (
                                <Copy size={14} />
                              )}
                            </button>
                            <button
                              onClick={() => generateDraft(col, tIdx)}
                              disabled={
                                !isConfigured ||
                                generating === col.id + "-draft-" + tIdx
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
                            >
                              <Sparkles size={12} />
                              {generating === col.id + "-draft-" + tIdx
                                ? t("common.loading", locale)
                                : t("content.generate.draft", locale)}
                            </button>
                          </div>
                        </div>
                        <div className="prose-content whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                          {topic}
                        </div>
                      </div>
                    ))}

                    {/* Drafts */}
                    {col.drafts.map((draft, dIdx) => (
                      <div
                        key={dIdx}
                        className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                            {t("content.draft", locale)} #{dIdx + 1}
                          </span>
                          <button
                            onClick={() => copyText(draft, `draft-${col.id}-${dIdx}`)}
                            className="rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {copiedId === `draft-${col.id}-${dIdx}` ? (
                              <Check size={14} className="text-green-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                        <div className="prose-content whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                          {draft}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
