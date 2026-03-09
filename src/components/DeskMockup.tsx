import mockupDeskBg from "@/assets/mockup-desk-bg.jpg";
import mockupOverlay from "@/assets/mockup-overlay.png";

interface Props {
  designImage: string;
  designTitle: string;
}

const DeskMockup = ({ designImage, designTitle }: Props) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden neon-box">
      {/* Layer 1: Desk + monitor + room (no keyboard/mouse) */}
      <img
        src={mockupDeskBg}
        alt="Gaming desk"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: Pad design - positioned on the desk surface */}
      <div
        className="absolute"
        style={{
          top: "28%",
          left: "5%",
          width: "90%",
          height: "65%",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover rounded-sm"
          style={{
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Layer 3: Keyboard + Mouse overlay (same perspective as original) */}
      <img
        src={mockupOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.5))",
        }}
      />
    </div>
  );
};

export default DeskMockup;
