import Link from "next/link";
import { GlobalInput } from "../../../components/ui/form-controls";
import { updatePasswordAction } from "../actions";
import AuthToast from "../auth-toast";
import styles from "../auth.module.css";

type Props = { searchParams: Promise<{ error?: string }> };
export default async function UpdatePasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return <main className={styles.page}><AuthToast error={error}/><section className={styles.card}><div className={styles.brand}><span>m</span> menuku</div><p className={styles.eyebrow}>Password baru</p><h1>Atur password baru</h1><p className={styles.intro}>Buat password baru minimal 8 karakter untuk akunmu.</p><form className={styles.form} action={updatePasswordAction}><label className={styles.field}>Password baru<GlobalInput name="password" type="password" autoComplete="new-password" required minLength={8}/></label><label className={styles.field}>Konfirmasi password<GlobalInput name="confirmation" type="password" autoComplete="new-password" required minLength={8}/></label><button className={styles.submit} type="submit">Simpan password</button></form><Link className={styles.back} href="/login">Kembali ke halaman masuk</Link></section></main>;
}
