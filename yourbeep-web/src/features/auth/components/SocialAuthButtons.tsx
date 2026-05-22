import { FaApple, FaGoogle } from "react-icons/fa";
import type { SocialLoginProvider } from "@store/slices/auth";
import MainButton from "@components/ui/MainButton";

type Props = {
  loading: boolean;
  onSocialSignIn: (provider: SocialLoginProvider) => Promise<{ ok: boolean }>;
};

const SocialAuthButtons = ({ loading, onSocialSignIn }: Props) => {
  return (
    <div className="grid gap-3">
      <MainButton
        type="button"
        onClick={() => void onSocialSignIn("google")}
        disabled={loading}
        variant="outline"
        fullWidth
        size="lg"
        className="rounded-2xl border-[#d9ddd2] bg-white text-[var(--text)]"
        headIcon={<FaGoogle className="text-[16px] text-[#DB4437]" />}
      >
        Google Account
      </MainButton>

      <MainButton
        type="button"
        onClick={() => void onSocialSignIn("apple")}
        disabled={loading}
        fullWidth
        size="lg"
        className="rounded-2xl"
        headIcon={<FaApple className="text-[18px]" />}
      >
        Apple Account
      </MainButton>
    </div>
  );
};

export default SocialAuthButtons;
