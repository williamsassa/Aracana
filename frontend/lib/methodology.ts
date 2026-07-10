import type { Locale } from "@/i18n/config";
import { METHOD_EN, RESEARCH_LOOP_EN } from "./methodology.en";
import { METHOD_FR, RESEARCH_LOOP_FR } from "./methodology.fr";

export function getMethod(locale: Locale) {
  return locale === "fr" ? METHOD_FR : METHOD_EN;
}

export function getResearchLoop(locale: Locale) {
  return locale === "fr" ? RESEARCH_LOOP_FR : RESEARCH_LOOP_EN;
}
