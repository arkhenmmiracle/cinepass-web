"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuthGate, SeatBooking, type BookingSummary } from "../booking-ui";

const films = [
  { slug:"dewa-laut", title:"Dewa Laut", genre:"Fantasy", age:"13+", duration:"2j 05m", rating:"8.9", image:"/images/poster-dewa-laut.png", synopsis:"Seorang pewaris kerajaan pesisir harus menyelam ke dunia yang telah lama dilupakan untuk menghentikan amarah sang penguasa laut. Di antara legenda, pengkhianatan, dan kekuatan purba, ia menemukan bahwa takdir negerinya terikat pada rahasia keluarganya sendiri." },
  { slug:"neon-heart", title:"Neon Heart", genre:"Sci-Fi Romance", age:"13+", duration:"1j 54m", rating:"8.6", image:"/images/poster-neon-heart.png", synopsis:"Dua jiwa dari sisi berbeda kota futuristik bertemu melalui sebuah sinyal misterius. Saat ingatan dapat diperdagangkan, mereka harus memilih antara kehidupan yang sempurna atau cinta yang benar-benar nyata." },
  { slug:"bintang-jatuh", title:"Bintang Jatuh", genre:"Drama", age:"SU", duration:"1j 48m", rating:"9.2", image:"/images/poster-bintang-jatuh.png", synopsis:"Sebuah pertemuan tak sengaja pada malam hujan mempertemukan dua orang yang sama-sama kehilangan arah. Dalam waktu singkat, mereka belajar bahwa harapan terkadang datang dari tempat yang paling tak terduga." },
  { slug:"rumah-di-ujung-jalan", title:"Rumah di Ujung Jalan", genre:"Horror", age:"17+", duration:"1j 49m", rating:"8.3", image:"/images/poster-rumah.png", synopsis:"Sekelompok sahabat singgah di rumah kosong yang tidak tercatat di peta. Ketika malam tiba, setiap pintu membawa mereka lebih dalam ke masa lalu yang seharusnya tetap terkubur." },
  { slug:"komando-garuda", title:"Komando Garuda", genre:"Action", age:"13+", duration:"2j 02m", rating:"8.7", image:"/images/poster-komando.png", synopsis:"Sebuah unit elite berpacu dengan waktu untuk menghentikan ancaman berskala nasional. Misi terakhir mereka menuntut keberanian, kesetiaan, dan pengorbanan yang belum pernah diuji sebelumnya." },
  { slug:"mimpi-di-osaka", title:"Mimpi di Osaka", genre:"Romance", age:"SU", duration:"1j 56m", rating:"8.5", image:"/images/poster-osaka.png", synopsis:"Seorang ilustrator Indonesia mengejar mimpinya di Osaka dan bertemu musisi jalanan yang mengubah cara pandangnya tentang rumah, keberanian, dan cinta." },
];

const cinemaData = {
  XXI: {
    Jakarta: ["Plaza Indonesia XXI", "Gandaria City XXI", "Kelapa Gading XXI"],
    Tangerang: ["Living World XXI", "Bintaro Xchange XXI"],
    Bekasi: ["Summarecon Mall Bekasi XXI", "Grand Metropolitan XXI"],
  },
  CGV: {
    Jakarta: ["CGV Grand Indonesia", "CGV Central Park", "CGV Pacific Place"],
    Tangerang: ["CGV Ecoplaza CitraRaya", "CGV TerasKota"],
    Bekasi: ["CGV Bekasi Cyber Park", "CGV Lagoon Avenue"],
  },
} as const;

type Cinema = keyof typeof cinemaData;
const showtimes = ["10.00", "12.30", "15.00", "17.30", "20.00", "22.00"];

export default function FilmPage() {
  const [filmSlug, setFilmSlug] = useState("dewa-laut");
  const [cinema, setCinema] = useState<Cinema | "">("");
  const [region, setRegion] = useState("");
  const [theatre, setTheatre] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("film");
    const timer = window.setTimeout(() => {
      const savedUser = window.localStorage.getItem("cinepassUser");
      const pending = window.localStorage.getItem("cinepassPendingBooking");
      if (savedUser) {
        try { setUserName(JSON.parse(savedUser).name || "Member"); } catch { setUserName("Member"); }
      }
      if (pending) {
        try {
          const booking = JSON.parse(pending);
          if (films.some((item) => item.slug === booking.filmSlug)) setFilmSlug(booking.filmSlug);
          if (booking.cinema === "XXI" || booking.cinema === "CGV") setCinema(booking.cinema);
          if (typeof booking.region === "string") setRegion(booking.region);
          if (typeof booking.theatre === "string") setTheatre(booking.theatre);
          if (showtimes.includes(booking.time)) setSelectedTime(booking.time);
          if (savedUser && booking.time) setBookingMessage("Pilihan bookingmu berhasil dipulihkan. Silakan lanjutkan booking.");
        } catch { window.localStorage.removeItem("cinepassPendingBooking"); }
      } else if (requested && films.some((item) => item.slug === requested)) setFilmSlug(requested);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const film = useMemo(() => films.find((item) => item.slug === filmSlug) ?? films[0], [filmSlug]);
  const regions = cinema ? Object.keys(cinemaData[cinema]) : [];
  const theatres: readonly string[] =
    cinema && region
      ? cinemaData[cinema][region as keyof typeof cinemaData[Cinema]] ?? []
      : [];
  const ready = Boolean(cinema && region && theatre);
  const studioNumber = theatre ? (theatres.indexOf(theatre) % 5) + 1 : 0;

  function chooseFilm(slug: string) {
    setFilmSlug(slug); setCinema(""); setRegion(""); setTheatre(""); setSelectedTime(""); setBookingMessage("");
    window.history.replaceState({}, "", `/film?film=${slug}`);
  }

  function startBooking() {
    if (ready) {
      if (!selectedTime) {
        setBookingMessage("Pilih jam tayang terlebih dahulu.");
        document.getElementById("theatre-schedule")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (!userName) {
        setAuthOpen(true);
        return;
      }
      setBookingMessage(`Siap booking ${selectedTime} di ${theatre}, Studio ${studioNumber}`);
      return;
    }
    setBookingMessage("Pilih lokasi penayangan pada bagian “Tayang di Mana?” di bawah.");
    document.getElementById("showing-locations")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseShowtime(time: string) {
    setSelectedTime(time);
    setBookingMessage("");
    window.localStorage.setItem("cinepassPendingBooking", JSON.stringify({ filmSlug, cinema, region, theatre, studio: studioNumber, time }));
    if (!userName) setAuthOpen(true);
  }

  const authRedirect = `/film?film=${filmSlug}`;
  const bookingSummary: BookingSummary = { film:film.title, filmSlug, cinema, region, theatre, studio:studioNumber, time:selectedTime, image:film.image };

  return <main className="film-page">
    <header className="film-header">
      <Link className="brand" href="/" aria-label="Kembali ke beranda"><span>Cine</span><strong>Pass</strong><b>★</b></Link>
      <Link className="back-home" href="/">← Kembali ke beranda</Link>
      <div className="header-actions">{userName ? <Link className="user-chip" href="/profile">● Hai, {userName}</Link> : <><Link className="button ghost" href={`/login?redirect=${encodeURIComponent(authRedirect)}`}>Masuk</Link><Link className="button primary" href={`/register?redirect=${encodeURIComponent(authRedirect)}`}>Daftar</Link></>}</div>
    </header>

    <section className="film-top" style={{backgroundImage:`linear-gradient(90deg,#050711 5%,#050711c9 42%,#05071173),url(${film.image})`}}>
      <div className="film-top-copy"><p className="eyebrow">SEKARANG TAYANG</p><h1>{film.title}</h1><div className="metadata"><span>{film.age}</span><span>{film.genre}</span><span>{film.duration}</span><span>★ {film.rating}</span></div><p>Kenali ceritanya, tonton trailer, lalu lihat film ini tayang di bioskop mana saja.</p></div>
    </section>

    <nav className="film-picker" aria-label="Pilih film">
      {films.map((item) => <button key={item.slug} className={item.slug === filmSlug ? "active" : ""} onClick={() => chooseFilm(item.slug)}><span style={{backgroundImage:`url(${item.image})`}} />{item.title}</button>)}
    </nav>

    <section className="film-detail ready" aria-label={`Detail film ${film.title}`}>
      <div className="detail-poster"><Image src={film.image} alt={`Poster ${film.title}`} width={680} height={1020} priority /><div className="poster-actions"><button className="trailer-action" onClick={() => setTrailerOpen(true)}>▶ Tonton Trailer</button><button className="book-action" onClick={startBooking}>🎟 Booking Sekarang</button></div>{bookingMessage && <p className="booking-message">{ready ? "✓" : "ⓘ"} {bookingMessage}</p>}</div>
      <div className="synopsis"><p className="eyebrow">TENTANG FILM</p><h2>{film.title}</h2><div className="metadata"><span>{film.age}</span><span>{film.genre}</span><span>{film.duration}</span><span>★ {film.rating}/10</span></div><h3>Sinopsis</h3><p>{film.synopsis}</p>
        {ready ? <div className="selected-cinema"><span>Lokasi pilihanmu</span><strong>{theatre}</strong><small>{cinema} · {region} · Studio {studioNumber}{selectedTime ? ` · ${selectedTime}` : " · Pilih jam tayang"}</small></div> : <div className="availability-note"><span>⌖</span><div><strong>Ingin menonton film ini?</strong><p>Lihat jaringan bioskop, wilayah, dan teater yang menayangkannya di bawah.</p></div></div>}
      </div>
    </section>

    <section className="booking-flow" id="showing-locations">
      <div className="flow-heading"><div><p className="eyebrow">LOKASI PENAYANGAN</p><h2>Tayang di mana?</h2><p className="flow-description">Gunakan pilihan ini untuk melihat lokasi dan jadwal penayangan. Sinopsis dan trailer tetap bisa dinikmati tanpa memilih lokasi.</p></div><div className="flow-steps"><span className={cinema ? "done" : "active"}>1 <b>Bioskop</b></span><i/><span className={region ? "done" : cinema ? "active" : ""}>2 <b>Wilayah</b></span><i/><span className={theatre ? "done" : region ? "active" : ""}>3 <b>Teater</b></span></div></div>

      <div className="choice-block"><h3>1. Pilih jaringan bioskop</h3><div className="cinema-choices">
        {(["XXI","CGV"] as Cinema[]).map((item) => <button key={item} className={`${item.toLowerCase()} ${cinema === item ? "selected" : ""}`} onClick={() => {setCinema(item);setRegion("");setTheatre("");setSelectedTime("");}}><strong>{item}</strong><small>{item === "XXI" ? "Cinema XXI" : "Cultureplex"}</small><em>{cinema === item ? "✓ Dipilih" : "Pilih"}</em></button>)}
      </div></div>

      <div className={`choice-block reveal ${!cinema ? "locked" : ""}`}><h3>2. Pilih wilayah</h3><div className="pill-choices">
        {cinema ? regions.map((item) => <button key={item} className={region === item ? "selected" : ""} onClick={() => {setRegion(item);setTheatre("");setSelectedTime("");}}>⌖ {item}</button>) : <p>Pilih jaringan bioskop terlebih dahulu.</p>}
      </div></div>

      <div className={`choice-block reveal ${!region ? "locked" : ""}`}><h3>3. Pilih teater</h3><div className="theatre-choices">
        {region ? theatres.map((item, index) => <button key={item} className={theatre === item ? "selected" : ""} onClick={() => {setTheatre(item);setSelectedTime("");setBookingMessage("");}}><span>▣</span><div><strong>{item}</strong><small>{region} · Studio {(index % 5) + 1} · Regular</small></div><em>{theatre === item ? "✓" : "→"}</em></button>) : <p>Pilih wilayah untuk melihat teater yang tersedia.</p>}
      </div></div>

      {theatre && <div className="theatre-schedule" id="theatre-schedule"><div className="schedule-heading"><div><p className="eyebrow">JADWAL HARI INI</p><h3>{theatre}</h3><span>Studio {studioNumber} · Regular · {film.duration}</span></div><div className="screen-label">LAYAR</div></div><div className="schedule-times">{showtimes.map((time, index) => <button key={time} className={selectedTime === time ? "selected" : ""} onClick={() => chooseShowtime(time)}><strong>{time}</strong><small>{index === showtimes.length - 1 ? "Terakhir" : "Tersedia"}</small></button>)}</div><p className="last-show-note">Penayangan pertama pukul 10.00 · Penayangan terakhir pukul 22.00</p></div>}
    </section>

    {userName && selectedTime && <SeatBooking booking={bookingSummary} />}

    {trailerOpen && <div className="trailer-modal" role="dialog" aria-modal="true" aria-label={`Trailer ${film.title}`} onClick={() => setTrailerOpen(false)}><div onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setTrailerOpen(false)}>×</button><div className="trailer-screen" style={{backgroundImage:`linear-gradient(#05071150,#050711d9),url(${film.image})`}}><button>▶</button><strong>Trailer {film.title}</strong><small>Video trailer akan diputar di sini</small></div></div></div>}
    {authOpen && <AuthGate booking={bookingSummary} redirect={authRedirect} onClose={() => setAuthOpen(false)} />}
  </main>;
}
