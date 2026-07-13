import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { motion } from "motion/react";
import * as m from "../paraglide/messages.js";

interface ServicePageProps {
  service: "seo" | "development" | "conversion" | "ai-support" | "social-media";
}

const serviceData = {
  seo: {
    titleKey: "service_seo_title",
    descriptionKey: "service_seo_description",
    heroHeading: "Olge nähtav Google's, kus otsivad teie kliendid",
    heroHeadingEn: "Be visible on Google where your customers search",
    benefits: [
      {
        title: "Top 3 positsioonid",
        titleEn: "Top 3 Rankings",
        description: "75% otsijatest käib top 3 tulemustele. Seal peab teie ettevõte olema.",
        descriptionEn: "75% of searchers click top 3 results. Your business must be there.",
      },
      {
        title: "Tasuta liiklus",
        titleEn: "Free Traffic",
        description: "Ei pea maksma igalt klikilt nagu Google Ads'is. SEO on pikaajaline investeering.",
        descriptionEn: "No per-click costs like Google Ads. SEO is a long-term investment.",
      },
      {
        title: "Pikaajaline kasv",
        titleEn: "Long-Term Growth",
        description: "Kui jõuate top 3-sse, jääte sinna tavaliselt aastateks ilma lisakuludeta.",
        descriptionEn: "Once you reach top 3, you typically stay there for years without extra costs.",
      },
      {
        title: "Konkurentsieelus",
        titleEn: "Competitive Advantage",
        description: "Ületa oma konkurendid ja saavuta dominantne koht oma valdkonnas.",
        descriptionEn: "Outrank your competitors and dominate your market segment.",
      },
    ],
  },
  development: {
    titleKey: "service_development_title",
    descriptionKey: "service_development_description",
    heroHeading: "Kiire, turvaline ja müügile optimeeritud veebileht",
    heroHeadingEn: "Fast, secure, and sales-optimized website",
    benefits: [
      {
        title: "Kiire laadimine",
        titleEn: "Lightning-Fast Performance",
        description: "Alla 1 sekundi laadimisaeg parandab SEO ja vähendab külastajate lahkumist.",
        descriptionEn: "Under 1-second load time improves SEO and reduces bounce rates.",
      },
      {
        title: "Konversioonile optimeeritud",
        titleEn: "Conversion-Focused",
        description: "Iga element on disainitud rohkemate õigete inimeste muutmiseks ostjateks.",
        descriptionEn: "Every element is designed to convert more visitors into customers.",
      },
      {
        title: "SEO-sõbralik",
        titleEn: "SEO-Friendly",
        description: "Struktuuri, kiirusega ja metaandmetega, et tõusta Google'is.",
        descriptionEn: "Structured for search engines to rank higher on Google.",
      },
      {
        title: "Turvaline ja usaldusväärsus",
        titleEn: "Secure & Reliable",
        description: "HTTPS, regulaarsed varukoopiaid ja 99.9% ülespidamise aeg.",
        descriptionEn: "HTTPS, regular backups, and 99.9% uptime guarantee.",
      },
    ],
  },
  conversion: {
    titleKey: "service_conversion_title",
    descriptionKey: "service_conversion_description",
    heroHeading: "Muuda rohkem külastajaid ostjateks",
    heroHeadingEn: "Turn more visitors into customers",
    benefits: [
      {
        title: "Kõrgem konversioonimäär",
        titleEn: "Higher Conversion Rate",
        description: "Optimeeri CTA, vormid ja kasutajateekond, et suurendada müüki.",
        descriptionEn: "Optimize CTAs, forms, and user journey to increase sales.",
      },
      {
        title: "Suurem käive",
        titleEn: "Increased Revenue",
        description: "Rohkem konversioon = rohkem tulu ilma lisakuludeta markeringule.",
        descriptionEn: "More conversions = more revenue without extra marketing spend.",
      },
      {
        title: "Andmepõhine optimeerimine",
        titleEn: "Data-Driven Optimization",
        description: "Kasutame A/B testimist ja analüütika andmeid paremate tulemuste saamiseks.",
        descriptionEn: "A/B testing and analytics to identify what actually works.",
      },
      {
        title: "Müügile suunatud disain",
        titleEn: "Sales-Focused Design",
        description: "Igal leheküljel on selge eesmärk: teisendada külastaja päringuteks.",
        descriptionEn: "Every page has one goal: convert visitors into inquiries.",
      },
    ],
  },
  "ai-support": {
    titleKey: "service_ai_support_title",
    descriptionKey: "service_ai_support_description",
    heroHeading: "Automaatne klienditugi 24/7",
    heroHeadingEn: "24/7 automated customer support",
    benefits: [
      {
        title: "Ükski päring ei jää vastamata",
        titleEn: "No Missed Inquiries",
        description: "AI-vestlusrobot vastab kohe ja hangib kontaktid teie CRM-i.",
        descriptionEn: "AI chatbot responds instantly and captures leads automatically.",
      },
      {
        title: "Klientide kvalifitseerimine",
        titleEn: "Lead Qualification",
        description: "Automaatne küsimine abil müügi teemile paremini valmistatud leads.",
        descriptionEn: "Automatically qualify leads so your sales team gets hot prospects.",
      },
      {
        title: "24/7 klienditugi",
        titleEn: "24/7 Support",
        description: "Ei pea palkama öökambrit. AI haldab põhilised küsimused alati.",
        descriptionEn: "No night shift needed. AI handles common questions anytime.",
      },
      {
        title: "Kulud vähenevad",
        titleEn: "Cost Reduction",
        description: "Vähem käsitöö, rohkem müüki. ROI tavaliselt nähtav esimeses kuus.",
        descriptionEn: "Less manual work, more sales. ROI typically seen in first month.",
      },
    ],
  },
  "social-media": {
    titleKey: "service_social_title",
    descriptionKey: "service_social_description",
    heroHeading: "Kasva sotsiaalmeediast",
    heroHeadingEn: "Grow from social media",
    benefits: [
      {
        title: "Regulaarne sisu",
        titleEn: "Consistent Content",
        description: "Igal nädalal professionaalset sisu, mis hoids teie audiensti kaasatud.",
        descriptionEn: "Weekly professional content that keeps your audience engaged.",
      },
      {
        title: "Sihitud kasv",
        titleEn: "Targeted Growth",
        description: "Otsime sobivaid jälgijaid, kes soovivad teie teenuseid.",
        descriptionEn: "We find followers who actually want your services.",
      },
      {
        title: "Brändi ehitamine",
        titleEn: "Brand Building",
        description: "Tugev brändi kohasutus sotsiaalmeediast tõstab teie usaldusväärsust.",
        descriptionEn: "Strong brand presence on social media builds trust and authority.",
      },
      {
        title: "Päringutest müügile",
        titleEn: "From Followers to Customers",
        description: "Sotsiaalmeedial on eesmärk: suunata jälgijad teie veebilehele ja müügile.",
        descriptionEn: "Social media followers become leads and customers on your website.",
      },
    ],
  },
};

function ServicePageContent({ service }: ServicePageProps) {
  const data = serviceData[service];
  const isEstonian = document.documentElement.lang === "et";
  const heading = isEstonian ? data.heroHeading : data.heroHeadingEn;

  const slugMap: Record<ServicePageProps["service"], string> = {
    seo: "google-seo",
    development: "kodulehe-arendus",
    conversion: "muugikonversioon",
    "ai-support": "ai-tugi",
    "social-media": "sotsiaalmeedia",
  };
  const slug = slugMap[service];
  const canonical = isEstonian
    ? `https://kliendidkodulehele.ee/teenused/${slug}`
    : `https://kliendidkodulehele.ee/en/teenused/${slug}`;
  const title = isEstonian ? m[data.titleKey as keyof typeof m]() : m[data.titleKey as keyof typeof m]();
  const description = isEstonian ? m[data.descriptionKey as keyof typeof m]() : m[data.descriptionKey as keyof typeof m]();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": title,
    "description": description,
    "url": canonical,
    "provider": {
      "@type": "ProfessionalService",
      "name": "Kliendid Kodulehele",
      "url": "https://kliendidkodulehele.ee"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Estonia"
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [service]);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{title} | Kliendid Kodulehele</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Kliendid Kodulehele`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={`${title} | Kliendid Kodulehele`} />
        <meta name="twitter:description" content={description} />
        <link rel="alternate" hrefLang="et" href={`https://kliendidkodulehele.ee/teenused/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`https://kliendidkodulehele.ee/en/teenused/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-['Poppins'] text-black font-bold text-center" style={{ fontSize: "48px", lineHeight: "1.2" }}>
              {heading}
            </h1>
            <p className="font-['Inter'] text-gray-600 text-center mt-6 max-w-3xl mx-auto" style={{ fontSize: "16px" }}>
              {service === "seo" && m.service_seo_description()}
              {service === "development" && m.service_development_description()}
              {service === "conversion" && m.service_conversion_description()}
              {service === "ai-support" && m.service_ai_support_description()}
              {service === "social-media" && m.service_social_description()}
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <motion.a
                href="#kontakt"
                whileHover={{ scale: 1.05 }}
                className="bg-black text-white font-['Inter'] font-medium px-8 py-3 rounded-full no-underline"
                style={{ fontSize: "14px" }}
              >
                {isEstonian ? "Alusta nüüd" : "Get Started"}
              </motion.a>
              <motion.a
                href={isEstonian ? "/konsultatsioon" : "/en/konsultatsioon"}
                whileHover={{ scale: 1.05 }}
                className="border-2 border-black text-black font-['Inter'] font-medium px-8 py-3 rounded-full no-underline"
                style={{ fontSize: "14px" }}
              >
                {isEstonian ? "Broneeri konsultatsioon" : "Book a consultation"}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block font-['Poppins'] font-bold text-[#1977f2] px-4 py-1 bg-blue-50 rounded-full" style={{ fontSize: "12px" }}>
              {isEstonian ? "Eelis" : "Benefits"}
            </span>
            <h2 className="font-['Poppins'] font-bold text-black mt-6" style={{ fontSize: "40px", lineHeight: "1.2" }}>
              {isEstonian ? "Miks see teenus?" : "Why this service?"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
              >
                <h3 className="font-['Poppins'] font-bold text-black mb-3" style={{ fontSize: "18px" }}>
                  {isEstonian ? benefit.title : benefit.titleEn}
                </h3>
                <p className="font-['Inter'] text-gray-600" style={{ fontSize: "14px" }}>
                  {isEstonian ? benefit.description : benefit.descriptionEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-16 text-center">
          <h2 className="font-['Poppins'] font-bold mb-4" style={{ fontSize: "36px" }}>
            {isEstonian ? "Alustame kohe?" : "Ready to get started?"}
          </h2>
          <p className="font-['Inter'] text-gray-300 mb-8" style={{ fontSize: "16px" }}>
            {isEstonian ? "Broneeri tasuta konsultatsioon ja uurime, kuidas see teenus aitab teie äril." : "Schedule a free consultation and let's discuss how this service can help your business."}
          </p>
          <motion.a
            href={isEstonian ? "/konsultatsioon" : "/en/konsultatsioon"}
            whileHover={{ scale: 1.05 }}
            className="inline-block bg-white text-black font-['Inter'] font-medium px-8 py-3 rounded-full no-underline"
            style={{ fontSize: "14px" }}
          >
            {isEstonian ? "Broneeri tasuta konsultatsioon" : "Book a free consultation"}
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function Services() {
  const path = window.location.pathname.toLowerCase();
  
  // Map paths to service types
  let service: ServicePageProps["service"] = "seo";
  
  if (path.includes("kodulehe")) service = "development";
  else if (path.includes("muugi")) service = "conversion";
  else if (path.includes("ai")) service = "ai-support";
  else if (path.includes("sotsiaal") || path.includes("sotsia") || path.includes("social")) service = "social-media";

  return <ServicePageContent service={service} />;
}
