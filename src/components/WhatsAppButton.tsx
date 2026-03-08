import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/972552589255"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-[hsl(142_70%_49%)] text-primary-foreground px-5 py-3 rounded-full font-bold shadow-lg hover:scale-110 transition-transform animate-pulse-glow"
  >
    <MessageCircle className="w-5 h-5" />
    הזמן בוואטסאפ
  </a>
);

export default WhatsAppButton;
