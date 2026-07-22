"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type BookingSummary = { film:string; filmSlug:string; cinema:string; region:string; theatre:string; studio:number; day?:string; time:string; image?:string };

export function AuthGate({ booking, redirect, onClose }: { booking:BookingSummary; redirect:string; onClose:()=>void }) {
  return <div className="auth-gate" role="dialog" aria-modal="true" aria-label="Login untuk melanjutkan booking" onClick={onClose}><div className="auth-gate-card" onClick={(event) => event.stopPropagation()}><button className="auth-gate-close" onClick={onClose}>×</button><div className="auth-gate-icon">🎟</div><p className="eyebrow">PILIHANMU SUDAH DISIMPAN</p><h2>Login untuk lanjut booking</h2><p>Kami akan menjaga pilihanmu agar tidak hilang setelah login.</p><div className="booking-recap"><strong>{booking.film}</strong><span>{booking.theatre}</span><small>{booking.cinema} · {booking.region} · Studio {booking.studio} · {booking.day ? `${booking.day} · ` : ""}{booking.time}</small></div><Link className="auth-primary" href={`/login?redirect=${encodeURIComponent(redirect)}`}>Masuk ke CinePass</Link><p className="auth-switch">Belum punya akun? <Link href={`/register?redirect=${encodeURIComponent(redirect)}`}>Daftar gratis</Link></p></div></div>;
}

export function SeatBooking({ booking }: { booking:BookingSummary }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const rows = ["A","B","C","D","E","F","G","H"];
  const unavailable = useMemo(() => new Set(["A3","A4","B7","C2","C8","D5","E5","E6","F1","F9","G4","H7"]), []);
  const reserved = useMemo(() => new Set(["B2","C5","D8","F6","G7","H3"]), []);
  const price = 50000;

  function toggleSeat(seat:string) {
    if (unavailable.has(seat) || reserved.has(seat)) return;
    setSelected((current) => current.includes(seat) ? current.filter((item) => item !== seat) : [...current, seat]);
    setReviewOpen(false);
  }

  return <section className="seat-booking" id="seat-booking">
    <div className="seat-heading"><div><p className="eyebrow">LANGKAH TERAKHIR</p><h2>Pilih bangkumu</h2><p>Klik kursi hijau kembali jika ingin membatalkan pilihan.</p></div><div className="seat-legend"><span><i className="available"/>Tersedia</span><span><i className="chosen"/>Pilihanmu</span><span><i className="reserved"/>Terisi</span><span><i className="blocked"/>Tidak tersedia</span></div></div>
    <div className="cinema-screen"><span>LAYAR</span></div>
    <div className="seat-map">{rows.map((row) => <div className="seat-row" key={row}><b>{row}</b>{Array.from({length:10},(_,index) => { const seat=`${row}${index+1}`; const state=unavailable.has(seat)?"blocked":reserved.has(seat)?"reserved":selected.includes(seat)?"chosen":"available"; return <button key={seat} className={`seat ${state} ${index===5?"aisle":""}`} onClick={() => toggleSeat(seat)} aria-label={`Kursi ${seat}, ${state}`}>{index+1}</button>; })}<b>{row}</b></div>)}</div>
    <div className="seat-checkout"><div><span>{selected.length} kursi dipilih</span><strong>{selected.length ? selected.join(", ") : "Belum ada kursi"}</strong><small>{booking.film} · Studio {booking.studio} · {booking.time}</small></div><div><span>Total</span><strong>Rp{(selected.length*price).toLocaleString("id-ID")}</strong></div><button disabled={!selected.length} onClick={() => setReviewOpen(true)}>Lanjutkan ke Pembayaran →</button></div>
    {reviewOpen && <div className="order-review"><div className="review-title"><div><p className="eyebrow">REVIEW PEMESANAN</p><h2>Pastikan semuanya sudah benar</h2></div><span>Belum dibayar</span></div><div className="review-grid"><div className="review-ticket"><span>Film</span><strong>{booking.film}</strong><small>{booking.cinema} · {booking.theatre}</small></div><div><span>Jadwal</span><strong>{booking.day || "Hari ini"}, {booking.time}</strong><small>Studio {booking.studio} · Regular</small></div><div><span>Kursi</span><strong>{selected.join(", ")}</strong><small>{selected.length} tiket</small></div><div><span>Total pembayaran</span><strong className="review-total">Rp{(selected.length*price).toLocaleString("id-ID")}</strong><small>Termasuk biaya layanan</small></div></div><div className="review-actions"><button className="review-edit" onClick={() => setReviewOpen(false)}>Ubah kursi</button><button className="pay-now">Pilih Metode Pembayaran →</button></div></div>}
  </section>;
}
