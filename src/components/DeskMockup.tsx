import mockupDeskBg from "@/assets/mockup-desk-bg.jpg";
import mockupOverlay from "@/assets/mockup-overlay.png";

interface Props {
  designImage: string;
  designTitle: string;
}

const DeskMockup = ({ designImage, designTitle }: Props) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden neon-box">
      {/* Layer 1: Desk + monitor + room */}
      <img
        src={mockupDeskBg}
        alt="Gaming desk"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: Pad design - on the dark mousepad area */}
      <div
        className="absolute"
        style={{
          top: "38%",
          left: "18%",
          width: "64%",
          height: "48%",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover"
          style={{
            borderRadius: "4px",
          }}
        />
      </div>

      {/* Layer 3: Keyboard + Mouse + Headphones */}
      <img
        src={mockupOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
        }}
      />
    </div>
  );
};

export default DeskMockup;
