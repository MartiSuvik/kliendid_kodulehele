import { Helmet } from "react-helmet-async";
import { seoLinks } from "./components/seo";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { cld, cldSrcSet } from "../lib/cloudinary";
import * as m from "../paraglide/messages.js";

const caseStudies = [
  {
    titleKey: "case_1_title" as const,
    descKey: "case_1_desc" as const,
    image: "/1.svg",
    stat: "3,3x",
    statLabel: "SEO liiklus",
  },
  {
    titleKey: "case_2_title" as const,
    descKey: "case_2_desc" as const,
    image: "/2.svg",
    stat: "10x",
    statLabel: "orgaaniline liiklus",
  },
  {
    titleKey: "case_3_title" as const,
    descKey: "case_3_desc" as const,
    image: "/3.svg",
    stat: "75 700+",
    statLabel: "näitamist",
  },
];

const projects = [
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637659/2_tqjp2t.png",
    titleKey: "portfolio_project_1_title" as const,
    clientKey: "portfolio_project_1_client" as const,
    problemKey: "portfolio_project_1_problem" as const,
    solutionKey: "portfolio_project_1_solution" as const,
    resultKey: "portfolio_project_1_result" as const,
    website: "https://dnddesigncenter.com",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637660/3_bmmfwx.png",
    titleKey: "portfolio_project_2_title" as const,
    descKey: "portfolio_project_2_desc" as const,
    clientKey: "portfolio_project_2_client" as const,
    problemKey: "portfolio_project_2_problem" as const,
    solutionKey: "portfolio_project_2_solution" as const,
    resultKey: "portfolio_project_2_result" as const,
    website: "https://kodumaakv.ee",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637658/4_sa2obz.png",
    titleKey: "portfolio_project_3_title" as const,
    descKey: "portfolio_project_3_desc" as const,
    clientKey: "portfolio_project_3_client" as const,
    problemKey: "portfolio_project_3_problem" as const,
    solutionKey: "portfolio_project_3_solution" as const,
    resultKey: "portfolio_project_3_result" as const,
    website: "https://serenakasitoo.ee",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637659/5_ycta6w.png",
    titleKey: "portfolio_project_4_title" as const,
    descKey: "portfolio_project_4_desc" as const,
    clientKey: "portfolio_project_4_client" as const,
    problemKey: "portfolio_project_4_problem" as const,
    solutionKey: "portfolio_project_4_solution" as const,
    resultKey: "portfolio_project_4_result" as const,
    website: "https://kundalinikakao.ee",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637663/9_jfurqt.png",
    titleKey: "portfolio_project_5_title" as const,
    descKey: "portfolio_project_5_desc" as const,
    clientKey: "portfolio_project_5_client" as const,
    problemKey: "portfolio_project_5_problem" as const,
    solutionKey: "portfolio_project_5_solution" as const,
    resultKey: "portfolio_project_5_result" as const,
    website: "https://houseofom.com",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637661/10_rw0tn2.png",
    titleKey: "portfolio_project_6_title" as const,
    descKey: "portfolio_project_6_desc" as const,
    clientKey: "portfolio_project_6_client" as const,
    problemKey: "portfolio_project_6_problem" as const,
    solutionKey: "portfolio_project_6_solution" as const,
    resultKey: "portfolio_project_6_result" as const,
    website: "https://effidigi.com",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1770637658/1_gix7z8.png",
    titleKey: "portfolio_project_7_title" as const,
    descKey: "portfolio_project_7_desc" as const,
    clientKey: "portfolio_project_7_client" as const,
    problemKey: "portfolio_project_7_problem" as const,
    solutionKey: "portfolio_project_7_solution" as const,
    resultKey: "portfolio_project_7_result" as const,
    website: "https://biolife.ee/et/",
  },
  {
    image: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1775298481/Website_Designs_wxq30c.png",
    titleKey: "portfolio_project_8_title" as const,
    descKey: "portfolio_project_8_desc" as const,
    clientKey: "portfolio_project_8_client" as const,
    problemKey: "portfolio_project_8_problem" as const,
    solutionKey: "portfolio_project_8_solution" as const,
    resultKey: "portfolio_project_8_result" as const,
    website: "https://vamakaliashram.com",
  },
];

export default function Portfolio() {
  const isEnglish = document.documentElement.lang === "en";
  const canonical = isEnglish ? "https://kliendidkodulehele.ee/en/portfolio" : "https://kliendidkodulehele.ee/portfolio";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Helmet>
        <title>{m.portfolio_title()}</title>
        <meta name="description" content={m.portfolio_description()} />
        {...seoLinks("/portfolio", document.documentElement.lang === "en")}
        <meta property="og:title" content={m.portfolio_title()} />
        <meta property="og:description" content={m.portfolio_description()} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={m.portfolio_title()} />
        <meta name="twitter:description" content={m.portfolio_description()} />

      </Helmet>
      <Navigation />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page heading */}
          <div className="text-center mb-16">
            {/* Keyword H1; the display heading below keeps the visual weight. */}
            <h1
              className="font-['Poppins'] font-semibold uppercase text-[#1977f2] mb-3"
              style={{ fontSize: "12px", letterSpacing: "0.14em" }}
            >
              {m.portfolio_h1()}
            </h1>
            <p
              className="font-['Cormorant_Garamond'] font-bold text-gray-900 leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
            >
              {m.portfolio_heading()}
            </p>
            <p
              className="mt-4 font-['Poppins'] text-gray-500 max-w-2xl mx-auto"
              style={{ fontSize: "clamp(0.95rem, 2vw, 1.125rem)" }}
            >
              {m.portfolio_subheading()}
            </p>
          </div>

          {/* Case studies */}
          <div className="mb-20">
            <div className="flex flex-col gap-8">
              {caseStudies.map((cs, index) => {
                const isImageLeft = index % 2 === 0;
                const title = (m as any)[cs.titleKey]();
                const desc = (m as any)[cs.descKey]();

                return (
                  <div
                    key={index}
                    className={`flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10 items-center bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200 ${
                      !isImageLeft ? "md:[direction:rtl]" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className={`w-full overflow-hidden rounded-xl border border-gray-200 ${!isImageLeft ? "md:[direction:ltr]" : ""}`}>
                      <img
                        src={cs.image}
                        alt={title}
                        className="w-full h-auto rounded-xl border border-gray-200"
                        loading="lazy"
                      />
                    </div>

                    {/* Text */}
                    <div className={`flex flex-col justify-center ${!isImageLeft ? "md:[direction:ltr]" : ""}`}>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span
                          className="font-['Cormorant_Garamond'] font-bold text-[#1977f2]"
                          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                        >
                          {cs.stat}
                        </span>
                        <span
                          className="font-['Poppins'] text-gray-400 uppercase tracking-wider"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {cs.statLabel}
                        </span>
                      </div>
                      <h3
                        className="font-['Cormorant_Garamond'] font-bold text-gray-900 leading-tight"
                        style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
                      >
                        {title}
                      </h3>
                      <p
                        className="mt-2 font-['Poppins'] text-gray-500 leading-relaxed"
                        style={{ fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)" }}
                      >
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Projects grid */}
          <div className="flex flex-col gap-12 md:gap-16">
            {projects.map((project, index) => {
              const isImageLeft = index % 2 === 0;
              const title = (m as any)[project.titleKey]();
              const client = (m as any)[project.clientKey]();
              const problem = (m as any)[project.problemKey]();
              const solution = (m as any)[project.solutionKey]();
              const result = (m as any)[project.resultKey]();

              return (
                <div
                  key={index}
                  className={`flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-10 items-center ${
                    !isImageLeft ? "md:[direction:rtl]" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`w-full overflow-hidden rounded-2xl ${!isImageLeft ? "md:[direction:ltr]" : ""}`}>
                    {project.image ? (
                      <img
                        src={cld(project.image, { w: 1000 })}
                        srcSet={cldSrcSet(project.image, [480, 768, 1000])}
                        sizes="(min-width: 768px) 45vw, 90vw"
                        alt={title}
                        className="w-full h-auto object-cover rounded-2xl"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
                        <span className="font-['Poppins'] text-gray-400 text-sm">Image placeholder</span>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className={`flex flex-col justify-center ${!isImageLeft ? "md:[direction:ltr]" : ""}`}>
                    <h2
                      className="font-['Cormorant_Garamond'] font-bold text-gray-900 leading-tight"
                      style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                    >
                      {title}
                    </h2>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-[#eee] rounded-xl p-4">
                        <span className="font-['Poppins'] font-semibold text-gray-900 text-xs uppercase tracking-wider">Client</span>
                        <p className="mt-1 font-['Poppins'] text-gray-500 text-sm">{client}</p>
                      </div>
                      <div className="bg-[#eee] rounded-xl p-4">
                        <span className="font-['Poppins'] font-semibold text-gray-900 text-xs uppercase tracking-wider">Problem</span>
                        <p className="mt-1 font-['Poppins'] text-gray-500 text-sm">{problem}</p>
                      </div>
                      <div className="bg-[#eee] rounded-xl p-4">
                        <span className="font-['Poppins'] font-semibold text-gray-900 text-xs uppercase tracking-wider">Solution</span>
                        <p className="mt-1 font-['Poppins'] text-gray-500 text-sm">{solution}</p>
                      </div>
                      <div className="bg-[#eee] rounded-xl p-4">
                        <span className="font-['Poppins'] font-semibold text-gray-900 text-xs uppercase tracking-wider">Result</span>
                        <p className="mt-1 font-['Poppins'] text-gray-500 text-sm">{result}</p>
                      </div>
                    </div>

                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 font-['Poppins'] font-medium text-[#1977f2] hover:text-[#1259b5] transition-colors text-sm"
                      >
                        {project.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
