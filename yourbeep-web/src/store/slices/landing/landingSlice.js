import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  testimonials: [
    {
      id: "story-1",
      name: "Sarah T.",
      role: "Business Executive",
      quote:
        "The platform did not just help me slow down. It helped me finally understand why I react the way I do under pressure.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
      id: "story-2",
      name: "Julian M.",
      role: "Architect, London",
      quote:
        "YourBeep turned vague emotional overload into something observable, measurable, and workable.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
    {
      id: "story-3",
      name: "Maya L.",
      role: "Teacher",
      quote:
        "The exercises gave me language for my internal state and a way back to steadiness without forcing it.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What makes YourBeep different from a normal wellness app?",
      answer:
        "YourBeep is built around awareness mapping, somatic reflection, and structured guided games that connect emotion, body, and action into one learning journey.",
    },
    {
      id: "faq-2",
      question: "Do I need to buy a full course to start?",
      answer:
        "No. The experience can begin with free content and the master course, while deeper guided learning becomes available through paid courses.",
    },
    {
      id: "faq-3",
      question: "Is this only for meditation-focused users?",
      answer:
        "Not at all. It is for anyone who wants more clarity about their behavioral signals, internal patterns, and daily reactions.",
    },
  ],
};

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {},
});

export const landingReducer = landingSlice.reducer;
