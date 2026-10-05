import type { TranslationMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import type { PlanCode } from "@/features/billing/plans";

export type LandingConstants = TranslationMessages;
export type LandingLocale = Locale;
export type LandingPlanPrice = { code: PlanCode; price: number };
