import { motion } from "framer-motion";
import ProfileSectionCard from "./ProfileSectionCard";

export default function ProfileSecurityCard() {
  return (
    <ProfileSectionCard
      title="Security & Sign-In"
      subtitle="Admin authentication is handled through Firebase, so email credentials and social login security stay managed there."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4"
        >
          <p className="text-sm font-semibold text-[#203321]">
            Password and social login
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5d6d57]">
            This admin frontend does not update passwords directly through the
            backend. Use Firebase-managed sign-in methods for email/password,
            Google, and Apple access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="rounded-2xl border border-[#edf0e7] bg-[#fbfcf8] p-4"
        >
          <p className="text-sm font-semibold text-[#203321]">
            What you can edit here
          </p>
          <p className="mt-2 text-sm leading-6 text-[#5d6d57]">
            Name, avatar, timezone, and phone country code are synced with the
            backend profile and are safe to update from this page.
          </p>
        </motion.div>
      </div>
    </ProfileSectionCard>
  );
}
