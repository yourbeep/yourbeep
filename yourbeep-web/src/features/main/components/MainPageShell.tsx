import type { ReactNode } from "react";
import AppHeader from "../../../components/layout/AppHeader";

type MainPageShellProps = {
  activeItem?: "Dashboard" | "Courses" | "Games";
  children: ReactNode;
};

const MainPageShell = ({
  activeItem = "Dashboard",
  children,
}: MainPageShellProps) => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f2ea" }}>
      <AppHeader activeItem={activeItem} />
      <div className="mx-auto w-full  px-6 py-8">{children}</div>
    </div>
  );
};

export default MainPageShell;
