# Bryllupsside — Alexander & Tonje, 28. august 2027

Statisk side, én fil: `index.html`. Ingen byggesteg og ingen avhengigheter utover
Google Fonts. Vercel deployer `main` automatisk til tonjeogalexander.vercel.app.

Siden er **tospråklig** — norsk og engelsk. Norsk er standard; gjesten bytter
med velgeren i toppen eller bunnen, og valget huskes.

Åpne `index.html` direkte i nettleseren for å se endringer — det er hele
utviklingsoppsettet.

## Oppsett

Alt som må fylles inn ligger i `KONFIG` nederst i `index.html`:

```js
var KONFIG = {
  rsvpEndepunkt:  '',            // URL som tar imot POST med JSON
  rsvpEpost:      '',            // e-postadresse — alternativ til endepunkt
  onskelisteUrl:  '',            // lenke til ønskelisten
  onskelisteNavn: 'Ønskelisten vår',
  vipps:          '',            // f.eks. '123 45'
  kontonummer:    ''             // f.eks. '1234.56.78901'
};
```

Siden retter seg etter verdiene: et gavekort uten verdi vises ikke, og
RSVP-en velger leveringsmåte etter hva som er satt. Ingenting annet må endres.

I tillegg gjenstår disse tekstene — søk på ordet i kolonnen «Søk på»:

| Hva | Søk på | Merknad |
|---|---|---|
| Historien i «Oss» + sitatet | `TEKST` | Tre–fire korte avsnitt kler spalten |
| Klokkeslettene i programmet | `TEKST` | Antatt, ikke bekreftet |
| Overnatting og transport | `TEKST` | Står som «kommer» — fyll inn først når det er bestemt |
| Kontaktinfo til toastmaster | `TEKST` | Ingen telefonnummer i filen nå |
| Kart-lenken | `Se i kart` | Peker på et Google Maps-**søk**, ikke en delt pin |
| Tre bilder av gården | `BILDE` | Se tabellen under |

## Tospråklig

Hver tekst finnes to ganger, som `.no` og `.en`:

```html
<span class="no">Vielse ved vannet</span><span class="en">Ceremony by the water</span>
```

For hele avsnitt settes klassen på selve elementet (`<p class="no">` / `<p class="en">`).
CSS viser bare det aktive språket:

```css
html[data-lang="no"] .en,
html[data-lang="en"] .no{ display:none !important; }
```

Vi setter aldri `display` på språket som *skal* vises — da beholder elementet sin
egen visning, og ingen andre regler kommer i veien. Uten JavaScript vises norsk.

Attributter som ikke er tekstinnhold byttes av `settSprak()`:

| Attributt | Dataattributt |
|---|---|
| `placeholder` | `data-plassholder-no` / `data-plassholder-en` |
| `alt` | `data-alt-no` / `data-alt-en` |
| knappetekst | `data-etikett-no` / `data-etikett-en` |
| `<title>` | `data-tittel-no` / `data-tittel-en` på `<html>` |

Tekst som lages i JavaScript (nedtelling, feilmeldinger, takkeskjerm) bruker
hjelperen `T('norsk', 'english')`.

**Legger du til tekst, må begge språk fylles inn.** Ellers står det tomt for
halvparten av gjestene.

## Bilder

Ligger i `bilder/`. Alle bilder av dere to er på plass. Det som mangler er
**tre ekte foto av Huser Gård** — til de kommer, står akvarellen og tre tydelige
plassholdere i mosaikken.

| Fil | Mål | Plassering | Status |
|---|---|---|---|
| `hero-portal.jpg` | 864 × 1152 (3:4) | Hero — navnene ligger oppå | ✅ |
| `oss-portrett.jpg` | 1200 × 1500 (4:5) | Oss — buet portrett | ✅ |
| `oss-snap.jpg` | 600 × 600 (1:1) | Oss — polaroid nede til høyre | ✅ |
| `oyeblikk-01…05.jpg` | 600 × 600 (1:1) | Øyeblikk-stripen | ✅ |
| `akvarell-gaarden.jpg` | 1600 × 1113 | Stedet — hele maleriet | ✅ |
| `sted-akvarell-hus.jpg` | 800 × 1000 (4:5) | Stedet — hovedhuset | ✅ |
| `sted-akvarell-bryggen.jpg` | 780 × 1041 (3:4) | Stedet — bryggen, buet topp | ✅ |
| `dagen-akvarell.jpg` | 760 × 1013 (3:4) | Dagen — sticky bildespalte | ✅ |
| `sted-detalj.jpg` | 1000 × 1000 (1:1) | Stedet — detalj | mangler |
| `sted-laaven.jpg` | 1000 × 1000 (1:1) | Stedet — låven | mangler |
| `sted-hagen.jpg` | 1000 × 1250 (4:5) | Stedet — hagen i kveldslys | mangler |

De tre som mangler vises som tydelige plassholdere til de kommer. Bytt hele
`<div class="ph ph--dark">` mot en `<img>` med samme `aspect-ratio` og
`object-fit: cover`, og gi den `data-alt-no` / `data-alt-en`.

### Akvarellen

Akvarellen fra save the date-kortet bærer Stedet-seksjonen: hele maleriet i
passepartout mot den mørke flaten, og to detaljutsnitt i mosaikken. Den er
klippet fra kortet slik det kom inn på telefon (1077 px bredt) og skalert opp
mykt — det tåler et akvarell, men **har dere originalfilen fra den som tegnet
kortet, bytt den inn**. Da blir maleriet skarpt på store skjermer.

`bilder/save-the-date.jpg` er hele kortet, tatt vare på for senere bruk.

### Om `height`-attributtet på `<img>`

Alle `<img>` har `width` og `height` for å unngå layoutskift. Da må CSS ha
`height:auto` når `aspect-ratio` skal bestemme høyden — ellers vinner
`height`-attributtet, og `object-fit:cover` zoomer bildet feil. Basisregelen
`img{ height:auto }` tar dette; `.portal__frame img` setter `height:100%` selv.

`og:image` i `<head>` peker på hero-bildet med absolutt URL. Får siden et eget
domene, må den URL-en oppdateres — relative stier virker ikke i OG-tagger.

## RSVP

Skjemaet spør om navn, e-post, om gjesten kommer, antall, behov for felles
transport og allergier. Velger gjesten «Dessverre ikke», skjules feltene som
ikke lenger gir mening, og svaret sendes med `antall: 0`.

Hvor svaret havner styres av `KONFIG` — tre moduser, i denne rekkefølgen:

**1. `rsvpEndepunkt` satt.** Svaret sendes som `POST` med JSON-kroppen
`{ navn, epost, kommer, antall, transport, allergier }`. Knappen låses under
sending; svarer serveren noe annet enn 2xx, får gjesten feilmelding og kan
prøve igjen — takkeskjermen vises ikke. Fungerer med alt som tar imot JSON:

- **Formspree / Formspark / Getform** — opprett et skjema, lim inn URL-en. Ingen kode.
- **Supabase** — se SQL-en under.
- **Egen Vercel-funksjon** — legg en fil i `api/rsvp.js`; Vercel bygger den av seg selv.

**2. `rsvpEpost` satt (og ikke noe endepunkt).** Krever ingen backend i det hele
tatt: skjemaet åpner gjestens e-postklient med hele svaret ferdig utfylt, og
gjesten trykker send. Dette er den raskeste veien til en påmelding som faktisk
virker. Ulempen er at gjesten må ha en e-postklient satt opp, og at svarene
kommer som løs e-post i stedet for en liste.

**3. Ingen av delene (slik filen ligger nå).** Skjemaet sier fra at påmeldingen
ikke er åpen ennå. Det viser aldri en takkeskjerm uten at svaret faktisk er på
vei et sted — en gjest som tror hun har svart, men ikke har det, er verre enn
et skjema som sier at det ikke er klart.

Supabase-oppsett hvis du vil ha svarene i en tabell:

```sql
create table rsvp (
  id uuid primary key default gen_random_uuid(),
  navn text not null,
  epost text not null,
  kommer boolean not null,
  antall int not null default 1,
  transport boolean not null default false,
  allergier text,
  opprettet timestamptz not null default now()
);
alter table rsvp enable row level security;
create policy "anon kan svare" on rsvp for insert to anon with check (true);
-- ingen select-policy: gjestelisten leses kun fra dashboardet
```

Sett `rsvpEndepunkt` til `https://<prosjekt>.supabase.co/rest/v1/rsvp` og legg
til `apikey`- og `Prefer: return=minimal`-headere i `fetch`-kallet. Anon-nøkkelen
kan ligge i klienten når RLS er satt opp som over.

## Gaver

Egen seksjon mellom «Stedet» og «Praktisk», bygget fra `KONFIG`. Hvert felt gir
ett kort, og et tomt felt gir ikke noe kort:

| Felt | Kort |
|---|---|
| `onskelisteUrl` (+ `onskelisteNavn`) | Lenke til ønskelisten, åpnes i nytt vindu |
| `vipps` | Vipps-nummer med kopier-knapp |
| `kontonummer` | Kontonummer med kopier-knapp |

Er alle tre tomme, står det at ønskelisten kommer senere, og gitteret skjules.
Kopier-knappene bruker `navigator.clipboard` der den finnes og faller tilbake
på en midlertidig `textarea` ellers, så de virker også på usikre opphav og i
eldre nettlesere.

Ønskelisten kan peke hvor som helst — Prisjakt, Amazon, Norgesgruppens
bryllupsliste, et Google Sheet. Siden bryr seg ikke om hvilken tjeneste.

## Detaljer som er lette å ødelegge

- **Nav-rekkefølgen** (Dagen, Stedet, Oss, Gaver, Praktisk) skiller seg bevisst
  fra DOM-rekkefølgen der Oss kommer først. Begge er tilsiktet.
- **Seks navpunkter er så mange det er plass til** på 320px. Legger du til et
  sjuende, brekker navet til to linjer og `scroll-margin-top` blir for liten.
  Derfor ligger bildestripa inne i «Oss» og ikke som en egen seksjon med
  eget navpunkt.
- **Bildestripa bruker faste spalter**, ikke `auto-fit`. Med `auto-fit` ble
  bildene til 3+1 med en foreldreløs rute på nettbrett. Åtte bilder gir 2×4
  under 680px og 4×2 over. Endrer du antall bilder, må spaltetallet gå opp
  mot det nye antallet — ellers står det igjen en halvtom rad.
- **Rekkefølgen i stripa er bevisst.** Den veksler mellom lyst og varmt, ute
  og inne, og holder de to 17. mai-bildene fra hverandre i begge oppsettene.
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
