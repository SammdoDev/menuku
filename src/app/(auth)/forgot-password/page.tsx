import Link from "next/link";
import { GlobalInput } from "../../../components/ui/form-controls";
import { resetPasswordAction } from "../actions";
import AuthToast from "../auth-toast";
import styles from "../auth.module.css";

type Props = { searchParams: Promise<{ error?: string; message?: string }> };
export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, message } = await searchParams;
  return <main className={styles.page}><AuthToast error={error} message={message}/><section className={styles.card}><div className={styles.brand}><span>m</span> menuku</div><p className={styles.eyebrow}>Reset password</p><h1>Lupa password?</h1><p className={styles.intro}>Masukkan email akunmu. Kami akan mengirimkan link untuk membuat password baru.</p><form className={styles.form} action={resetPasswordAction}><label className={styles.field}>Email<GlobalInput name="email" type="email" autoComplete="email" placeholder="nama@bisnis.com" required/></label><button className={styles.submit} type="submit">Kirim link reset</button></form><Link className={styles.back} href="/login">Kembali ke halaman masuk</Link></section></main>;
}
