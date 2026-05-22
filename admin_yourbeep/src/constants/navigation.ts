import {
  MdConfirmationNumber,
  MdDashboard,
  MdExtension,
  MdHeadset,
  MdNotifications,
  MdPeople,
  MdPerson,
  MdReceipt,
  MdSchool,
  MdSettings,
  MdStar,
} from "react-icons/md";

export const adminNavItems = [
  { id: "dashboard", to: "/", label: "Dashboard", icon: MdDashboard },
  { id: "users", to: "/users", label: "Student Management", icon: MdPeople },
  { id: "courses", to: "/courses", label: "Courses", icon: MdSchool },
  { id: "games", to: "/games", label: "Games Library", icon: MdExtension },
  {
    id: "coupons",
    to: "/coupons",
    label: "Coupons & Offers",
    icon: MdConfirmationNumber,
  },
  {
    id: "orders",
    to: "/orders",
    label: "Orders & Transactions",
    icon: MdReceipt,
  },
  {
    id: "notifications",
    to: "/notifications",
    label: "Notification Center",
    icon: MdNotifications,
  },
  {
    id: "support",
    to: "/support",
    label: "Support & Complaints",
    icon: MdHeadset,
  },
  {
    id: "reviews",
    to: "/reviews",
    label: "Testimonials",
    icon: MdStar,
  },
  {
    id: "settings",
    to: "/settings",
    label: "Platform Settings",
    icon: MdSettings,
  },
];

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Admin Dashboard",
    subtitle:
      "Track platform growth, revenue, user activity, and system health.",
  },
  "/users": {
    title: "Student Management",
    subtitle: "Review learners, enrollment, progress, and account health.",
  },
  "/courses": {
    title: "Courses",
    subtitle:
      "Review course inventory, publishing status, and course-level performance.",
  },
  "/courses/create": {
    title: "Create Course",
    subtitle:
      "Go through the guided module to structure, price, and publish a new course.",
  },
  "/games": {
    title: "Games Library",
    subtitle:
      "Manage the reusable game catalog used by course scoring and interactive cues.",
  },
  "/coupons": {
    title: "Coupons & Offers",
    subtitle:
      "Control promotions, active offers, and conversion-focused discounts.",
  },
  "/orders": {
    title: "Orders & Transactions",
    subtitle: "Track purchases, refunds, payment flow, and revenue operations.",
  },
  "/notifications": {
    title: "Notification Center",
    subtitle:
      "Compose broadcasts, review campaigns, and manage delivery operations.",
  },
  "/notifications/campaigns": {
    title: "Campaign Detail",
    subtitle:
      "Inspect campaign targeting, payload data, and delivery performance.",
  },
  "/support": {
    title: "Support & Complaints",
    subtitle:
      "Handle tickets, account issues, refund requests, and user escalation.",
  },
  "/support/tickets": {
    title: "Ticket Detail",
    subtitle:
      "Review ticket conversation, update status, and respond to the learner.",
  },
  "/reviews": {
    title: "Testimonials",
    subtitle:
      "Moderate reviews, ratings, and social proof across the platform.",
  },
  "/settings": {
    title: "Platform Settings",
    subtitle:
      "Update CMS content, banners, FAQs, legal copy, and platform defaults.",
  },
  "/profile": {
    title: "Admin Profile",
    subtitle:
      "Manage your backend profile fields and review Firebase-managed account details.",
  },
};

export const getRouteMeta = (pathname: string) => {
  const exactMatch = routeTitles[pathname];
  if (exactMatch) {
    return exactMatch;
  }

  const matchedPrefix = Object.keys(routeTitles)
    .filter((routePath) => routePath !== "/" && pathname.startsWith(routePath))
    .sort((a, b) => b.length - a.length)[0];

  return matchedPrefix ? routeTitles[matchedPrefix] : routeTitles["/"];
};
