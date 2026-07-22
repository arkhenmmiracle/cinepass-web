"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = { name:string; email:string };
type Booking = { film?:string; filmSlug?:string; cinema?:string; region?:string; theatre?:string; studio?:number; day?:string; time?:string };

export default function ProfilePage(){
  const [user,setUser]=useState<User|null>(null); const [booking,setBooking]=useState<Booking|null>(null); const [loaded,setLoaded]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{try{const saved=localStorage.getItem("cinepassUser");if(saved)setUser(JSON.parse(saved));const pending=localStorage.getItem("cinepassPendingBooking");if(pending)setBooking(JSON.parse(pending))}catch{/* ignore invalid local prototype data */}setLoaded(true)},0);return()=>clearTimeout(timer)},[]);
  function logout(){localStorage.removeItem("cinepassUser");window.location.href="/"}
  if(!loaded)return <main className="profile-page"><div className="profile-loading">Memuat profil…</div></main>;
  if(!user)return <main className="profile-page"><section className="profile-empty"><div>👤</div><h1>Kamu belum login</h1><p>Masuk untuk melihat profil dan menyimpan aktivitas booking.</p><Link className="auth-primary" href="/login?redirect=%2Fprofile">Masuk ke CinePass</Link><Link href="/">Kembali ke beranda</Link></section></main>;
  const initial=(user.name||"M").charAt(0).toUpperCase();
  return <main className="profile-page"><header className="profile-header"><Link className="brand" href="/"><span>Cine</span><strong>Pass</strong><b>★</b></Link><Link href="/">← Kembali ke beranda</Link></header><section className="profile-shell">
    <aside className="profile-sidebar"><div className="profile-avatar-large">{initial}</div><h1>{user.name}</h1><p>{user.email}</p><span className="member-badge">★ CinePass Member</span><nav><button className="active">◉ Ringkasan</button><button>🎟 Tiket Saya</button><button>♡ Film Favorit</button><button>⚙ Pengaturan</button></nav><button className="logout-button" onClick={logout}>↪ Keluar dari akun</button></aside>
    <div className="profile-content"><div className="profile-welcome"><div><p className="eyebrow">PROFIL CINEPASS</p><h2>Halo, {user.name}! 👋</h2><p>Kelola akun, tiket, dan aktivitas nontonmu dari satu tempat.</p></div><div className="profile-points"><span>Poin CinePass</span><strong>1.250</strong><small>500 poin lagi menuju Silver</small></div></div>
      <div className="profile-stats"><div><span>🎬</span><strong>8</strong><small>Film ditonton</small></div><div><span>🎟</span><strong>12</strong><small>Total tiket</small></div><div><span>★</span><strong>1.250</strong><small>Poin terkumpul</small></div></div>
      <section className="profile-booking"><div className="profile-section-title"><h3>Booking terakhir</h3>{booking&&<Link href={booking.filmSlug?`/film?film=${booking.filmSlug}`:"/bioskop"}>Lanjutkan booking →</Link>}</div>{booking?<div className="profile-ticket"><div className="ticket-stub">CINE<br/>PASS <b>★</b></div><div><span>PILIHAN TERSIMPAN</span><h3>{booking.film||"Film pilihanmu"}</h3><p>{booking.cinema} · {booking.theatre}</p><small>{booking.region} · Studio {booking.studio} · {booking.day?`${booking.day} · `:""}{booking.time}</small></div><em>Belum selesai</em></div>:<div className="no-booking"><span>🍿</span><div><strong>Belum ada booking</strong><p>Pilih film atau bioskop untuk memulai pengalaman nontonmu.</p></div><Link href="/film">Cari film</Link></div>}</section>
      <section className="profile-account"><h3>Informasi akun</h3><div><label>Nama lengkap<strong>{user.name}</strong></label><label>Email<strong>{user.email}</strong></label><label>Status akun<strong className="verified">✓ Terverifikasi</strong></label></div></section>
    </div>
  </section></main>
}
