import { useEffect, type ReactNode } from "react";
import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./features/auth/pages/LoginPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import DashboardPage from "./features/dashboard/pages/DashboardPage";
import UsersPage from "./features/users/pages/UsersPage";
import UserDetailPage from "./features/users/pages/UserDetailPage";
import CoursesPage from "./features/courses/pages/CoursesPage";
import CreateCoursePage from "./features/courses/pages/CreateCoursePage";
import GamesPage from "./features/games/pages/GamesPage";
import OffersPage from "./features/offers/pages/OffersPage";
import PromotionEditorPage from "./features/offers/pages/PromotionEditorPage";
import OrdersPage from "./features/orders/pages/OrdersPage";
import OrderDetailPage from "./features/orders/pages/OrderDetailPage";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import NotificationCampaignDetailPage from "./features/notifications/pages/NotificationCampaignDetailPage";
import NotificationCampaignEditorPage from "./features/notifications/pages/NotificationCampaignEditorPage";
import SupportPage from "./features/support/pages/SupportPage";
import TicketDetailPage from "./features/support/pages/TicketDetailPage";
import ReviewsPage from "./features/reviews/pages/ReviewsPage";
import TestimonialEditorPage from "./features/reviews/pages/TestimonialEditorPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ProfilePage from "./features/profile/pages/ProfilePage";
import NotFoundPage from "./features/shared/pages/NotFoundPage";
import { useAppDispatch, useAppSelector } from "./store";
import { loadUser } from "./store/slices/auth";

function SessionLoader({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--sidebar-bg)]">
      <div className="rounded-2xl border border-[#d7e8d2] bg-white px-5 py-4 text-sm font-medium text-gray-600 shadow-sm">
        {message}
      </div>
    </div>
  );
}

function LoginRoute({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { initialized, loading, token, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!initialized && token && !user) {
      dispatch(loadUser());
    }
  }, [dispatch, initialized, token, user]);

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  if (token && !initialized && loading) {
    return <SessionLoader message="Restoring your admin session..." />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { initialized, loading, token, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!initialized && token) {
      dispatch(loadUser());
    }
  }, [dispatch, initialized, token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!initialized || loading) {
    return <SessionLoader message="Restoring your admin session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRoute>
              <LoginPage />
            </LoginRoute>
          }
        />
        <Route
          path="/auth/action"
          element={
            <LoginRoute>
              <ResetPasswordPage />
            </LoginRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/create" element={<CreateCoursePage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="coupons" element={<OffersPage />} />
          <Route path="coupons/create" element={<PromotionEditorPage />} />
          <Route path="coupons/:promotionId/edit" element={<PromotionEditorPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:purchaseId" element={<OrderDetailPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="notifications/create"
            element={<NotificationCampaignEditorPage />}
          />
          <Route
            path="notifications/:campaignId/edit"
            element={<NotificationCampaignEditorPage />}
          />
          <Route
            path="notifications/campaigns/:campaignId"
            element={<NotificationCampaignDetailPage />}
          />
          <Route path="support" element={<SupportPage />} />
          <Route
            path="support/tickets/:ticketId"
            element={<TicketDetailPage />}
          />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reviews/create" element={<TestimonialEditorPage />} />
          <Route
            path="reviews/:testimonialId/edit"
            element={<TestimonialEditorPage />}
          />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        expand={false}
        toastOptions={{
          className: "!rounded-2xl !border !border-[#d7e8d2] !shadow-xl",
        }}
      />
    </BrowserRouter>
  );
}
