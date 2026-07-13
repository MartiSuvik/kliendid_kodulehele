import { useEffect } from "react";

/**
 * EmbedSocial Google-reviews widget. The feed is rendered by EmbedSocial's CDN
 * script inside a cross-origin iframe, so its UI language ("View Post",
 * "Read more", time-ago, the heading and "Leave a review" button) cannot be
 * changed from our code — it is configured per widget in the EmbedSocial
 * dashboard (Widget tab -> Localisation, plus custom heading/button text).
 *
 * To show a different language on a specific page, create a separate widget in
 * EmbedSocial with that localisation and pass its id via `dataRef`.
 */

const DEFAULT_REF = "5e23c8fa32594effcd7d962e62d5bae91ed7ba83";

type GoogleReviewsProps = {
  dataRef?: string;
};

export function GoogleReviews({ dataRef = DEFAULT_REF }: GoogleReviewsProps) {
  useEffect(() => {
    if (!document.getElementById("EmbedSocialHashtagScript")) {
      const js = document.createElement("script");
      js.id = "EmbedSocialHashtagScript";
      js.src = "https://embedsocial.com/cdn/ht.js";
      document.getElementsByTagName("head")[0].appendChild(js);
    }
  }, []);

  return (
    <section className="bg-white py-8 lg:py-12 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
        <div
          className="embedsocial-hashtag"
          data-ref={dataRef}
          data-dynamicload="yes"
          data-lazyload="yes"
        >
          <a
            className="feed-powered-by-es feed-powered-by-es-feed-img es-widget-branding"
            href="https://embedsocial.com/google-reviews-widget/"
            target="_blank"
            rel="noreferrer"
            title="Embed Google reviews"
          >
            <img src="https://embedsocial.com/cdn/icon/embedsocial-logo.webp" alt="EmbedSocial" />
            <div className="es-widget-branding-text">Embed Google reviews</div>
          </a>
        </div>
      </div>
    </section>
  );
}
