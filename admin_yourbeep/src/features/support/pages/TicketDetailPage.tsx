import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  fetchAdminTicketDetail,
  fetchSupportSummary,
  replyToAdminTicket,
  updateAdminTicket,
} from "../../../store/slices/support";
import { showToast } from "../../../utils/showToast";
import TicketDetailPanel from "../components/TicketDetailPanel";

const TicketDetailPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const { selectedTicket, loadingTicketDetail, mutating, error } =
    useAppSelector((state) => state.support);

  useEffect(() => {
    if (ticketId) {
      dispatch(fetchAdminTicketDetail(ticketId));
    }
  }, [dispatch, ticketId]);

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Ticket data could not be fully refreshed: {error}
        </div>
      ) : null}

      <TicketDetailPanel
        ticket={selectedTicket}
        loading={loadingTicketDetail}
        mutating={mutating}
        onClose={() => navigate("/support")}
        onReply={(body) =>
          ticketId &&
          dispatch(replyToAdminTicket({ ticketId, body }))
            .unwrap()
            .then(() => {
              dispatch(fetchSupportSummary());
              showToast({
                type: "success",
                message: "Reply sent.",
                options: {
                  description:
                    "The support ticket conversation was updated successfully.",
                },
              });
            })
            .catch((replyError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to send reply.",
                options: {
                  description:
                    typeof replyError === "string"
                      ? replyError
                      : "Please try again.",
                },
              });
            })
        }
        onUpdate={(payload) =>
          ticketId &&
          dispatch(updateAdminTicket({ ticketId, payload }))
            .unwrap()
            .then(() => {
              dispatch(fetchSupportSummary());
              showToast({
                type: "success",
                message: "Ticket updated.",
                options: {
                  description: "The ticket controls were saved successfully.",
                },
              });
            })
            .catch((updateError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to update ticket.",
                options: {
                  description:
                    typeof updateError === "string"
                      ? updateError
                      : "Please try again.",
                },
              });
            })
        }
      />
    </div>
  );
};

export default TicketDetailPage;
