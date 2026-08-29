/* =========================================================
   Sentral konfigurasjon / Central configuration
   Alt som må fylles inn er samlet her. Søk etter «TODO».
   Everything that needs filling in lives here. Search "TODO".
   ========================================================= */
window.WEDDING = {
  /* --- Paret og datoen / The couple and the date --- */
  couple:       'Alexander & Tonje',
  dateISO:      '2027-08-28T15:00:00+02:00',   // vielsen / the ceremony
  endISO:       '2027-08-29T02:00:00+02:00',   // omtrentlig slutt / approximate end
  dateLabel:    { no: 'Lørdag 28. august 2027', en: 'Saturday 28 August 2027' },

  /* --- Stedet / The venue --- */
  venueName:    'Huser Gård · WonderInn Riverside',
  venueStreet:  'Huservegen 128',              // TODO: bekreft adressen med gården
  venuePostal:  '2170 Fenstad',
  venueRegion:  'Nes kommune, Akershus',
  venueSite:    'https://wonderinn.no/no/riverside/',
  mapQuery:     'Huservegen 128, 2170 Fenstad',

  /* --- RSVP --- */
  rsvpDeadline: { no: '1. mai 2027', en: '1 May 2027' },
  // TODO: lim inn skjema-endepunkt (f.eks. Formspree: https://formspree.io/f/xxxxxxx).
  // Er den tom, faller skjemaene tilbake til e-post.
  rsvpEndpoint: '',
  rsvpEmail:    'post@example.com',            // TODO: deres egen e-postadresse

  /* --- Kontakt / Contact --- */
  contactEmail: 'post@example.com',            // TODO
  phoneBride:   '',                            // TODO
  phoneGroom:   '',                            // TODO
  toastmaster:  {
    name:  'Toastmaster',                      // TODO: navn / name
    email: 'post@example.com',                 // TODO
    phone: ''                                  // TODO
  }
};
