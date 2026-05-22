import {
  awarenessActivationOptions,
  awarenessDomainOptions,
  awarenessExpansionOptions,
  awarenessRootCauseOptions,
} from "../../services/gameConfig";

type StateTone = {
  card: string;
  iconWrap: string;
  icon: string;
};

const stateTones: StateTone[] = [
  { card: "bg-[#f8d8d8]", iconWrap: "bg-[#f0c0c0]", icon: "#c07070" },
  { card: "bg-[#fdf4e8]", iconWrap: "bg-[#f0d8b8]", icon: "#c09060" },
  { card: "bg-[#f8d0c0]", iconWrap: "bg-[#f0b8a0]", icon: "#c06040" },
  { card: "bg-[#f8ece0]", iconWrap: "bg-[#f0dcc8]", icon: "#a07850" },
  { card: "bg-[#e8f0e0]", iconWrap: "bg-[#d0e4c8]", icon: "#6a8a5a" },
  { card: "bg-[#f8d8e0]", iconWrap: "bg-[#f0c0cc]", icon: "#c06070" },
];

const createSparkIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const createAlertIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const createFlameIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22c0 0-8-5-8-12a8 8 0 0 1 16 0c0 7-8 12-8 12z" />
    <circle cx="12" cy="10" r="2" fill={stroke} stroke="none" />
  </svg>
);

const createShieldIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const createSunIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
  </svg>
);

const createRigidIcon = (stroke: string) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const activationIcons = [
  createSparkIcon,
  createAlertIcon,
  createFlameIcon,
  createShieldIcon,
  createSunIcon,
  createRigidIcon,
];

const expansionIcons = [
  createSunIcon,
  createSparkIcon,
  createAlertIcon,
  createShieldIcon,
  createRigidIcon,
  createFlameIcon,
];

export const awarenessActivationCards = awarenessActivationOptions.map((option, index) => {
  const tone = stateTones[index % stateTones.length]!;
  return {
    ...option,
    description:
      index % 2 === 0
        ? "Select this when your inner state feels immediately recognisable and present."
        : "Select this when the nervous system is moving in this direction today.",
    ...tone,
    icon: activationIcons[index % activationIcons.length]!(tone.icon),
  };
});

export const awarenessExpansionCards = awarenessExpansionOptions.map((option, index) => {
  const tone = stateTones[(index + 1) % stateTones.length]!;
  return {
    ...option,
    description:
      index % 2 === 0
        ? "Choose this if your system opens in this way when space is available."
        : "Choose this if this expansion pattern tends to follow your first activation state.",
    ...tone,
    icon: expansionIcons[index % expansionIcons.length]!(tone.icon),
  };
});

const domainIcons = [
  <svg key="work" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>,
  <svg key="relationships" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  <svg key="family" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  <svg key="finances" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  <svg key="personal_development" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
  <svg key="health" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  <svg key="previous_stress" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a6a70" strokeWidth="1.8" strokeLinecap="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>,
];

export const awarenessDomainCards = awarenessDomainOptions.map((option, index) => ({
  ...option,
  icon: domainIcons[index],
  description: [
    "Career, profession, and daily productivity.",
    "Partnerships, intimacy, and deep connections.",
    "Parents, children, and extended kinships.",
    "Economic security and resource management.",
    "Learning, skills, and personal wisdom.",
    "Physical vitality and mental wellbeing.",
    "How your previous stress still shapes the present moment.",
  ][index]!,
}));

export const awarenessRootCauseCards = awarenessRootCauseOptions.map((option, index) => ({
  ...option,
  tone:
    [
      "bg-[#d8e8c8] border-[#c8e0b8]",
      "bg-[#f8f4e8] border-[#f0e8c8]",
      "bg-[#f8d8d0] border-[#f0c8b8]",
      "bg-[#e8e0f8] border-[#d8d0f0]",
    ][index] ?? "bg-[#f3f1ea] border-[#dde2dc]",
  description:
    [
      "A coping strategy the system learned earlier and still reaches for automatically.",
      "An ongoing environmental pressure that keeps the same pattern active.",
      "A protective meaning or belief that tries to keep you safe.",
      "A foundational need that is still asking to be seen or supported.",
    ][index] ?? "",
}));

