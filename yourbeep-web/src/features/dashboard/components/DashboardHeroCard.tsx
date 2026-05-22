import { motion } from "framer-motion";
import MainButton from "@components/ui/MainButton";
import StatusPill from "@components/ui/StatusPill";

// Add to your global CSS or index.html:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">

type DashboardHeroCardProps = {
  name: string;
  greeting: string;
  subtitle: string;
  onRefresh?: () => void;
  refreshing?: boolean;
};

const DashboardHeroCard = ({
  name,
  greeting,
  subtitle,
  onRefresh,
  refreshing = false,
}: DashboardHeroCardProps) => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

        .hero-card {
          position: relative;
          overflow: hidden;
          background: #ffffff;
          border-radius: 28px;
          min-height: 320px;
        }

        /* Organic grass/hill blob in bottom-right, mimicking the reference */
        .hero-card::after {
          content: '';
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 420px;
          height: 340px;
          background: radial-gradient(ellipse at 60% 70%, #5db870 0%, #3a9a50 40%, #256b38 100%);
          border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%;
          z-index: 0;
          opacity: 0.92;
        }

        /* Secondary organic blob */
        .hero-card::before {
          content: '';
          position: absolute;
          bottom: -100px;
          right: 100px;
          width: 280px;
          height: 220px;
          background: radial-gradient(ellipse at 50% 80%, #7ed08a 0%, #4db862 60%, #2e8040 100%);
          border-radius: 70% 30% 60% 40% / 40% 70% 30% 60%;
          z-index: 0;
          opacity: 0.7;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          padding: 48px 52px;
          flex: 1;
        }

        .hero-pill-wrap {
          margin-bottom: 20px;
        }

        .hero-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #1a3a2a;
          margin: 0 0 4px 0;
        }

        .hero-heading-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: #2e8a50;
          margin: 0 0 24px 0;
          font-style: italic;
        }

        .hero-subtitle {
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.75;
          color: #4a6a56;
          max-width: 420px;
          margin: 0 0 32px 0;
        }

        /* Sprout icon in the blob area */
        .hero-sprout {
          position: absolute;
          bottom: 60px;
          right: 80px;
          z-index: 2;
          pointer-events: none;
        }

        .hero-sprout svg {
          width: 64px;
          height: 80px;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .hero-content {
            padding: 36px 28px;
          }
          .hero-heading, .hero-heading-name {
            font-size: 40px !important;
          }
          .hero-card::after {
            width: 260px;
            height: 200px;
            right: -40px;
            bottom: -40px;
          }
          .hero-card::before {
            display: none;
          }
          .hero-sprout {
            right: 30px;
            bottom: 40px;
          }
          .hero-sprout svg {
            width: 44px;
            height: 56px;
          }
        }
      `}</style>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="hero-card mb-10 flex items-center"
      >
        {/* Main content */}
        <div className="hero-content">
          <div className="hero-pill-wrap">
            <StatusPill tone="primary">Your Sanctuary Awaits</StatusPill>
          </div>

          <h1
            className="hero-heading"
            style={{ fontSize: "clamp(38px, 5vw, 58px)" }}
          >
            {greeting},
          </h1>
          <h2
            className="hero-heading-name"
            style={{ fontSize: "clamp(38px, 5vw, 58px)" }}
          >
            {name}.
          </h2>

          <p className="hero-subtitle">
            {subtitle || "The quiet moments hold the most profound lessons."}
            <br />
            Take a deep breath and begin today's journey.
          </p>

          <MainButton
            text={refreshing ? "Refreshing..." : "Refresh dashboard"}
            isLoading={refreshing}
            onClick={onRefresh}
          />
        </div>

        {/* Decorative sprout SVG over the green blob */}
        <div className="hero-sprout">
          <svg
            viewBox="0 0 64 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stem */}
            <path
              d="M32 78 C32 50 32 30 32 10"
              stroke="#1a5c2a"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left leaf */}
            <path
              d="M32 38 C20 30 8 32 10 20 C22 18 34 28 32 38Z"
              fill="#2e8a50"
              opacity="0.9"
            />
            {/* Right leaf */}
            <path
              d="M32 28 C44 18 58 20 56 10 C44 8 30 18 32 28Z"
              fill="#3aaa60"
              opacity="0.85"
            />
            {/* Top bud */}
            <ellipse
              cx="32"
              cy="10"
              rx="5"
              ry="7"
              fill="#4ec870"
              opacity="0.9"
            />
            <ellipse cx="32" cy="8" rx="3" ry="4" fill="#6ddb88" />
          </svg>
        </div>
      </motion.section>
    </>
  );
};

export default DashboardHeroCard;
