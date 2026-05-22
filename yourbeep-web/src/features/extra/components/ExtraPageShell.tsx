import { motion } from "framer-motion";
import type { ReactNode } from "react";
import MainPageShell from "@features/main/components/MainPageShell";

type ExtraPageShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

const ExtraPageShell = ({ title, subtitle, children }: ExtraPageShellProps) => {
  return (
    <MainPageShell activeItem="Dashboard">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="mx-auto w-full max-w-5xl px-2 pt-2"
      >
        <div className="border-b border-[#e8ece7] pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-[#18343a] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#66797d] sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="pt-8">{children}</div>
      </motion.section>
    </MainPageShell>
  );
};

export default ExtraPageShell;
