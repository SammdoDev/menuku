import Link from "next/link";
import { requestOtpAction } from "../actions";
import styles from "../auth.module.css";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };
export default async function LoginPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  return <main className={styles.page}><section className={styles.card}><div className={styles.brand}><span>m</span> menuku</div><p className={styles.eyebrow}>Selamat datang kembali</p><h1>Masuk dengan kode OTP</h1><p className={styles.intro}>Masukkan email bisnis. Kami kirim kode 6 digit untuk masuk dengan aman.</p>{error && <p className={`${styles.notice} ${styles.error}`}>{error}</p>}{message && <p className={`${styles.notice} ${styles.success}`}>{message}</p>}<form className={styles.form} action={requestOtpAction}><input type="hidden" name="mode" value="login"/><label className={styles.field}>Email<input name="email" type="email" autoComplete="email" placeholder="nama@bisnis.com" required/></label><button className={styles.submit} type="submit">Kirim kode OTP</button></form><p className={styles.bottom}>Belum punya akun? <Link href="/register">Daftar gratis</Link></p></section></main>;
}
