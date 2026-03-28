import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-20">
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="text-center md:text-right">
        <span className="text-primary font-black text-xl neon-text">PADZONE</span>
        <p className="text-muted-foreground text-sm mt-1">משטחי עכבר פרימיום לגיימרים</p>
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm">
          הסיפור שלנו
        </Link>
        <a
          href="https://wa.me/972552589255"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors font-semibold text-sm"
        >
          צור קשר
        </a>
        <a
          href="https://www.tiktok.com/@padzone.il"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors"
          aria-label="TikTok"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z"/>
          </svg>
        </a>
      </div>

      <p className="text-muted-foreground text-xs">
        © {new Date().getFullYear()} PadZone. כל הזכויות שמורות.
      </p>
    </div>
  </footer>
);

export default Footer;
