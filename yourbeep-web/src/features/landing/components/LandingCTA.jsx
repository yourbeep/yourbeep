import { useNavigate } from "react-router-dom";
import { appRoutes } from "@constants/routes";
import { useAppSelector } from "@store";

const LandingCTA = () => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);

  return (
    <div
      className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[24px] p-6 sm:min-h-[320px] sm:p-8"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #f5d060 0%, #f5a623 28%, #e8584a 60%, #c0392b 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full opacity-55"
        style={{
          background:
            "radial-gradient(circle, #7ec87e 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold leading-[1.15] text-white drop-shadow-sm sm:text-[30px]">
          Begin Your Journey
          <br />
          with YourBeep
        </h2>
        <p className="mt-2 text-sm text-white/80">
          Discover Courses, Play Games, and Grow Your Skills
        </p>
        <button
          type="button"
          onClick={() =>
            navigate(isAuthenticated ? appRoutes.dashboard : `${appRoutes.auth}?tab=signin`)
          }
          className="mt-6 rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333]"
        >
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default LandingCTA;
