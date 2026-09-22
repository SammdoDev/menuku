import Link from "next/link";
import { GlobalInput } from "../../../components/ui/form-controls";
import { requestOtpAction } from "../actions";
import AuthToast from "../auth-toast";
import styles from "../auth.module.css";

type Props = { searchParams: Promise<{ error?: string; plan?: string }> };
export default async function RegisterPage({ searchParams }: Props) {
  const { error, plan: requestedPlan } = await searchParams;
  const plan = requestedPlan === "premium" || requestedPlan === "business" ? requestedPlan : "free";
  const planLabel = plan === "free" ? "Free" : plan === "premium" ? "Premium" : "Business";
  return <main className={styles.page}><AuthToast error={error}/><section className={styles.card}><div className={styles.brand}><span>m</span> menuku</div><p className={styles.eyebrow}>Paket {planLabel}</p><h1>Buat halaman bisnismu</h1><p className={styles.intro}>Daftar dengan email, lalu verifikasi memakai kode OTP 8 digit dari Supabase.</p><form className={styles.form} action={requestOtpAction}><GlobalInput type="hidden" name="mode" value="register"/><GlobalInput type="hidden" name="plan" value={plan}/><label className={styles.field}>Nama<GlobalInput name="name" autoComplete="name" placeholder="Nama kamu" required minLength={2}/></label><label className={styles.field}>Email<GlobalInput name="email" type="email" autoComplete="email" placeholder="nama@bisnis.com" required/></label><button className={styles.submit} type="submit">Kirim kode OTP</button></form><p className={styles.bottom}>Sudah punya akun? <Link href="/login">Masuk</Link></p></section></main>;
}
