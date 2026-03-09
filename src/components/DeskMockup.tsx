import mockupDeskBg from "@/assets/mockup-desk-bg.jpg";
import mockupOverlay from "@/assets/mockup-overlay.png";

interface Props {
  designImage: string;
  designTitle: string;
}

const DeskMockup = ({ designImage, designTitle }: Props) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden neon-box">
      {/* Layer 1: Desk background */}
      <img
        src={mockupDeskBg}
        alt="Gaming desk"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Layer 2: Pad design */}
      <div
        className="absolute"
        style={{
          top: "8%",
          left: "8%",
          width: "84%",
          height: "84%",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover rounded-md"
          style={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* Layer 3: Keyboard + Mouse overlay */}
      <img
        src={mockupOverlay}
        alt=""
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        style={{
          mixBlendMode: "normal",
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
        }}
      />
    </div>
  );
};

export default DeskMockup;
