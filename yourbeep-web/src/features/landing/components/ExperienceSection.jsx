import SectionHeader from "@components/common/SectionHeader";
import phoneImage from "./../../../assets/experience-phone.png";

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="bg-white px-4 py-16 text-center md:px-6"
    >
      <div className="mx-auto max-w-[1320px]">
        <SectionHeader
          eyebrow="Flexible Learning"
          title="A Seamless Sanctuary on Any Device"
          description="YourBeep is designed to move with you. Whether you're finding stillness at your desk, reflecting on your tablet in the garden, or seeking a moment of peace via mobile during your commute."
          align="center"
        />

        <div className="mt-10 flex justify-center">
          <img
            src={phoneImage}
            alt="YourBeep app on mobile device"
            className="w-full max-w-[480px] object-contain drop-shadow-none"
          />
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
