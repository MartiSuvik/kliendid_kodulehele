/**
 * Cloudinary delivery helpers.
 *
 * Raw asset URLs in the app are stored with only a version + filename and no
 * transforms, e.g.
 *   https://res.cloudinary.com/dl4bzhitw/image/upload/v123/logo.png
 * These helpers inject `f_auto,q_auto[,w_<n>]` (plus an optional leading
 * transform such as `e_trim`) so Cloudinary serves a resized WebP/AVIF variant
 * instead of the full-size PNG. Auto-format alone typically saves 60–80% on the
 * partner-logo strip.
 */

const UPLOAD_MARKER = "/image/upload/";
const CLOUDINARY_UPLOAD = "https://res.cloudinary.com/dl4bzhitw" + UPLOAD_MARKER;

export interface CldOpts {
  /** Cap the delivered width in px (aim for ~2× the rendered display size). */
  w?: number;
  /** Leading transform component applied before f_auto/q_auto (e.g. "e_trim"). */
  prefix?: string;
}

/**
 * Return a Cloudinary URL with auto-format/quality (and an optional width) baked
 * into the transformation segment. Accepts either a full res.cloudinary.com URL
 * (with only version + filename, no existing transforms) or a bare
 * "v123/filename.png" path.
 */
export function cld(src: string, opts: CldOpts = {}): string {
  const auto = ["f_auto", "q_auto", opts.w ? `w_${opts.w}` : null]
    .filter(Boolean)
    .join(",");
  // Keep the prefix (e.g. e_trim) as its own chained component so ordering
  // matches the original hand-written URLs.
  const chain = opts.prefix ? `${opts.prefix}/${auto}` : auto;

  const i = src.indexOf(UPLOAD_MARKER);
  if (i !== -1) {
    const head = src.slice(0, i + UPLOAD_MARKER.length);
    const tail = src.slice(i + UPLOAD_MARKER.length).replace(/^\/+/, "");
    return `${head}${chain}/${tail}`;
  }
  return `${CLOUDINARY_UPLOAD}${chain}/${src.replace(/^\/+/, "")}`;
}

/** Build a responsive `srcset` string across the given widths. */
export function cldSrcSet(src: string, widths: number[], opts: CldOpts = {}): string {
  return widths.map((w) => `${cld(src, { ...opts, w })} ${w}w`).join(", ");
}
