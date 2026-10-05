"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  Globe2,
  Instagram,
  Link2,
  MapPin,
  MenuSquare,
  QrCode,
} from "lucide-react";
import Brand from "../components/brand";
import LanguageAutocomplete from "../components/language-autocomplete";
import LandingMotion from "../components/landing-motion";
import ScrollStory from "../components/scroll-story";
import { HeroSection } from "../components/ui/hero-section-shadcnui";
import { HeroHighlight } from "../components/ui/hero-highlight";
import { useTranslate } from "../lib/use-translate";
import { getConstants } from "../lib/i18n";
import type { PlanCode } from "../lib/plans";
import { supportWhatsAppUrl } from "../lib/site";

type LandingPlan = { code: PlanCode; price: number };

const featureCards = [
  { icon: MenuSquare, feature: "menu" },
  { icon: MapPin, feature: "store" },
  { icon: Link2, feature: "links" },
  { icon: Activity, feature: "analytics" },
] as const;

const steps = [
  { number: "01", step: "one" },
  { number: "02", step: "two" },
  { number: "03", step: "three" },
] as const;

const faqItems = ["one", "two", "three", "four", "five"] as const;

function MenuThumbnail({ tone }: { tone: "peach" | "green" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-12 shrink-0 place-items-center rounded-xl text-xl ${tone === "peach" ? "bg-gradient-to-br from-[#ffd9bf] to-[#f6a77d]" : "bg-gradient-to-br from-[#e2edcf] to-[#a4c18e]"}`}
    >
      {tone === "peach" ? "☕" : "🍵"}
    </span>
  );
}

function AnalyticsBars() {
  return (
    <div className="flex h-24 items-end gap-2" aria-hidden="true">
      {[34, 53, 42, 69, 57, 86, 74, 100, 78, 92, 68, 100].map((height, index) => (
        <span
          className={`min-w-0 flex-1 rounded-t-md ${index === 7 || index === 11 ? "bg-[#b13b19]" : "bg-[#e7b49b]"}`}
          key={index}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

export default function LandingPageLinktree({ planPrices }: { planPrices: LandingPlan[] }) {
  const { locale, setLocale } = useTranslate();
  const CONSTANT = getConstants(locale);
  const currency = new Intl.NumberFormat(
    { id: "id-ID", en: "en-US", ms: "ms-MY", zh: "zh-CN", ja: "ja-JP" }[locale],
    {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    },
  );

  return (
    <LandingMotion>
      <main className="bg-paper text-ink min-h-screen overflow-hidden">
        <header className="border-line sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <Brand />
            <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label={CONSTANT.nav.aria}>
              <a className="hover:text-brand transition" href="#fitur">{CONSTANT.nav.features}</a>
              <a className="hover:text-brand transition" href="#galeri">{CONSTANT.nav.gallery}</a>
              <a className="hover:text-brand transition" href="#cara">{CONSTANT.nav.steps}</a>
              <a className="hover:text-brand transition" href="#harga">{CONSTANT.nav.pricing}</a>
            </nav>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageAutocomplete
                label={CONSTANT.language.label}
                noResultsLabel={CONSTANT.language.noResults}
                onValueChange={setLocale}
                searchLabel={CONSTANT.language.search}
                value={locale}
              />
              <Link className="text-muted hover:text-ink hidden text-sm font-semibold transition sm:inline" href="/login">
                {CONSTANT.nav.login}
              </Link>
              <Link className="bg-brand hover:bg-brand-dark inline-flex min-h-10 items-center justify-center rounded-xl px-4 text-xs font-extrabold text-white transition sm:px-5 sm:text-sm" href="/register">
                {CONSTANT.nav.start}
              </Link>
            </div>
          </div>
        </header>

        <HeroHighlight
          className="relative"
          containerClassName="mx-auto w-full max-w-7xl"
        >
          <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-24 lg:pt-20">
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 size-[26rem] rounded-full bg-[#ffd5c2]/50 blur-3xl" />
          <HeroSection
            description={CONSTANT.hero.copy}
            eyebrow={CONSTANT.hero.eyebrow}
            highlight={CONSTANT.hero.title.highlight}
            points={[CONSTANT.hero.point.one, CONSTANT.hero.point.two]}
            primaryLabel={CONSTANT.hero.primary}
            secondaryLabel={CONSTANT.hero.secondary}
            title={CONSTANT.hero.title.first}
          />

          <div className="relative mx-auto w-full max-w-[590px] lg:col-span-6" data-hero-preview>
            <div className="absolute -right-5 -top-8 size-32 rounded-full bg-[#ffb88e]/45 blur-2xl sm:-right-9 sm:-top-10 sm:size-44" />
            <div className="relative rotate-[1deg] rounded-[1.8rem] border border-white bg-white/85 p-2 shadow-[0_30px_90px_-28px_rgba(68,43,30,.3)] sm:rounded-[2rem] sm:p-3">
              <div className="overflow-hidden rounded-[1.35rem] bg-[#fffaf5] sm:rounded-[1.55rem]">
                <div className="flex items-center justify-between gap-3 border-b border-[#eee5dd] px-4 py-3 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-[#b13b19] text-xs font-black text-white">KT</span>
                    <div><p className="text-sm font-extrabold">{CONSTANT.hero.preview.cafe}</p><p className="text-muted mt-0.5 text-[10px]">{CONSTANT.hero.preview.description}</p></div>
                  </div>
                  <span className="bg-emerald-50 px-2.5 py-1.5 text-[9px] font-bold text-emerald-800">{CONSTANT.hero.preview.open}</span>
                </div>
                <div className="p-4 sm:p-5">
                  <div className="mb-4 flex gap-2 text-[10px] font-bold">
                    <span className="rounded-full bg-[#29251f] px-3 py-2 text-white">{CONSTANT.hero.preview.category.one}</span>
                    <span className="rounded-full bg-[#f0e9e2] px-3 py-2 text-[#60574e]">{CONSTANT.hero.preview.category.two}</span>
                  </div>
                  <div className="rounded-2xl border border-[#eee5dd] bg-white p-3 sm:p-4">
                    <div className="flex items-center gap-3 border-b border-[#f0ece7] pb-3">
                      <MenuThumbnail tone="peach" />
                      <div className="min-w-0 flex-1"><b className="block truncate text-xs sm:text-sm">{CONSTANT.hero.preview.item.one}</b><span className="text-muted mt-1 block text-[10px]">{CONSTANT.hero.preview.status}</span></div>
                      <b className="text-xs">{CONSTANT.gallery.store.price.one}</b>
                    </div>
                    <div className="flex items-center gap-3 pt-3">
                      <MenuThumbnail tone="green" />
                      <div className="min-w-0 flex-1"><b className="block truncate text-xs sm:text-sm">{CONSTANT.hero.preview.item.two}</b><span className="text-muted mt-1 block text-[10px]">{CONSTANT.hero.preview.status}</span></div>
                      <b className="text-xs">{CONSTANT.gallery.store.price.two}</b>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-[#f4ede6] px-3 py-2.5 text-[10px] font-bold text-[#51473f]">
                    <span className="inline-flex items-center gap-2"><Globe2 size={13} /> {CONSTANT.hero.preview.url}</span>
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -left-4 bottom-8 flex items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:-left-12 sm:bottom-11 sm:p-4" data-hero-float>
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Check size={18} /></span>
              <div><p className="text-xs font-extrabold">{CONSTANT.hero.float.title}</p><p className="text-muted mt-1 text-[10px]">{CONSTANT.hero.float.copy}</p></div>
            </div>
            <div className="bg-charcoal absolute -right-2 bottom-20 hidden rounded-2xl px-4 py-3 text-white shadow-xl sm:block sm:-right-8" data-hero-float>
              <p className="display-font text-xl font-black">{CONSTANT.hero.metric.value}</p><p className="mt-0.5 text-[9px] text-white/65">{CONSTANT.hero.metric.label}</p>
            </div>
          </div>
          </section>
        </HeroHighlight>

        <section id="galeri" className="scroll-mt-24 border-y border-[#e9dfd7] bg-white py-16 sm:py-20" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
              <p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{CONSTANT.gallery.eyebrow}</p>
              <h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">{CONSTANT.gallery.title}</h2>
              <p className="text-muted mt-3 text-sm leading-6">{CONSTANT.gallery.copy}</p>
            </div>
            <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4" data-bento>
              <article className="relative overflow-hidden rounded-[1.6rem] bg-[#f6eee6] p-5 sm:col-span-2 sm:row-span-2 sm:p-7" data-bento-card>
                <div className="absolute -right-12 -top-12 size-48 rounded-full bg-[#edc5a7]/45 blur-2xl" />
                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div><p className="text-[9px] font-black tracking-[.14em] text-[#a03417]">{CONSTANT.gallery.store.eyebrow}</p><h3 className="display-font mt-3 max-w-sm text-2xl leading-tight font-black sm:text-3xl">{CONSTANT.gallery.store.title}</h3><p className="text-muted mt-2 max-w-sm text-xs leading-5">{CONSTANT.gallery.store.copy}</p></div>
                  <div className="mx-auto w-full max-w-[380px] rotate-[-1deg] rounded-2xl border border-white bg-white p-3 shadow-xl sm:p-4">
                    <div className="mb-3 flex items-center gap-2 border-b border-[#f0ece7] pb-3"><span className="grid size-8 place-items-center rounded-lg bg-[#b13b19] text-[9px] font-black text-white">KT</span><div><p className="text-xs font-extrabold">{CONSTANT.hero.preview.cafe}</p><p className="text-muted text-[9px]">{CONSTANT.hero.preview.description}</p></div><span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-800">{CONSTANT.hero.preview.open}</span></div>
                    <div className="grid gap-2.5">
                      <div className="flex items-center gap-2.5"><MenuThumbnail tone="peach" /><b className="min-w-0 flex-1 truncate text-[10px]">{CONSTANT.hero.preview.item.one}</b><span className="text-[9px] font-bold">{CONSTANT.gallery.store.price.one}</span></div>
                      <div className="flex items-center gap-2.5"><MenuThumbnail tone="green" /><b className="min-w-0 flex-1 truncate text-[10px]">{CONSTANT.hero.preview.item.two}</b><span className="text-[9px] font-bold">{CONSTANT.gallery.store.price.two}</span></div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="rounded-[1.6rem] bg-[#29251f] p-5 text-white sm:p-6" data-bento-card>
                <p className="text-[9px] font-black tracking-[.14em] text-[#ffb99c]">{CONSTANT.gallery.analytics.eyebrow}</p>
                <h3 className="display-font mt-3 text-lg leading-snug font-black">{CONSTANT.gallery.analytics.title}</h3>
                <div className="mt-5"><div className="mb-2 flex items-end justify-between gap-2"><span className="text-[9px] text-white/60">{CONSTANT.gallery.analytics.visits}</span><Activity className="text-[#ffb99c]" size={15} /></div><AnalyticsBars /></div>
                <p className="mt-3 text-[9px] font-bold text-emerald-300">{CONSTANT.gallery.analytics.growth}</p>
                <p className="mt-2 text-[9px] leading-4 text-white/55">{CONSTANT.gallery.analytics.disclaimer}</p>
              </article>
              <article className="flex flex-col justify-between rounded-[1.6rem] bg-[#e9f0df] p-5 sm:p-6" data-bento-card>
                <div><p className="text-[9px] font-black tracking-[.14em] text-[#477047]">{CONSTANT.gallery.qr.eyebrow}</p><h3 className="display-font mt-3 text-lg leading-snug font-black">{CONSTANT.gallery.qr.title}</h3><p className="text-muted mt-2 text-[10px] leading-5">{CONSTANT.gallery.qr.copy}</p></div>
                <div className="mt-5 flex items-center justify-between gap-3"><div className="grid size-[76px] grid-cols-5 gap-1 rounded-xl bg-white p-2.5 shadow-sm" aria-hidden="true">{Array.from({ length: 25 }, (_, index) => <span className={`${[0,1,2,4,5,7,10,12,14,16,18,20,21,22,24].includes(index) ? "bg-[#29251f]" : "bg-[#e9e2da]"} rounded-[2px]`} key={index} />)}</div><QrCode className="text-[#477047]" size={39} strokeWidth={1.5} /></div>
              </article>
              <article className="flex flex-col justify-between rounded-[1.6rem] border border-[#eee5dd] bg-[#fffaf6] p-5 sm:col-span-2 sm:flex-row sm:items-center sm:p-6" data-bento-card>
                <div className="max-w-sm"><p className="text-[9px] font-black tracking-[.14em] text-[#b13b19]">{CONSTANT.gallery.links.eyebrow}</p><h3 className="display-font mt-3 text-lg leading-snug font-black">{CONSTANT.gallery.links.title}</h3><p className="text-muted mt-2 text-[10px] leading-5">{CONSTANT.gallery.links.copy}</p></div>
                <div className="mt-5 flex flex-wrap gap-2 sm:mt-0 sm:max-w-[210px] sm:justify-end"><span className="grid size-11 place-items-center rounded-xl bg-[#e6f4ea] text-[#24834c]"><Globe2 size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#fce8df] text-[#b13b19]"><MapPin size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#eee9f8] text-[#6655a2]"><Instagram size={18} /></span><span className="grid size-11 place-items-center rounded-xl bg-[#f1eee8] text-[#29251f]"><Link2 size={18} /></span></div>
              </article>
            </div>
          </div>
        </section>

        <ScrollStory
          copy={CONSTANT.story.copy}
          eyebrow={CONSTANT.story.eyebrow}
          locale={locale}
          scenes={CONSTANT.story.scenes}
          scrollHint={CONSTANT.story.scrollHint}
          title={CONSTANT.story.title}
        />

        <section id="fitur" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-10" data-reveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-6"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{CONSTANT.features.eyebrow}</p><h2 className="display-font max-w-xl text-3xl leading-tight font-black sm:text-4xl">{CONSTANT.features.title}</h2></div>
            <p className="text-muted max-w-xl text-sm leading-6 lg:col-span-5 lg:col-start-8">{CONSTANT.features.copy}</p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
            {featureCards.map(({ icon: Icon, feature }) => <article className="group rounded-2xl border border-[#e9dfd7] bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#d2a28c] hover:shadow-xl hover:shadow-[#674c3e]/[.06]" key={feature}><span className="grid size-11 place-items-center rounded-xl bg-[#fff0e8] text-[#b13b19] transition group-hover:bg-[#b13b19] group-hover:text-white"><Icon size={20} /></span><h3 className="display-font mt-5 text-base font-black">{CONSTANT.feature[feature].title}</h3><p className="text-muted mt-2 text-xs leading-5">{CONSTANT.feature[feature].copy}</p></article>)}
          </div>
        </section>

        <section id="cara" className="bg-charcoal scroll-mt-24 py-16 text-white sm:py-20" data-reveal>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="max-w-2xl"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#ffb99c]">{CONSTANT.steps.eyebrow}</p><h2 className="display-font text-3xl leading-tight font-black sm:text-4xl">{CONSTANT.steps.title}</h2><p className="mt-3 text-sm leading-6 text-white/65">{CONSTANT.steps.copy}</p></div>
            <div className="mt-8 grid gap-3 md:grid-cols-3" data-stagger>
              {steps.map(({ number, step }) => <article className="rounded-2xl border border-white/10 bg-white/[.06] p-5" key={number}><span className="grid size-9 place-items-center rounded-xl bg-[#ff6534] text-xs font-black">{number}</span><h3 className="display-font mt-5 text-lg font-black">{CONSTANT.step[step].title}</h3><p className="mt-2 text-sm leading-6 text-white/65">{CONSTANT.step[step].copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="harga" className="border-y border-[#e9dfd7] bg-white scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20 lg:px-10" data-reveal>
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{CONSTANT.pricing.eyebrow}</p><h2 className="display-font text-3xl font-black sm:text-4xl">{CONSTANT.pricing.title}</h2><p className="text-muted mt-3 text-sm leading-6">{CONSTANT.pricing.copy}</p></div>
            <div className="mt-9 grid gap-4 md:grid-cols-3" data-stagger>
              {planPrices.map(({ code, price }) => {
                const featured = code === "premium";
                const features = CONSTANT.pricing[code].features;
                return <article className={`relative flex flex-col rounded-2xl border p-5 shadow-sm sm:p-6 ${featured ? "border-[#b13b19] bg-[#fffaf6] shadow-xl shadow-[#b13b19]/[.08]" : "border-[#e9dfd7] bg-[#faf8f4]"}`} key={code}>
                  {featured && <span className="mb-3 inline-flex self-start rounded-full bg-[#b13b19] px-3 py-1 text-[9px] font-black tracking-wide text-white">{CONSTANT.pricing.popular}</span>}
                  <p className="display-font text-lg font-black">{CONSTANT.pricing[code].name}</p>
                  <p className="text-muted mt-1 min-h-5 text-xs">{CONSTANT.pricing[code].note}</p>
                  <p className="mt-5 text-2xl font-black tabular-nums">{price === 0 ? CONSTANT.pricing.free.priceLabel : currency.format(price)}<span className="text-muted ml-1 text-xs font-normal">{price === 0 ? CONSTANT.pricing.forever : CONSTANT.pricing.month}</span></p>
                  <ul className="my-5 grid flex-1 content-start gap-3 border-t border-[#e9dfd7] pt-5 text-xs leading-5 sm:text-sm">{features.map((feature) => <li className="flex items-start gap-2" key={feature}><Check className="mt-0.5 shrink-0 text-[#b13b19]" size={15} /><span>{feature}</span></li>)}</ul>
                  <Link className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${featured ? "bg-[#b13b19] text-white hover:bg-[#8f2e14]" : "border border-[#e9dfd7] bg-white hover:border-[#b13b19]"}`} href={`/register?plan=${code}`}>{code === "free" ? CONSTANT.pricing.cta.free : CONSTANT.pricing.choose[code]}<ArrowRight size={15} /></Link>
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-[#e9dfd7] py-14 sm:py-16" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:px-10">
            <div className="lg:col-span-4"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{CONSTANT.payment.eyebrow}</p><h2 className="display-font text-3xl font-black">{CONSTANT.payment.title}</h2><p className="text-muted mt-3 text-sm leading-6">{CONSTANT.payment.copy}</p></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5"><Banknote className="mb-4 text-[#b13b19]" size={20} /><h3 className="display-font text-base font-black">{CONSTANT.payment.manual.title}</h3><p className="text-muted mt-2 text-xs leading-5">{CONSTANT.payment.manual.copy}</p><span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold"><Clock3 size={13} /> {CONSTANT.payment.manual.note}</span></article>
              <article className="rounded-2xl border border-[#e9dfd7] bg-white p-5"><QrCode className="mb-4 text-[#b13b19]" size={20} /><h3 className="display-font text-base font-black">{CONSTANT.payment.qris.title}</h3><p className="text-muted mt-2 text-xs leading-5">{CONSTANT.payment.qris.copy}</p><span className="text-muted mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold"><Check className="text-[#b13b19]" size={13} /> {CONSTANT.payment.qris.note}</span></article>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto grid max-w-7xl scroll-mt-24 gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-10" data-reveal>
          <div className="lg:col-span-4"><p className="mb-3 text-[10px] font-black tracking-[.15em] text-[#b13b19]">{CONSTANT.faq.eyebrow}</p><h2 className="display-font max-w-sm text-3xl font-black sm:text-4xl">{CONSTANT.faq.title}</h2><p className="text-muted mt-4 max-w-sm text-sm leading-6">{CONSTANT.faq.copy}</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#b13b19]" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">{CONSTANT.faq.contact}<ArrowUpRight size={15} /></a></div>
          <div className="lg:col-span-8">{faqItems.map((item) => <details className="group border-b border-[#e9dfd7] py-4 first:border-t" key={item}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-extrabold">{CONSTANT.faq[item].question}<ChevronDown className="text-muted shrink-0 transition group-open:rotate-180" size={17} /></summary><p className="text-muted max-w-2xl pt-3 pr-6 text-sm leading-6">{CONSTANT.faq[item].answer}</p></details>)}</div>
        </section>

        <section className="mx-4 mb-8 overflow-hidden rounded-[1.8rem] bg-[#b13b19] px-5 py-10 text-white sm:mx-6 sm:px-8 sm:py-12 lg:mx-auto lg:max-w-7xl lg:px-12" data-reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="max-w-2xl"><p className="mb-2 text-[10px] font-black tracking-[.15em] text-white/70">{CONSTANT.cta.eyebrow}</p><h2 className="display-font text-2xl leading-tight font-black sm:text-3xl">{CONSTANT.cta.title}</h2><p className="mt-2 text-sm text-white/75">{CONSTANT.cta.copy}</p></div>
            <Link className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-[#9f3516] transition hover:-translate-y-0.5" href="/register">{CONSTANT.cta.button}<ArrowRight size={15} /></Link>
          </div>
        </section>

        <footer className="text-muted mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-7 text-xs sm:flex-row sm:items-center sm:px-6 lg:px-10">
          <Brand compact />
          <p className="sm:ml-auto">© 2026 Menuku. {CONSTANT.footer.tagline}</p>
          <Link className="text-ink font-bold" href="/login">{CONSTANT.footer.login}</Link>
          <a className="text-ink font-bold" href={supportWhatsAppUrl()} target="_blank" rel="noreferrer">{CONSTANT.footer.contact}</a>
        </footer>
      </main>
    </LandingMotion>
  );
}
