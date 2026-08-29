# Bryllupsside — Alexander & Tonje, 28. august 2027

Statisk side, én fil: `index.html`. Ingen byggesteg og ingen avhengigheter utover
Google Fonts. Vercel deployer `main` automatisk til tonjeogalexander.vercel.app.

Åpne `index.html` direkte i nettleseren for å se endringer — det er hele
utviklingsoppsettet.

## Gjenstår før publisering

Alt som mangler er markert i filen. Søk på ordet i kolonnen «Søk på».

| Hva | Søk på | Merknad |
|---|---|---|
| Historien i «Oss» + sitatet | `TEKST` | Tre–fire korte avsnitt kler spalten |
| Klokkeslettene i programmet | `TEKST` | Antatt, ikke bekreftet |
| Overnatting, transport, gaver | `TEKST` | Står som «kommer» — fyll inn først når det er bestemt |
| Kontaktinfo til toastmaster | `TEKST` | Ingen telefonnummer i filen nå |
| Kart-lenken | `Se i kart` | Peker på et Google Maps-**søk**, ikke en delt pin |
| Fem bilder | `BILDE` | Se tabellen under |
| RSVP-lagring | `RSVP_ENDPOINT` | Se «RSVP» under |

## Bilder

Legg filene i `bilder/`. Bytt hele `<div class="ph …">` mot en `<img>` med samme
`aspect-ratio` og `object-fit: cover`. Plassholderstilen er bevisst tydelig —
behold den til ekte bilder finnes.

| # | Fil | Mål | Plassering |
|---|---|---|---|
| 01 | `hero-huser-gard.jpg` | 2400 × 1050 (16:7) | Hero, maks 1180 px bred |
| 01b | `hero-huser-gard-mobile.jpg` | 1200 × 900 (4:3) | Hero under 640 px, via `<picture>` |
| 02 | `oss-portrett.jpg` | 1200 × 1500 (4:5) | Oss — `object-position: center 35%` |
| 03 | `sted-01.jpg` | 900 × 1200 (3:4) | Stedet — hovedhuset |
| 04 | `sted-02.jpg` | 900 × 1200 (3:4) | Stedet — vielsesplassen (forskjøvet 28 px ned på desktop) |
| 05 | `sted-03.jpg` | 900 × 1200 (3:4) | Stedet — hagen/låven |

Legg samtidig inn `og:image` i `<head>` (kommentar ligger der) så siden får
forhåndsvisning når lenken deles på SMS og Messenger.

## RSVP

Skjemaet validerer i nettleseren og sender `POST` med JSON-kroppen
`{ navn, epost, kommer, antall, allergier }` til URL-en i `RSVP_ENDPOINT`
nederst i `index.html`.

Så lenge `RSVP_ENDPOINT` er tom streng **tar ikke skjemaet imot svar**: gjesten
får beskjed om at påmeldingen ikke er åpen ennå, i stedet for en takkeskjerm.
Det er med vilje — en takkeskjerm uten lagring gjør at gjester tror de har
svart når de ikke har det.

Anbefalt backend er Supabase (samme stack som de øvrige prosjektene):

```sql
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  navn text not null,
  epost text not null,
  kommer boolean not null,
  antall int not null default 1,
  allergier text,
  opprettet timestamptz not null default now()
);
alter table rsvp enable row level security;
create policy "anon kan svare" on rsvp for insert to anon with check (true);
-- ingen select-policy: gjestelisten leses kun fra dashboardet
```

Sett `RSVP_ENDPOINT` til `https://<prosjekt>.supabase.co/rest/v1/rsvp` og legg
til `apikey`- og `Prefer: return=minimal`-headere i `fetch`-kallet. Anon-nøkkelen
kan ligge i klienten når RLS er satt opp som over. Alternativer uten database:
Formspark, Netlify Forms, eller en Vercel-funksjon som skriver til et Google Sheet.

## Detaljer som er lette å ødelegge

- **Nav-rekkefølgen** (Dagen, Stedet, Oss, Praktisk) skiller seg bevisst fra
  DOM-rekkefølgen der Oss kommer først. Begge er tilsiktet.
- **Praktisk-gitteret** får hairlines fra `gap: 1px` + bakgrunnsfarge på
  containeren, ikke fra borders på kortene. Endrer du `gap`, forsvinner linjene.
- **Nedtellingen** bruker eksplisitt `+02:00` så tallene blir like i alle tidssoner.
- **`[hidden]{ display: none !important }`** trengs fordi `.form` er `display: grid`
  og ellers overstyrer `hidden`-attributtet på skjemaet etter innsending.
- **`min-height` sammen med `aspect-ratio`** på bildeplassholderne gir dem en
  minstebredde og presser siden bred på 320 px. Derfor er `aspect-ratio` slått av
  under 400 px i stedet.
- **`scroll-margin-top: 76px`** på seksjonene hindrer at det sticky navet dekker
  overskriften ved ankerhopp.
- **`prefers-reduced-motion`** slår av hero-fade og alle transitions. Ikke fjern.

## Design tokens

Alle er CSS-variabler i `:root`. Endre der, ikke i reglene.

| Variabel | Verdi | Bruk |
|---|---|---|
| `--cream` | `#F6F1E3` | sidebakgrunn |
| `--cream-light` | `#FBF7EC` | Dagen, Praktisk, topp av hero-gradient |
| `--ink` | `#2C2F28` | tekst, Stedet, footer, submit |
| `--ink-soft` | `#3C4038` | brødtekst i Oss |
| `--sage-dark` | `#4E5B44` | lenker, klokkeslett, aktiv chip |
| `--sage` | `#7C8A6B` | eyebrow, script-aksent, hairlines |
| `--sage-light` | `#A9B79A` | stiplet kant på bildeplassholdere |
| `--muted` | `#5C6155` | kursiv sekundærtekst |
| `--muted-warm` | `#7E7869` | spec-tekst i plassholdere |
| `--gold` | `#C8A96A` | aksentlinjer, fokusfarge, `::selection` |
| `--on-dark` / `-2` / `-3` | `#F6F1E3` / `#CFCCBE` / `#A8A597` | tekst på ink |

Fonter (ett Google Fonts-kall): Cormorant Garamond 300–600 + kursiv (brødtekst,
overskrifter) · Jost 300–500 (eyebrow, nav, knapper, metadata — alltid uppercase
med 0.14–0.42em letter-spacing) · Parisienne (script: «og» i hero, signatur,
«Vi gleder oss»).

Ingen skygger noe sted. Radius: 999px på piller, 4–6px på bildeflater.
Seksjonspadding `clamp(80px,11vw,140px) 24px`.
