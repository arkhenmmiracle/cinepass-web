"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AuthGate, SeatBooking, type BookingSummary } from "../booking-ui";

const films = [
  {slug:"dewa-laut",title:"Dewa Laut",genre:"Fantasy",duration:"2j 05m",image:"/images/poster-dewa-laut.png"},
  {slug:"neon-heart",title:"Neon Heart",genre:"Sci-Fi",duration:"1j 54m",image:"/images/poster-neon-heart.png"},
  {slug:"bintang-jatuh",title:"Bintang Jatuh",genre:"Drama",duration:"1j 48m",image:"/images/poster-bintang-jatuh.png"},
  {slug:"komando-garuda",title:"Komando Garuda",genre:"Action",duration:"2j 02m",image:"/images/poster-komando.png"},
];
const locations = {
  XXI:{Jakarta:["Plaza Indonesia XXI","Gandaria City XXI","Kelapa Gading XXI"],Tangerang:["Living World XXI","Bintaro Xchange XXI"],Bekasi:["Summarecon Mall Bekasi XXI","Grand Metropolitan XXI"]},
  CGV:{Jakarta:["CGV Grand Indonesia","CGV Central Park","CGV Pacific Place"],Tangerang:["CGV Ecoplaza CitraRaya","CGV TerasKota"],Bekasi:["CGV Bekasi Cyber Park","CGV Lagoon Avenue"]},
} as const;
const days=[{short:"HARI INI",date:"22 Jul"},{short:"KAM",date:"23 Jul"},{short:"JUM",date:"24 Jul"},{short:"SAB",date:"25 Jul"},{short:"MIN",date:"26 Jul"}];
const times=["10.00","12.30","15.00","17.30","20.00","22.00"];
type Cinema=keyof typeof locations;

export default function CinemaPage(){
  const [cinema,setCinema]=useState<Cinema|"">(""); const [region,setRegion]=useState(""); const [theatre,setTheatre]=useState("");
  const [filmSlug,setFilmSlug]=useState(""); const [day,setDay]=useState(days[0].date); const [time,setTime]=useState(""); const [userName,setUserName]=useState(""); const [authOpen,setAuthOpen]=useState(false);
  useEffect(()=>{const timer=window.setTimeout(()=>{const saved=localStorage.getItem("cinepassUser");const pending=localStorage.getItem("cinepassPendingBooking");const requestedCinema=new URLSearchParams(window.location.search).get("cinema");if(saved){try{setUserName(JSON.parse(saved).name||"Member")}catch{setUserName("Member")}}if(requestedCinema==="XXI"||requestedCinema==="CGV"){setCinema(requestedCinema);setRegion("");setTheatre("");setFilmSlug("");setTime("");return}if(pending){try{const item=JSON.parse(pending);if(item.cinema==="XXI"||item.cinema==="CGV")setCinema(item.cinema);if(item.region)setRegion(item.region);if(item.theatre)setTheatre(item.theatre);if(item.filmSlug)setFilmSlug(item.filmSlug);if(item.day)setDay(item.day);if(item.time)setTime(item.time)}catch{localStorage.removeItem("cinepassPendingBooking")}}},0);return()=>clearTimeout(timer)},[]);
  const regions=cinema?Object.keys(locations[cinema]):[];
  const theatres: readonly string[] =
    cinema && region
      ? locations[cinema][region as keyof typeof locations[Cinema]] ?? []
      : [];
  const film=useMemo(()=>films.find(item=>item.slug===filmSlug),[filmSlug]);
  const studio=film?films.findIndex(item=>item.slug===filmSlug)%4+1:0;
  const summary:BookingSummary={film:film?.title||"",filmSlug,cinema,region,theatre,studio,day,time,image:film?.image};
  const redirect="/bioskop";
  function chooseTime(value:string){setTime(value);const booking={...summary,time:value};localStorage.setItem("cinepassPendingBooking",JSON.stringify(booking));if(!userName)setAuthOpen(true)}
  return <main className="cinema-page">
    <header className="film-header"><Link className="brand" href="/"><span>Cine</span><strong>Pass</strong><b>★</b></Link><Link className="back-home" href="/">← Kembali ke beranda</Link><div className="header-actions">{userName?<Link className="user-chip" href="/profile">● Hai, {userName}</Link>:<><Link className="button ghost" href="/login?redirect=%2Fbioskop">Masuk</Link><Link className="button primary" href="/register?redirect=%2Fbioskop">Daftar</Link></>}</div></header>
    <section className="cinema-hero"><div><p className="eyebrow">CINEPASS CINEMA GUIDE</p><h1>Temukan bioskop<br/>favoritmu.</h1><p>Pilih jaringan dan lokasi untuk melihat film serta jadwal yang tersedia hari ini.</p></div><div className="cinema-marquee"><span>XXI</span><i>+</i><strong>CGV</strong></div></section>
    <section className="cinema-booking-flow">
      <div className="cinema-flow-title"><p className="eyebrow">MULAI DARI BIOSKOP</p><h2>Pilih tempat nonton</h2><p>Urutkan berdasarkan jaringan bioskop, wilayah, lalu teater.</p></div>
      <div className="choice-block"><h3>1. Pilih jaringan bioskop</h3><div className="cinema-choices">{(["XXI","CGV"] as Cinema[]).map(item=><button key={item} className={`${item.toLowerCase()} ${cinema===item?"selected":""}`} onClick={()=>{setCinema(item);setRegion("");setTheatre("");setFilmSlug("");setTime("")}}><strong>{item}</strong><small>{item==="XXI"?"Cinema XXI":"Cultureplex"}</small><em>{cinema===item?"✓ Dipilih":"Pilih"}</em></button>)}</div></div>
      <div className={`choice-block ${!cinema?"locked":""}`}><h3>2. Pilih wilayah</h3><div className="pill-choices">{cinema?regions.map(item=><button key={item} className={region===item?"selected":""} onClick={()=>{setRegion(item);setTheatre("");setFilmSlug("");setTime("")}}>⌖ {item}</button>):<p>Pilih jaringan bioskop terlebih dahulu.</p>}</div></div>
      <div className={`choice-block ${!region?"locked":""}`}><h3>3. Pilih teater</h3><div className="theatre-choices">{region?theatres.map(item=><button key={item} className={theatre===item?"selected":""} onClick={()=>{setTheatre(item);setFilmSlug("");setTime("")}}><span>▣</span><div><strong>{item}</strong><small>{region} · Regular, Premiere</small></div><em>{theatre===item?"✓":"→"}</em></button>):<p>Pilih wilayah untuk melihat teater.</p>}</div></div>
      {theatre&&<div className="cinema-films"><div className="cinema-films-heading"><div><p className="eyebrow">SEDANG TAYANG</p><h2>Film di {theatre}</h2></div><span>{films.length} film tersedia</span></div><div className="cinema-film-grid">{films.map(item=><button key={item.slug} className={filmSlug===item.slug?"selected":""} onClick={()=>{setFilmSlug(item.slug);setTime("")}}><span style={{backgroundImage:`url(${item.image})`}}/><div><strong>{item.title}</strong><small>{item.genre} · {item.duration}</small><em>{filmSlug===item.slug?"✓ Dipilih":"Lihat jadwal"}</em></div></button>)}</div></div>}
      {film&&<div className="cinema-schedule"><div className="schedule-movie"><span style={{backgroundImage:`url(${film.image})`}}/><div><p className="eyebrow">PILIH JADWAL</p><h2>{film.title}</h2><small>{theatre} · Studio {studio} · Regular</small></div></div><div className="day-picker">{days.map(item=><button key={item.date} className={day===item.date?"selected":""} onClick={()=>{setDay(item.date);setTime("")}}><small>{item.short}</small><strong>{item.date}</strong></button>)}</div><div className="schedule-times">{times.map((item,index)=><button key={item} className={time===item?"selected":""} onClick={()=>chooseTime(item)}><strong>{item}</strong><small>{index===times.length-1?"Terakhir":"Tersedia"}</small></button>)}</div></div>}
    </section>
    {userName&&time&&<SeatBooking booking={summary}/>} {authOpen&&<AuthGate booking={summary} redirect={redirect} onClose={()=>setAuthOpen(false)}/>} 
  </main>
}
