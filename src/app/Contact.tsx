import { useState } from "react";
import confetti from "canvas-confetti";
import { Check } from "lucide-react";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { getPlanBySlug, type PlanSlug } from "./data/plans";
import { trackLead } from "../lib/analytics";
import * as m from "../paraglide/messages.js";
import { localizeHref } from "./components/hooks/useLocale";

interface ContactProps {
  packageSlug?: string;
}

const CONTACT_WEBHOOK_URL = "https://hook.eu1.make.com/vau19fpxdf9oh3wogukdub9arbvg3mgq";

export default function Contact({ packageSlug }: ContactProps) {
  const plan = getPlanBySlug(packageSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fireConfetti = () => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        window.clearInterval(interval);
        return;
      }

      const particleCount = Math.max(8, Math.floor(40 * (timeLeft / duration)));

      confetti({
        particleCount,
        startVelocity: 28,
        spread: 65,
        origin: { x: 0.15, y: 0.7 },
      });

      confetti({
        particleCount,
        startVelocity: 28,
        spread: 65,
        origin: { x: 0.85, y: 0.7 },
      });
    }, 220);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      industry: String(formData.get("industry") ?? ""),
      packageSlug: plan.slug,
      packageLabel: plan.label,
      packagePrice: plan.price,
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    try {
      let sent = false;

      try {
        const iframeId = "make-webhook-target";
        let targetFrame = document.getElementById(iframeId) as HTMLIFrameElement | null;

        if (!targetFrame) {
          targetFrame = document.createElement("iframe");
          targetFrame.id = iframeId;
          targetFrame.name = iframeId;
          targetFrame.style.display = "none";
          document.body.appendChild(targetFrame);
        }

        const hiddenForm = document.createElement("form");
        hiddenForm.method = "POST";
        hiddenForm.action = CONTACT_WEBHOOK_URL;
        hiddenForm.target = iframeId;
        hiddenForm.style.display = "none";

        Object.entries(payload).forEach(([key, value]) => {
          const hiddenInput = document.createElement("input");
          hiddenInput.type = "hidden";
          hiddenInput.name = key;
          hiddenInput.value = String(value);
          hiddenForm.appendChild(hiddenInput);
        });

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();
        hiddenForm.remove();

        sent = true;
      } catch {
        sent = false;
      }

      if (!sent) {
        throw new Error("Webhook request failed");
      }

      event.currentTarget.reset();
      setIsSubmitted(true);
      trackLead("contact_form", { packageSlug: plan.slug });
      fireConfetti();
    } catch {
      setSubmitError(m.contact_error());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f0eb] text-black">
      <Navigation />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-14">
          <section className="max-w-[760px]">
            <h1 className="font-['Poppins'] font-semibold text-black mb-4" style={{ fontSize: "42px", lineHeight: "1.1" }}>
              {m.contact_heading()}
            </h1>
            <p className="font-['Poppins'] text-black mb-8" style={{ fontSize: "18px", lineHeight: "1.5" }}>
              {m.contact_subheading_1()}
              <br />
              {m.contact_subheading_2()}
            </p>

            {!isSubmitted ? (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="font-['Poppins'] text-[#6b6b6b]" style={{ fontSize: "18px" }}>
                {m.contact_label_name()}
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder={m.contact_placeholder_name()}
                className="w-full rounded-xl border border-[#d8d8d8] bg-[#efefef] px-5 py-3 font-['Poppins'] text-black outline-none"
                style={{ fontSize: "18px" }}
              />

              <label className="font-['Poppins'] text-[#6b6b6b] mt-2" style={{ fontSize: "18px" }}>
                {m.contact_label_phone()}
              </label>
              <input
                name="phone"
                type="tel"
                required
                className="w-full rounded-xl border border-[#d8d8d8] bg-[#efefef] px-5 py-3 font-['Poppins'] text-black outline-none"
                style={{ fontSize: "18px" }}
              />

              <label className="font-['Poppins'] text-[#6b6b6b] mt-2" style={{ fontSize: "18px" }}>
                {m.contact_label_email()}
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder={m.contact_placeholder_email()}
                className="w-full rounded-xl border border-[#d8d8d8] bg-[#efefef] px-5 py-3 font-['Poppins'] text-black outline-none"
                style={{ fontSize: "18px" }}
              />

              <label className="font-['Poppins'] text-[#6b6b6b] mt-2" style={{ fontSize: "18px" }}>
                {m.contact_label_industry()}
              </label>
              <input
                name="industry"
                type="text"
                placeholder={m.contact_placeholder_industry()}
                required
                className="w-full rounded-xl border border-[#d8d8d8] bg-[#efefef] px-5 py-3 font-['Poppins'] text-black outline-none"
                style={{ fontSize: "18px" }}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 bg-[#2d2d2d] text-white rounded-xl px-6 py-3 font-['Poppins'] font-medium hover:bg-[#1f1f1f] transition-colors cursor-pointer"
                style={{ fontSize: "22px" }}
              >
                {isSubmitting ? m.contact_submitting() : m.contact_submit()}
              </button>
              {submitError && (
                <p className="font-['Poppins'] text-[#505050] mt-1" style={{ fontSize: "14px" }}>
                  {submitError}
                </p>
              )}
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="font-['Poppins'] font-semibold text-black mb-3" style={{ fontSize: "32px", lineHeight: "1.2" }}>
                  {m.contact_success_heading()}
                </h2>
                <p className="font-['Poppins'] text-[#505050]" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                  {m.contact_success_body()}
                </p>
              </div>
            )}
          </section>

          <aside>
            <a href={localizeHref("/#hinnad")} className="inline-flex items-center gap-2 font-['Poppins'] text-black no-underline mb-4" style={{ fontSize: "20px" }}>
              ← {m.contact_change_plan()}
            </a>

            <div
              className={`rounded-2xl p-7 ${
                plan.featured ? "bg-[#1977f2] text-white border-2 border-[#1977f2]" : "bg-white border border-gray-200"
              }`}
            >
              <div className="inline-flex mb-4">
                <span
                  className={`font-['Poppins'] font-medium px-4 py-1.5 rounded-lg ${
                    plan.featured ? "bg-white/20 text-white" : "bg-[#f0f0f0] text-black"
                  }`}
                  style={{ fontSize: "14px" }}
                >
                  {plan.label}
                </span>
              </div>

              <h2 className={`font-['Poppins'] font-semibold mb-1 ${plan.featured ? "text-white" : "text-black"}`} style={{ fontSize: "20px" }}>
                {plan.price}
              </h2>
              <p className={`font-['Poppins'] mb-4 ${plan.featured ? "text-white/80" : "text-black"}`} style={{ fontSize: "12px", lineHeight: "1.4" }}>
                {plan.commitment}
              </p>

              <p className={`font-['Poppins'] mb-4 ${plan.featured ? "text-white/90" : "text-black"}`} style={{ fontSize: "16px", lineHeight: "1.5" }}>
                {plan.description}
              </p>

              {plan.highlight && (
                <div
                  className={`rounded-md px-4 py-2 mb-4 text-center ${
                    plan.featured ? "bg-white/15 text-white" : "bg-[#eee] text-[#78501f]"
                  }`}
                >
                  <span className="font-['Poppins']" style={{ fontSize: "13px" }}>
                    {plan.highlight}
                  </span>
                </div>
              )}

              {plan.guaranteeNote && (
                <div className="rounded-md px-4 py-2 mb-4 text-center bg-[#eee] text-[#78501f]">
                  <span className="font-['Poppins'] font-semibold" style={{ fontSize: "13px" }}>
                    {plan.guaranteeNote}
                  </span>
                </div>
              )}

              <ul className="flex flex-col gap-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className={`shrink-0 mt-1 ${plan.featured ? "text-white/80" : "text-[#505050]"}`} />
                    <span
                      className={`font-['Poppins'] ${plan.featured ? "text-white/90" : "text-[#505050]"}`}
                      style={{ fontSize: "15px", lineHeight: "1.7" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const allowedContactSlugs: PlanSlug[] = ["minimum", "standard", "best"];
