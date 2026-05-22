import { useEffect, type ReactElement } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import LandingPage from "@features/landing/pages/LandingPage";
import AuthPage from "@features/auth/pages/AuthPage";
import NotFoundPage from "@pages/NotFoundPage";
import DashboardPage from "@features/dashboard/pages/DashboardPage";
import CoursesPage from "@features/courses/pages/CoursesPage";
import CourseDetailsPage from "@features/courses/pages/CourseDetailsPage";
import CourseGamePage from "@features/games/pages/CourseGamePage";
import SomaticActivityPage from "@features/games/somatic-states/pages/SomaticActivityPage";
import SomaticRegionPage from "@features/games/somatic-states/pages/SomaticRegionPage";
import CourseContentPage from "@features/learning/pages/CourseContentPage";
import VideoDetailsPage from "@features/learning/pages/VideoDetailsPage";
import GamesPage from "@features/main/pages/GamesPage";
import Coursepricing from "@features/payments/pages/Coursepricing";
import ContactPage from "@features/extra/pages/ContactPage";
import TermsPage from "@features/extra/pages/TermsPage";
import PrivacyPage from "@features/extra/pages/PrivacyPage";
import RefundPage from "@features/extra/pages/RefundPage";
import { appRoutes } from "@constants/routes";
import { useAppDispatch, useAppSelector } from "@store/index";
import { loadUser, setAuthInitialized } from "@store/slices/auth";
import { firebaseAuth } from "@features/auth/services/firebaseClient";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { initialized, user, token } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return <div className="p-10 text-center text-sm text-[#666]">Loading session...</div>;
  }

  if (!user || !token) {
    return <Navigate to={appRoutes.auth} replace />;
  }

  return children;
};

const PublicOnlyRoute = ({ children }: { children: ReactElement }) => {
  const { initialized, user, token } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return <div className="p-10 text-center text-sm text-[#666]">Loading session...</div>;
  }

  if (user && token) {
    return <Navigate to={appRoutes.dashboard} replace />;
  }

  return children;
};

const AppRouter = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        void dispatch(loadUser());
        return;
      }

      if (!token) {
        dispatch(setAuthInitialized(true));
      }
    });

    return () => unsubscribe();
  }, [dispatch, token]);

  return (
    <Routes>
      <Route path={appRoutes.home} element={<LandingPage />} />
      <Route
        path={appRoutes.auth}
        element={
          <PublicOnlyRoute>
            <AuthPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={appRoutes.dashboard}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={appRoutes.courses}
        element={
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/learn"
        element={
          <ProtectedRoute>
            <CourseContentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/pricing"
        element={
          <ProtectedRoute>
            <Coursepricing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/videos/:videoId"
        element={
          <ProtectedRoute>
            <VideoDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/games/:gameId"
        element={
          <ProtectedRoute>
            <CourseGamePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/games/:gameId/regions/:region"
        element={
          <ProtectedRoute>
            <SomaticRegionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/courses/:courseId/games/:gameId/activities/:activityKey"
        element={
          <ProtectedRoute>
            <SomaticActivityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={appRoutes.games}
        element={
          <ProtectedRoute>
            <GamesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={appRoutes.contact}
        element={<ContactPage />}
      />
      <Route
        path={appRoutes.terms}
        element={<TermsPage />}
      />
      <Route
        path={appRoutes.privacy}
        element={<PrivacyPage />}
      />
      <Route
        path={appRoutes.refund}
        element={<RefundPage />}
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRouter;
