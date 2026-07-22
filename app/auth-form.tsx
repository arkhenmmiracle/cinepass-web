"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requested = new URLSearchParams(window.location.search).get("redirect");
      setRedirect(requested?.startsWith("/") ? requested : "/");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) { setError("Masukkan email valid dan password minimal 6 karakter."); return; }
    if (isRegister && (!name.trim() || password !== confirm)) { setError("Lengkapi nama dan pastikan konfirmasi password sama."); return; }
    const displayName = isRegister ? name.trim() : email.split("@")[0];
    window.localStorage.setItem("cinepassUser", JSON.stringify({ name: displayName, email }));
    window.location.href = redirect;
  }

  return <main className="auth-page">
    <section className="auth-visual"><Link className="brand auth-brand" href="/"><span>Cine</span><strong>Pass</strong><b>★</b></Link><div><p className="eyebrow">YOUR MOVIE NIGHT STARTS HERE</p><h1>{isRegister ? "Gabung dan nikmati setiap cerita." : "Selamat datang kembali."}</h1><p>{isRegister ? "Satu akun untuk booking film di XXI dan CGV." : "Pilihan film dan jadwalmu sudah kami simpan."}</p></div><div className="auth-ticket-art">🎟️<span>GOOD<br/>MOVIES</span></div></section>
    <section className="auth-panel"><Link className="auth-back" href={redirect}>← Kembali</Link><div className="auth-form-wrap"><p className="eyebrow">CINEPASS MEMBER</p><h2>{isRegister ? "Buat akun baru" : "Masuk ke akunmu"}</h2><p className="auth-intro">{isRegister ? "Daftar gratis dan lanjutkan bookingmu." : "Lanjutkan ke pilihan film yang sudah disimpan."}</p><button className="social-login" type="button">G&nbsp; Lanjutkan dengan Google</button><div className="auth-divider"><span>atau dengan email</span></div><form onSubmit={submit}>
      {isRegister && <label>Nama lengkap<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" autoComplete="name" /></label>}
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimal 6 karakter" autoComplete={isRegister ? "new-password" : "current-password"} /></label>
      {isRegister && <label>Konfirmasi password<input type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Ulangi password" autoComplete="new-password" /></label>}
      {error && <p className="auth-error">{error}</p>}<button className="auth-submit" type="submit">{isRegister ? "Daftar & Lanjutkan" : "Masuk & Lanjutkan"}</button>
    </form><p className="auth-switch">{isRegister ? "Sudah punya akun?" : "Belum punya akun?"} <Link href={`${isRegister ? "/login" : "/register"}?redirect=${encodeURIComponent(redirect)}`}>{isRegister ? "Masuk" : "Daftar gratis"}</Link></p><small className="auth-terms">Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan serta Kebijakan Privasi CinePass.</small></div></section>
  </main>;
}
