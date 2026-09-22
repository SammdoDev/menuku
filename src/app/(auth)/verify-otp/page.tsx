import Link from "next/link";
import { GlobalInput } from "../../../components/ui/form-controls";
import { requestOtpAction, verifyEmailOtpAction } from "../actions";
import AuthToast from "../auth-toast";
import styles from "../auth.module.css";

type Props = { searchParams: Promise<{ email?: string; mode?: string; error?: string }> };
export default async function VerifyOtpPage({ searchParams }: Props) {
  const { email = "", mode, error } = await searchParams;
  const isRegister = mode === "register";
  return <main className={styles.page}><AuthToast error={error}/><section className={styles.card}><div className={styles.brand}><span>m</span> menuku</div><p className={styles.eyebrow}>Verifikasi email</p><h1>Masukkan kode OTP</h1><p className={styles.intro}>Kode 8 digit dikirim ke <b>{email || "email kamu"}</b>. Kode berlaku selama satu jam.</p><form className={styles.form} action={verifyEmailOtpAction}><GlobalInput type="hidden" name="email" value={email}/><label className={styles.field}>Kode OTP<GlobalInput name="token" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" maxLength={8} placeholder="00000000" required autoFocus/></label><button className={styles.submit} type="submit">Verifikasi & masuk</button></form><form className={styles.resend} action={requestOtpAction}><GlobalInput type="hidden" name="email" value={email}/><GlobalInput type="hidden" name="mode" value={isRegister ? "register" : "login"}/><button type="submit">Kirim ulang kode</button></form><Link className={styles.back} href={isRegister ? "/register" : "/login"}>Gunakan email lain</Link></section></main>;
}
