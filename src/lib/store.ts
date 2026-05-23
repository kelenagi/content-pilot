"use client";

import { Locale } from "./i18n";

export interface ApiSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ContentColumn {
  id: string;
  name: string;
  goal: string;
  platform: string;
  language: "en" | "id" | "both";
  topics: string[];
  drafts: string[];
  createdAt: string;
}

const SETTINGS_KEY = "contentpilot_settings";
const LOCALE_KEY = "contentpilot_locale";
const COLUMNS_KEY = "contentpilot_columns";

export function getSettings(): ApiSettings {
  if (typeof window === "undefined") {
    return { baseUrl: "", apiKey: "", model: "" };
  }
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return { baseUrl: "", apiKey: "", model: "" };
  try {
    return JSON.parse(raw);
  } catch {
    return { baseUrl: "", apiKey: "", model: "" };
  }
}

export function saveSettings(settings: ApiSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LOCALE_KEY) as Locale) || "en";
}

export function saveLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_KEY, locale);
}

export function getColumns(): ContentColumn[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(COLUMNS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveColumns(columns: ContentColumn[]): void {
  localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
}
