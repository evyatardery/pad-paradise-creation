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
      </div>

      <p className="text-muted-foreground text-xs">
        © {new Date().getFullYear()} PadZone. כל הזכויות שמורות.
      </p>
    </div>
  </footer>
);

export default Footer;
