import { Link } from "react-router-dom";
import { appRoutes } from "@constants/routes";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-6">
      <div className="max-w-md rounded-[32px] border border-[var(--border)] bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--text)]">
          This page drifted away.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Let&apos;s bring you back to the main experience.
        </p>
        <Link
          to={appRoutes.home}
          className="mt-6 inline-flex rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
        >
          Back to Landing Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
