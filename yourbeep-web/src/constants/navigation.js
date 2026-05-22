import { appRoutes } from "./routes";

export const landingNavItems = [
  { id: "top", label: "Home", href: "#top" },
  {
    id: "about",
    label: "About us",
    href: "#about",
    children: [
      { id: "about-who", label: "Who we are?", href: "#about" },
      { id: "why-us", label: "Why us?", href: "#why-us" },
      { id: "philosophy", label: "Our Philosophy", href: "#philosophy" },
      { id: "founder", label: "About the Founder", href: "#founder" },
    ],
  },
  { id: "courses", label: "Courses", href: "#courses" },
  {
    id: "journey",
    label: "Your Journey",
    href: "#journey",
    children: [
      { id: "experience", label: "Interactive Experience", href: "#experience" },
      { id: "stories", label: "Stories", href: "#stories" },
      { id: "faq", label: "FAQs", href: "#faq" },
    ],
  },
];

const routeMeta = {
  "/": {
    title: "YourBeep",
    subtitle:
      "Decode your emotional patterns, body signals, and daily responses with calm precision.",
  },
};

export const getRouteMeta = (pathname) => routeMeta[pathname] ?? routeMeta["/"];
