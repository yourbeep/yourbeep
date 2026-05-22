import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import AuthBrandPanel from "../components/AuthBrandPanel";
import AuthFormCard from "../components/AuthFormCard";
import { useUserAuth } from "../hooks/useUserAuth";

const AuthPage = () => {
  const auth = useUserAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = requestedTab === "register" ? "register" : "signin";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-screen w-full"
    >
      <AuthBrandPanel />
      <AuthFormCard
        initialTab={initialTab}
        onTabChange={(tab) => setSearchParams({ tab })}
        {...auth}
      />
    </motion.div>
  );
};

export default AuthPage;
