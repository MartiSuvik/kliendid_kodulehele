# Website spec — kliendidkodulehele.ee

This is the handoff you asked for. Everything below needs code access; nothing here can be done from a browser.

---

## The headline finding

Your sitemap lists **15 URLs**. Google has indexed **2**.

The cause is not content. It's this:

```
Nav elements found on every page:
  SPAN[no-href]: Kliendid Kodulehele
  BUTTON[no-href]: KKK
  BUTTON[no-href]: Portfoolio
  BUTTON[no-href]: EN
```

**Your entire navigation is `<button>` elements, not `<a href>`.** The only crawlable internal link anywhere on the site is `/`. Googlebot cannot follow a button. It found 13 of your pages in the sitemap, saw that nothing on the internet links to them, and declined to index them.

Fix this one thing and it is worth more than everything else on this list combined.

Second finding, nearly as bad: **every page returns the identical `<title>` and an identical `<h1>`**.

| URL | title | h1 |
|---|---|---|
| `/` | Parim SEO/AI SEO Turundusagentuur Tallinn | same |
| `/teenused/google-seo` | Parim SEO/AI SEO Turundusagentuur Tallinn | same |
| `/teenused/kodulehe-arendus` | Parim SEO/AI SEO Turundusagentuur Tallinn | same |
| `/portfolio` | Parim SEO/AI SEO Turundusagentuur Tallinn | same |
| `/audit` | Parim SEO/AI SEO Turundusagentuur Tallinn | same |

Subpages also have **no meta description** and **no canonical tag**. And there's a second `<h1>` injected into the header on every page at `position:absolute`, so each page ships two H1s, one of them hidden and duplicated sitewide. Drop it.

One more: `scalingwebs.com` ranks organically for "turundusagentuur Tallinn" with **the exact same title tag** as this site. Two of your own properties are competing on the same string. Pick one to own it.

---

## 1. Make the navigation crawlable — do this first

Replace every nav `<button>` with a real link. In Next.js:

```tsx
// components/Header.tsx
import Link from 'next/link'

const NAV = [
  { href: '/teenused/google-seo',        label: 'Google SEO' },
  { href: '/teenused/kodulehe-arendus',  label: 'Kodulehe arendus' },
  { href: '/teenused/ai-tugi',           label: 'AI tugi' },
  { href: '/teenused/sotsiaalmeedia',    label: 'Sotsiaalmeedia' },
  { href: '/portfolio',                  label: 'Portfoolio' },
  { href: '/audit',                      label: 'Tasuta audit' },
]

export default function Header() {
  return (
    <header>
      <Link href="/" aria-label="Kliendid Kodulehele avaleht">
        <Logo />
      </Link>
      <nav>
        {NAV.map(i => <Link key={i.href} href={i.href}>{i.label}</Link>)}
      </nav>
      <Link href="/en" hrefLang="en">EN</Link>
    </header>
  )
}
```

Rules: no `onClick` router pushes, no `<button>` wrapping a `<Link>`, and the language switcher must be a real `<a>` too. If a dropdown hides the service links behind JS, render them in the DOM and hide with CSS, not conditionally.

## 2. Per-page metadata

Doc formula: BEST + primary category + city + business name + primary services + "near me", ~200 characters. Estonian equivalents below.

```tsx
// app/layout.tsx — remove any title/description here that isn't a template
export const metadata = {
  metadataBase: new URL('https://kliendidkodulehele.ee'),
  title: { template: '%s' },
}
```

```tsx
// app/page.tsx
export const metadata = {
  title: 'Parim SEO ja AI SEO turundusagentuur Tallinnas | Kliendid Kodulehele - Google SEO, kohalik SEO, kodulehe tegemine ja AI nähtavus. Otsid turundusagentuuri enda lähedal? Alusta tasuta auditist.',
  description: 'Kliendid Kodulehele on turundusagentuur Tallinnas. Toome su ettevõtte Google\'i otsingusse, Mapsi ja AI vastustesse. Tasuta audit, kirjalik eesmärk, 90 päeva garantii.',
  alternates: { canonical: '/', languages: { 'et-EE': '/', 'en': '/en' } },
}
```

```tsx
// app/teenused/google-seo/page.tsx
export const metadata = {
  title: 'Parim Google SEO teenus Tallinnas | Kliendid Kodulehele - otsingumootori optimeerimine, kohalik SEO, tehniline SEO audit ja märksõnauuring. Otsid SEO teenust enda lähedal? Tasuta audit.',
  description: 'Google SEO teenus Tallinnas. Tehniline optimeerimine, märksõnauuring, sisu ja kohalik SEO. Mõõdame tulemust päringute, mitte positsioonide järgi. Tasuta audit.',
  alternates: { canonical: '/teenused/google-seo', languages: { 'et-EE': '/teenused/google-seo', 'en': '/en/teenused/google-seo' } },
}
```

```tsx
// app/teenused/kodulehe-arendus/page.tsx
title: 'Parim kodulehe tegemine ja veebiarendus Tallinnas | Kliendid Kodulehele - Next.js kodulehed, e-poed, maandumislehed ja veebidisain. Otsid kodulehe tegijat enda lähedal? Tasuta konsultatsioon.'
description: 'Kohandatud kodulehe arendus Tallinnas. Next.js ja React, kiire laadimine, SEO algusest peale sisse ehitatud. Vaata portfoolio ja küsi tasuta konsultatsiooni.'
```

```tsx
// app/teenused/ai-tugi/page.tsx
title: 'Parim AI SEO ja GEO teenus Tallinnas | Kliendid Kodulehele - ChatGPT, Perplexity ja Google AI Overviews nähtavus, AI nähtavuse audit ja struktureeritud andmed. Otsid AI otsingu optimeerimist?'
description: 'AI otsingu optimeerimine ehk GEO Tallinnas. Teeme su ettevõtte nähtavaks ChatGPT-s, Perplexitys ja Google AI Overviews\'is. Alusta AI nähtavuse auditist.'
```

```tsx
// app/teenused/sotsiaalmeedia/page.tsx
title: 'Parim sotsiaalmeedia haldus Tallinnas | Kliendid Kodulehele - sisu loomine, postitusgraafik, Meta ja Instagram reklaam. Otsid sotsiaalmeedia haldajat enda lähedal? Tasuta strateegiakõne.'
description: 'Sotsiaalmeedia haldus Tallinnas. Sisu loomine, järjepidev postitusgraafik ja Meta reklaamid, mis toetavad sama eesmärki mis su koduleht: uued päringud.'
```

```tsx
// app/portfolio/page.tsx
title: 'Portfoolio | Kliendid Kodulehele - SEO ja kodulehe tööd Tallinnas. Vaata päris tulemusi Eesti ettevõtetega: +28 uut külastajat kuus, 3,4x käibekasv. Turundusagentuur Tallinnas.'
description: 'Meie tehtud tööd ja mõõdetud tulemused Eesti ettevõtetega. SEO, kodulehed ja AI nähtavus. Vaata numbreid ja otsusta ise.'
```

```tsx
// app/audit/page.tsx
title: 'Tasuta SEO ja AI nähtavuse audit | Kliendid Kodulehele Tallinn - vaatame su kodulehe ja Google\'i ettevõtteprofiili üle ja näitame, kust sa kliente kaotad. Turundusagentuur Tallinnas.'
description: 'Tasuta audit: kodulehe tehniline seis, märksõnad, Google\'i ettevõtteprofiil ja AI nähtavus. Saad prioriteetide järgi järjestatud tegevusplaani. Kohustusteta.'
```

```tsx
// app/kodulehe-tegemine-seo/page.tsx
title: 'Kodulehe tegemine koos SEO-ga Tallinnas | Kliendid Kodulehele - kiire Next.js koduleht, mis on algusest peale Google\'ile ehitatud. Otsid kodulehe tegijat enda lähedal? Tasuta audit.'
description: 'Koduleht ja SEO ühes projektis. Ehitame kiire, mobiilisõbraliku lehe, mis on Google\'ile loetav esimesest päevast. Tallinn ja kogu Eesti.'
```

## 3. H1 and H2

**Remove the `position:absolute` H1 from the header component.** Make it a `<span>` or put it inside the logo link. One H1 per page.

| Page | H1 | H2s (secondary categories + prominent services) |
|---|---|---|
| `/` | Parim SEO/AI SEO turundusagentuur Tallinnas | Google SEO ja kohalik SEO · AI otsingu optimeerimine (GEO) · Kodulehe tegemine ja arendus · Sotsiaalmeedia haldus · Teenindame Tallinnat ja kogu Eestit |
| `/teenused/google-seo` | Google SEO teenus Tallinnas | Otsingumootori optimeerimine · Kohalik SEO ja Google Maps · Tehniline SEO audit · Märksõnauuring · E-poe SEO |
| `/teenused/kodulehe-arendus` | Kodulehe tegemine ja veebiarendus Tallinnas | Kohandatud veebiarendus (Next.js) · E-poe loomine · Maandumislehe disain · Konversioonimäära optimeerimine |
| `/teenused/ai-tugi` | AI SEO ja GEO teenus Tallinnas | ChatGPT ja Perplexity nähtavus · Google AI Overviews · AI nähtavuse audit · Struktureeritud andmed |
| `/teenused/sotsiaalmeedia` | Sotsiaalmeedia haldus Tallinnas | Sisu loomine · Postitusgraafik · Meta ja Instagram reklaam · Sotsiaalmeedia strateegia |
| `/portfolio` | Portfoolio: SEO ja kodulehe tööd Tallinnas | (case study names) |
| `/audit` | Tasuta SEO ja AI nähtavuse audit | Mida audit sisaldab · Kellele see sobib · Kuidas edasi |

Your existing emotional headlines ("Ole Google'is nähtav, kui klient sind otsib.") are good copy — demote them to the lead paragraph or an H2, don't delete them.

## 4. NAP in the footer, sitewide

Right now `<footer>` contains only cookie banner text. There is no address anywhere on the site. Add:

```tsx
// components/Footer.tsx
<footer>
  <address itemScope itemType="https://schema.org/LocalBusiness">
    <strong itemProp="name">Kliendid Kodulehele</strong><br />
    <span itemProp="legalName">EFFI AI SOLUTIONS OÜ</span><br />
    <span itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
      <span itemProp="streetAddress">Tornimäe tn 5</span>,{' '}
      <span itemProp="postalCode">10145</span>{' '}
      <span itemProp="addressLocality">Tallinn</span>,{' '}
      <span itemProp="addressCountry">Eesti</span>
    </span><br />
    <a href="tel:+37256728448" itemProp="telephone">+372 5672 8448</a><br />
    <a href="mailto:info@kliendidkodulehele.ee" itemProp="email">info@kliendidkodulehele.ee</a>
  </address>

  <nav aria-label="Teenused">
    <h2>Meie teenused</h2>
    {/* link to all service pages */}
  </nav>
</footer>
```

The NAP string must match GBP character for character: `Kliendid Kodulehele` / `Tornimäe tn 5, 10145 Tallinn` / `+372 5672 8448`.

## 5. Google embed map on the homepage

Doc requires the GBP embed on the homepage. Keyless version, pinned to your actual Place ID:

```html
<iframe
  title="Kliendid Kodulehele asukoht Tallinnas"
  src="https://maps.google.com/maps?q=Tornim%C3%A4e+tn+5,+10145+Tallinn&output=embed"
  width="100%" height="320" style="border:0"
  loading="lazy" referrerpolicy="no-referrer-when-downgrade"
  allowfullscreen></iframe>
```

Put it in the contact section, next to the NAP block.

## 6. Fix the LocalBusiness schema

Your current JSON-LD has `name`, `legalName`, `url`, `logo`, `image`, `description`, `areaServed`, `priceRange`, `openingHoursSpecification` — and is **missing address, telephone, geo, hasMap, sameAs**. `areaServed` is set to Country: Estonia, which tells Google nothing about Tallinn. Replace with:

```json
{
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "LocalBusiness"],
  "@id": "https://kliendidkodulehele.ee/#organization",
  "name": "Kliendid Kodulehele",
  "legalName": "EFFI AI SOLUTIONS OÜ",
  "url": "https://kliendidkodulehele.ee",
  "logo": "https://kliendidkodulehele.ee/logo.svg",
  "image": "https://kliendidkodulehele.ee/logo.svg",
  "description": "Turundusagentuur Tallinnas. Google SEO, kohalik SEO, AI otsingu optimeerimine (GEO) ja kodulehe arendus.",
  "telephone": "+372 5672 8448",
  "email": "info@kliendidkodulehele.ee",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Tornimäe tn 5",
    "addressLocality": "Tallinn",
    "postalCode": "10145",
    "addressRegion": "Harju maakond",
    "addressCountry": "EE"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 59.4332335,
    "longitude": 24.7609721
  },
  "hasMap": "https://www.google.com/maps/place/?cid=15239875479106362545",
  "areaServed": [
    { "@type": "City", "name": "Tallinn" },
    { "@type": "AdministrativeArea", "name": "Harju maakond" },
    { "@type": "Country", "name": "Estonia" }
  ],
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }],
  "sameAs": [
    "https://www.google.com/maps/place/?cid=15239875479106362545",
    "https://www.inforegister.ee/en/17306855-EFFI-AI-SOLUTIONS-OU/"
  ]
}
```

Add your LinkedIn / Facebook / Instagram URLs to `sameAs` as they exist. Add a `Service` schema block on each service page. Keep the existing `FAQPage` and `WebSite` blocks.

Validate at `https://validator.schema.org/` and `https://search.google.com/test/rich-results` after deploy.

## 7. hreflang for the /en/ tree

Both language versions currently carry the same title. Add reciprocal hreflang on every page pair:

```html
<link rel="alternate" hreflang="et-EE" href="https://kliendidkodulehele.ee/teenused/google-seo" />
<link rel="alternate" hreflang="en"    href="https://kliendidkodulehele.ee/en/teenused/google-seo" />
<link rel="alternate" hreflang="x-default" href="https://kliendidkodulehele.ee/" />
```

## 8. Deal with the scalingwebs.com title collision

Both sites use `Parim SEO/AI SEO Turundusagentuur Tallinn`. Decide which brand owns that phrase, and retitle the other. Right now you're splitting your own relevance signal for the exact term you're trying to win.

---

## Order of work

1. Nav links (unblocks everything)
2. Per-page titles + meta descriptions + canonicals
3. Single H1 per page, H2s per the table
4. Footer NAP + service links
5. Schema replacement
6. Map embed
7. hreflang
8. Resubmit sitemap in Search Console, request indexing on the 13 unindexed URLs

Once 1–4 ship, the page count problem largely solves itself — you already have the pages, Google just can't reach them.
