/* Locale-aware dispatcher for Research / Solutions / About / Careers content. */

import type { Locale } from "@/i18n/config";
import {
  RESEARCH_EN,
  SOLUTIONS_EN,
  ABOUT_VALUES_EN,
  ROLES_EN,
  TEAMS_EN,
} from "./content.en";
import {
  RESEARCH_FR,
  SOLUTIONS_FR,
  ABOUT_VALUES_FR,
  ROLES_FR,
  TEAMS_FR,
} from "./content.fr";

export type { ResearchAxis, Solution, Value, OpenRole } from "./content.en";

export function getResearch(locale: Locale) {
  return locale === "fr" ? RESEARCH_FR : RESEARCH_EN;
}

export function getSolutions(locale: Locale) {
  return locale === "fr" ? SOLUTIONS_FR : SOLUTIONS_EN;
}

export function getAboutValues(locale: Locale) {
  return locale === "fr" ? ABOUT_VALUES_FR : ABOUT_VALUES_EN;
}

export function getRoles(locale: Locale) {
  return locale === "fr" ? ROLES_FR : ROLES_EN;
}

export function getTeams(locale: Locale) {
  return locale === "fr" ? TEAMS_FR : TEAMS_EN;
}
