import en from "./messages/en.json";
import id from "./messages/id.json";
import ja from "./messages/ja.json";
import ms from "./messages/ms.json";
import zh from "./messages/zh.json";
import type { Locale } from "./config";

export type DeepStringValues<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? DeepStringValues<Item>[]
    : T extends object
      ? { [Key in keyof T]: DeepStringValues<T[Key]> }
      : never;

export type TranslationMessages = DeepStringValues<typeof en>;

const messages: Record<Locale, TranslationMessages> = { id, en, ms, zh, ja };

export function getMessages(locale: Locale): TranslationMessages {
  return messages[locale] ?? messages.en;
}
