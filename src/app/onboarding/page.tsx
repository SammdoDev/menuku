import { redirect } from "next/navigation";
import { CheckCircle2, Store } from "lucide-react";
import { getCurrentMerchant } from "../../lib/merchant";
import OnboardingForm from "./onboarding-form";
import styles from "./onboarding.module.css";

export default async function OnboardingPage(){const {user,tenant}=await getCurrentMerchant();if(!user)redirect("/login");if(tenant)redirect("/dashboard");return <main className={styles.page}><section className={styles.panel}><aside><div className={styles.brand}><span>m</span> menuku</div><div className={styles.asideCopy}><p>LANGKAH 1 DARI 3</p><h1 className="display">Wajah pertama bisnismu dimulai di sini.</h1><ul><li><CheckCircle2/>Identitas visual</li><li>Profil dan alamat halaman</li><li>Menu pertama dan publikasi</li></ul></div><div className={styles.asideFoot}><Store/> Siap dibagikan dalam beberapa menit.</div></aside><article><p className={styles.eyebrow}>Buat merchant</p><h2 className="display">Profil dan tampilan awal</h2><p className={styles.intro}>Tambahkan foto profil serta background dahulu, seperti menyiapkan halaman bisnis profesional.</p><OnboardingForm/></article></section></main>}
