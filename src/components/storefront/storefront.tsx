"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Copy, ExternalLink, Instagram, LayoutGrid, MapPin, MessageCircle, Search, Share2, X } from "lucide-react";
import type { PublicStore } from "../../lib/store";
import { rupiah } from "../../lib/demo-data";
import bottomStyles from "./storefront-bottom-nav.module.css";
import styles from "./storefront.module.css";

type Item = { id: string; name: string; category: string; description: string; price: number; promo?: number; image: string; featured: boolean; available: boolean };
const fallbackImages = ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85"];
const waUrl = (number: string | null, message: string) => number ? `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}` : "";

function Detail({ product, store, close }: { product: Item; store: PublicStore; close: () => void }) {
  useEffect(() => {
    const closeKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeKey); };
  }, [close]);

  const url = waUrl(store.tenant.whatsapp, `Halo ${store.tenant.name}, saya ingin bertanya tentang menu ${product.name}.`);
  return <div className={styles.backdrop} onClick={close}><article className={styles.sheet} onClick={event => event.stopPropagation()}><div className={styles.dragHandle} /><button className={styles.close} onClick={close} aria-label="Tutup"><X size={20} /></button><img src={product.image} alt={product.name} className={styles.sheetImage} /><div className={styles.sheetContent}><span className={styles.eyebrow}>{product.category}</span><h2 className="display">{product.name}</h2><p>{product.description || `Menu pilihan dari ${store.tenant.name}.`}</p><div className={styles.sheetBottom}><div>{product.promo && <s>{rupiah(product.price)}</s>}<strong>{rupiah(product.promo ?? product.price)}</strong></div>{product.available && url ? <a className={styles.waButton} href={url} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} />Tanya via WhatsApp <ExternalLink size={16} /></a> : <span className={styles.sold}>{product.available ? "Kontak belum tersedia" : "Sedang habis hari ini"}</span>}</div></div></article></div>;
}

export default function Storefront({ store }: { store: PublicStore }) {
  const [active, setActive] = useState("Semua");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [notice, setNotice] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const categoryMap = new Map(store.categories.map(category => [category.id, category.name]));
  const items: Item[] = store.products.map((product, index) => ({ id: product.id, name: product.name, category: categoryMap.get(product.category_id) || "Lainnya", description: product.description || "", price: product.price, promo: product.discount_price ?? undefined, image: product.image_url || fallbackImages[index % fallbackImages.length], featured: product.is_featured, available: product.is_available }));
  const categories = ["Semua", ...store.categories.map(category => category.name), ...(!store.categories.length ? [...new Set(items.map(item => item.category))] : [])];
  const visible = useMemo(() => items.filter(item => (active === "Semua" || item.category === active) && `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase())), [active, query, items]);
  const initials = store.tenant.name.split(" ").slice(0, 2).map(value => value[0]).join("").toUpperCase();
  const whatsapp = waUrl(store.tenant.whatsapp, `Halo ${store.tenant.name}, saya ingin bertanya.`);
  const instagram = store.tenant.instagram ? `https://instagram.com/${store.tenant.instagram.replace(/^@/, "")}` : "";
  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2200); };
  const copy = async () => { try { await navigator.clipboard?.writeText(location.href); } finally { showNotice("Link halaman berhasil disalin"); } };
  const share = async () => { if (navigator.share) { await navigator.share({ title: store.tenant.name, url: location.href }); return; } await copy(); };
  const goToMenu = () => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  const focusSearch = () => { goToMenu(); window.setTimeout(() => searchRef.current?.focus(), 450); };

  return <main className={styles.page}><section className={styles.store}>
    <div className={styles.cover} style={store.tenant.banner_url ? { backgroundImage: `linear-gradient(105deg,#3a251d60,#1a0e0950),url(${store.tenant.banner_url})` } : undefined}><div className={styles.coverTop}><span className={styles.open}><i /> {store.tenant.is_published ? "Buka untuk pelanggan" : "Pratinjau pemilik"}</span><button onClick={share} aria-label="Bagikan halaman"><Share2 size={18} /></button></div></div>
    <header className={styles.profile}>{store.tenant.logo_url ? <img className={styles.logoImage} src={store.tenant.logo_url} alt={store.tenant.name} /> : <div className={styles.logo}>{initials}</div>}<div className={styles.profileText}><h1 className="display">{store.tenant.name}</h1><p>{store.tenant.description || "Selamat datang di halaman menu kami."}</p><div className={styles.meta}>{store.tenant.address && <span><MapPin size={15} />{store.tenant.address}</span>}<span><Clock3 size={15} />Lihat menu terbaru kami</span></div></div></header>
    <div className={styles.actionRow}>{whatsapp && <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} />Tanya via WhatsApp</a>}{instagram && <a className={styles.iconAction} href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>}{store.tenant.maps_url && <a className={styles.iconAction} href={store.tenant.maps_url} target="_blank" rel="noopener noreferrer" aria-label="Lokasi"><MapPin size={20} /></a>}{store.links.slice(0, 2).map(link => <a className={styles.iconAction} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.title} key={link.id}><ExternalLink size={20} /></a>)}</div>
    {items.some(item => item.featured) && <section className={styles.featured}><div className={styles.sectionHead}><div><span className={styles.eyebrow}>Pilihan kami</span><h2 className="display">Favorit minggu ini</h2></div><button className={styles.linkButton} onClick={() => { setActive("Semua"); setQuery(""); goToMenu(); }}>Lihat semua</button></div><div className={styles.featuredScroll}>{items.filter(item => item.featured).map(item => <button className={styles.featureCard} key={item.id} onClick={() => setSelected(item)}><img src={item.image} alt="" /><div><span>{item.name}</span><strong>{rupiah(item.promo ?? item.price)}</strong></div></button>)}</div></section>}
    <section className={styles.menuSection} id="menu"><div className={styles.menuHeading}><div><span className={styles.eyebrow}>Daftar menu</span><h2 className="display">Temukan favoritmu</h2></div><span>{visible.length} menu</span></div><div className={styles.stickyControls}><label className={styles.search}><Search size={19} /><input ref={searchRef} placeholder="Cari menu..." value={query} onChange={event => setQuery(event.target.value)} />{query && <button onClick={() => setQuery("")} aria-label="Hapus pencarian"><X size={16} /></button>}</label><nav className={styles.categories}>{categories.map(category => <button key={category} className={active === category ? styles.activeCategory : ""} onClick={() => setActive(category)}>{category}</button>)}</nav></div>{visible.length ? <div className={styles.grid}>{visible.map(item => <button className={`${styles.product} ${!item.available ? styles.unavailable : ""}`} key={item.id} onClick={() => setSelected(item)}><div className={styles.imageWrap}><img src={item.image} alt={item.name} />{item.featured && <span className={styles.badge}>Rekomendasi</span>}{!item.available && <span className={styles.out}>Habis</span>}</div><div className={styles.productText}><h3>{item.name}</h3><p>{item.description || "Menu pilihan"}</p><div className={styles.price}>{item.promo && <s>{rupiah(item.price)}</s>}<strong>{rupiah(item.promo ?? item.price)}</strong></div></div></button>)}</div> : <div className={styles.empty}><h3 className="display">Menu belum tersedia</h3><p>Merchant belum menambahkan produk.</p></div>}</section>
    <footer className={styles.footer}><div className={styles.footerLogo}>{initials}</div><p>© 2026 {store.tenant.name} · Dibuat dengan <b>menuku</b></p><button onClick={copy}><Copy size={15} />Salin link</button></footer>
  </section>{selected && <Detail product={selected} store={store} close={() => setSelected(null)} />}
  <nav className={bottomStyles.bottomNav} aria-label="Navigasi halaman"><button onClick={goToMenu}><LayoutGrid size={19} /><span>Menu</span></button><button onClick={focusSearch}><Search size={19} /><span>Cari</span></button>{whatsapp ? <a className={bottomStyles.bottomPrimary} href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={21} /><span>Chat</span></a> : <button className={bottomStyles.bottomPrimary} onClick={share}><Share2 size={21} /><span>Bagikan</span></button>}<button onClick={share}><Share2 size={19} /><span>Bagikan</span></button></nav>
  <div className={`${styles.toast} ${notice ? styles.showToast : ""}`} role="status">{notice}</div>
  </main>;
}
