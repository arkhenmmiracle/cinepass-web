"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type IconName = "film" | "cinema" | "ticket" | "food" | "search" | "play" | "arrow";

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    film: <><rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M7 3l2 3m4-3 2 3m4-3 2 3"/><path d="m10 13 5 3-5 3z"/></>,
    cinema: <><path d="M3 21h18M5 21V9l7-5 7 5v12"/><path d="M8 12h8v5H8zM9 21v-4m6 4v-4"/></>,
    ticket: <><path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M12 8v2m0 4v2"/></>,
    food: <><path d="M7 8h10l-1 13H8zM9 8 8 4m4 4V3m3 5 1-4"/><path d="M8 12h8"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    play: <path d="m9 7 8 5-8 5z"/>,
    arrow: <><path d="M5 12h14m-5-5 5 5-5 5"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const movies = [
  { slug: "dewa-laut", title: "Dewa Laut", rating: "8.9", genre: "Fantasy", image: "/images/poster-dewa-laut.png", accent: "#38bdf8" },
  { slug: "neon-heart", title: "Neon Heart", rating: "8.6", genre: "Sci-Fi", image: "/images/poster-neon-heart.png", accent: "#d946ef" },
  { slug: "bintang-jatuh", title: "Bintang Jatuh", rating: "9.2", genre: "Drama", image: "/images/poster-bintang-jatuh.png", accent: "#fb7185", badge: "Paling Banyak Ditonton" },
  { slug: "rumah-di-ujung-jalan", title: "Rumah di Ujung Jalan", rating: "8.3", genre: "Horror", image: "/images/poster-rumah.png", accent: "#f97316" },
  { slug: "komando-garuda", title: "Komando Garuda", rating: "8.7", genre: "Action", image: "/images/poster-komando.png", accent: "#eab308" },
  { slug: "mimpi-di-osaka", title: "Mimpi di Osaka", rating: "8.5", genre: "Romance", image: "/images/poster-osaka.png", accent: "#f9a8d4" },
];

const navItems = [
  { id: "film", label: "Film", icon: "film" as IconName },
  { id: "cinema", label: "Bioskop", icon: "cinema" as IconName },
  { id: "promo", label: "Promo", icon: "ticket" as IconName },
  { id: "food", label: "Makanan", icon: "food" as IconName },
];

const heroSlides = [
  {
    eyebrow: "CINEPASS ORIGINAL PREMIERE",
    title: "STARBOUND",
    copy: "Petualangan terbesar\ndimulai malam ini.",
    age: "13+",
    genre: "Adventure",
    duration: "2j 15m",
    price: "Rp45.000",
    image: "/images/hero-starbound.png",
    position: "center 18%",
  },
  {
    eyebrow: "FANTASY EVENT OF THE YEAR",
    title: "DEWA LAUT",
    copy: "Legenda dari kedalaman\nkembali mengguncang dunia.",
    age: "13+",
    genre: "Fantasy",
    duration: "2j 05m",
    price: "Rp50.000",
    image: "/images/poster-dewa-laut.png",
    position: "center 36%",
  },
  {
    eyebrow: "A CINEPASS EXCLUSIVE",
    title: "NEON HEART",
    copy: "Di kota penuh cahaya,\ncinta menemukan jalannya.",
    age: "13+",
    genre: "Sci-Fi Romance",
    duration: "1j 54m",
    price: "Rp45.000",
    image: "/images/poster-neon-heart.png",
    position: "center 28%",
  },
  {
    eyebrow: "NOW SHOWING",
    title: "BINTANG JATUH",
    copy: "Satu malam, satu harapan,\ndan cerita yang tak terlupakan.",
    age: "SU",
    genre: "Drama",
    duration: "1j 48m",
    price: "Rp40.000",
    image: "/images/poster-bintang-jatuh.png",
    position: "center 32%",
  },
];

export default function Home() {
  const [activeNav, setActiveNav] = useState("film");
  const [movieFilter, setMovieFilter] = useState("Sedang Tayang");
  const [query, setQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem("cinepassUser");
      if (saved) {
        try { setUserName(JSON.parse(saved).name || "Member"); } catch { setUserName("Member"); }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (heroPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroPaused]);

  const slide = heroSlides[activeSlide];
  const titleSize = slide.title.length > 12 ? "long" : slide.title.length > 8 ? "medium" : "short";

  const visibleMovies = useMemo(() => {
    if (!query.trim()) return movies;
    return movies.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  function runSearch() {
    setSearchMessage(query.trim() ? `Menampilkan hasil untuk “${query}”` : "Ketik judul film atau nama bioskop.");
    document.getElementById("movies")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CinePass beranda">
          <span>Cine</span><strong>Pass</strong><b>★</b>
        </a>
        <div className="header-actions">{userName ? <Link className="user-chip profile-link" href="/profile"><span className="profile-avatar">{userName.charAt(0).toUpperCase()}</span><span>Hai, {userName}<small>Lihat profil</small></span></Link> : <><Link className="button ghost" href="/login?redirect=%2F">Masuk</Link><Link className="button primary" href="/register?redirect=%2F">Daftar</Link></>}</div>
      </header>

      <section className="hero" id="top" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)} aria-label="Film unggulan">
        <div className="hero-backgrounds" aria-hidden="true">
          {heroSlides.map((item, index) => (
            <div key={item.title} className={`hero-background ${index === activeSlide ? "active" : ""}`} style={{ backgroundImage: `url(${item.image})`, backgroundPosition: item.position }} />
          ))}
        </div>
        <div className="hero-shade" />
        <div className="hero-content hero-content-animated" key={slide.title}>
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1 className={`hero-title hero-title-${titleSize}`}>{slide.title}</h1>
          <p className="hero-copy">{slide.copy.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && <br />}</span>)}</p>
          <div className="metadata"><span>{slide.age}</span><span>{slide.genre}</span><span>{slide.duration}</span></div>
          <div className="hero-cta">
            <button className="button coral"><Icon name="ticket" size={20}/> Pesan Sekarang</button>
            <button className="trailer"><span><Icon name="play" size={24}/></span> Lihat Trailer</button>
          </div>
        </div>
        <div className="price-ticket" key={slide.price}><small>Mulai</small><strong>{slide.price}</strong><i>★</i></div>
        <div className="hero-dots" role="tablist" aria-label="Pilih film unggulan">
          {heroSlides.map((item, index) => (
            <button key={item.title} className={index === activeSlide ? "active" : ""} onClick={() => setActiveSlide(index)} aria-label={`Tampilkan ${item.title}`} aria-selected={index === activeSlide} role="tab" />
          ))}
        </div>
      </section>

      <section className="quick-nav" aria-label="Navigasi utama">
        <div className="nav-icons">
          {navItems.map((item) => (
            <button key={item.id} className={`nav-icon ${activeNav === item.id ? "active" : ""}`} onClick={() => { setActiveNav(item.id); if (item.id === "film") window.location.href = "/film"; if (item.id === "cinema") window.location.href = "/bioskop"; }}>
              <span><Icon name={item.icon} /></span><small>{item.label}</small>
            </button>
          ))}
        </div>
        <div className="divider" />
        <form className="search-box" onSubmit={(event) => { event.preventDefault(); runSearch(); }}>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari film atau bioskop" aria-label="Cari film atau bioskop" />
          <button type="submit" aria-label="Cari"><Icon name="search" /></button>
        </form>
      </section>

      <section className="section" id="movies">
        <div className="section-heading">
          <h2>Lagi Seru di Bioskop</h2>
          <div className="tabs">
            {["Sedang Tayang", "Segera Hadir", "Terpopuler"].map((tab) => <button key={tab} className={movieFilter === tab ? "active" : ""} onClick={() => setMovieFilter(tab)}>{tab}</button>)}
          </div>
          <a href="#movies">Lihat Semua <Icon name="arrow" size={16}/></a>
        </div>
        {searchMessage && <p className="search-message">{searchMessage}</p>}
        <div className="movie-grid">
          {visibleMovies.map((movie) => (
            <a className="movie-card movie-card-link" href={`/film?film=${movie.slug}`} key={movie.title} style={{"--accent": movie.accent} as React.CSSProperties}>
              <div className="poster" style={{backgroundImage: `linear-gradient(180deg, transparent 58%, rgba(4,6,13,.9)), url(${movie.image})`}}>
                {movie.badge && <span className="badge">{movie.badge}</span>}
                <div className="poster-title">{movie.title}</div>
              </div>
              <div className="movie-meta"><span>★ {movie.rating}</span><small>{movie.genre}</small></div>
            </a>
          ))}
        </div>
      </section>

      <section className="section cinema-section">
        <div className="section-heading simple"><h2>Mau Nonton di Mana?</h2></div>
        <div className="cinema-grid">
          <article className="cinema-card xxi">
            <div><strong>XXI</strong><p>Kualitas terbaik,<br/>pengalaman tak terlupakan.</p><button onClick={() => { window.location.href = "/bioskop?cinema=XXI"; }}>Lihat Bioskop <Icon name="arrow" size={18}/></button></div>
          </article>
          <article className="cinema-card cgv">
            <div><strong>CGV</strong><p>Seru bareng,<br/>feel-nya beda!</p><button onClick={() => { window.location.href = "/bioskop?cinema=CGV"; }}>Lihat Bioskop <Icon name="arrow" size={18}/></button></div>
            <div className="popcorn-mascot">🍿</div>
          </article>
        </div>
      </section>

      <section className="section promos">
        <div className="section-heading simple"><h2>Promo Bikin Nonton Makin Seru</h2><a href="#promo">Lihat Semua Promo <Icon name="arrow" size={16}/></a></div>
        <div className="promo-grid" id="promo">
          <article className="promo-card purple"><div><strong>BUY 1<br/>GET 1</strong><p>Nonton berdua lebih hemat!</p><button>Lihat Promo</button></div><span>🎟️</span></article>
          <article className="promo-card orange"><div><strong>COMBO<br/>POPCORN HEMAT</strong><p>Mulai dari <b>Rp60.000</b></p></div><span>🍿🥤</span></article>
          <article className="promo-card blue"><div><strong>WEEKEND<br/>SPECIAL</strong><p>Diskon hingga <b>25%</b></p><small>Setiap Sabtu & Minggu</small></div><span>%</span></article>
        </div>
      </section>

      <section className="section experiences">
        <div className="section-heading simple"><h2>Pilih Pengalaman Nontonmu ✨</h2></div>
        <div className="experience-grid">
          <article className="experience regular"><span>🪑</span><h3>REGULAR</h3><p>Nyaman untuk semua momen nontonmu.</p></article>
          <article className="experience premiere"><span>♛</span><h3>PREMIERE</h3><p>Kursi lebih lega, layanan lebih istimewa.</p></article>
          <article className="experience imax"><h3>IMAX</h3><p>Layar lebih besar, detail makin terasa.</p></article>
          <article className="experience fourdx"><h3>4DX</h3><p>Gerak, angin, dan efek bikin nonton lebih hidup.</p></article>
        </div>
      </section>

      <section className="club section">
        <div className="club-ticket">CINE<br/>PASS <b>★</b><small>CLUB</small></div>
        <div><h2>Gabung CinePass Club</h2><p>Kumpulkan poin setiap kali nonton dan tukarkan dengan hadiah seru!</p></div>
        <button className="button amber">Daftar Gratis <Icon name="arrow" size={18}/></button>
        <span className="floating-ticket">🎟️</span>
      </section>

      <footer>
        <div><a className="brand footer-brand" href="#top"><span>Cine</span><strong>Pass</strong><b>★</b></a><p>Nonton makin gampang,<br/>seru tiap saat.</p><div className="socials">◎ ♪ ▶ ● 𝕏</div></div>
        <div><h4>Produk</h4><a>Film</a><a>Bioskop</a><a>Promo</a><a>Makanan</a></div>
        <div><h4>Bantuan</h4><a>Pusat Bantuan</a><a>Hubungi Kami</a><a>Cara Pemesanan</a><a>Syarat & Ketentuan</a></div>
        <div><h4>Tentang Kami</h4><a>Tentang CinePass</a><a>Karier</a><a>Blog</a><a>Kebijakan Privasi</a></div>
        <div><h4>Download Aplikasi</h4><button className="store">▶ Google Play</button><button className="store"> App Store</button></div>
        <small className="copyright">© 2026 CinePass. Semua hak dilindungi.</small>
      </footer>
    </main>
  );
}
