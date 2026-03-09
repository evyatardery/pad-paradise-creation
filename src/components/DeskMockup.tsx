import gamingDeskBg from "@/assets/gaming-desk-bg.jpg";

interface Props {
  designImage: string;
  designTitle: string;
}

const DeskMockup = ({ designImage, designTitle }: Props) => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden neon-box">
      {/* Desk background */}
      <img
        src={gamingDeskBg}
        alt="Gaming desk"
        className="w-full h-full object-cover"
      />
      {/* Pad overlay - positioned on the mousepad area */}
      <div
        className="absolute"
        style={{
          top: "32%",
          left: "18%",
          width: "62%",
          height: "56%",
          perspective: "800px",
        }}
      >
        <img
          src={designImage}
          alt={designTitle}
          className="w-full h-full object-cover rounded-sm"
          style={{
            transform: "rotateX(2deg) rotateY(-1deg)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            opacity: 0.92,
          }}
        />
      </div>
    </div>
  );
};

export default DeskMockup;
