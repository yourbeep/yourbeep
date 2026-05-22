import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchAdminCourses } from "../../../store/slices/courses";
import {
  clearSelectedOrder,
  fetchOrderDetail,
  fetchOrders,
  refundOrder,
} from "../../../store/slices/orders";
import { showToast } from "../../../utils/showToast";
import OrderDetailPanel from "../components/OrderDetailPanel";
import { useRefundForm } from "../hooks/useRefundForm";

export default function OrderDetailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { purchaseId } = useParams();

  const { courses, hasLoadedCourses } = useAppSelector((state) => state.courses);
  const { selectedOrder, loadingDetail, mutating, error } = useAppSelector(
    (state) => state.orders,
  );
  const { form: refundForm, setForm: setRefundForm } = useRefundForm(selectedOrder);

  useEffect(() => {
    if (!hasLoadedCourses) {
      dispatch(fetchAdminCourses());
    }
  }, [dispatch, hasLoadedCourses]);

  useEffect(() => {
    if (purchaseId) {
      dispatch(fetchOrderDetail(purchaseId));
    }

    return () => {
      dispatch(clearSelectedOrder());
    };
  }, [dispatch, purchaseId]);

  const courseTitle = selectedOrder
    ? courses.find((course) => course._id === selectedOrder.courseId)?.title ||
      selectedOrder.courseId
    : "Loading course";

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-[28px] font-bold tracking-tight text-gray-900">
          Purchase Detail
        </h1>
        <p className="max-w-3xl text-sm text-gray-600">
          Review purchase metadata, Stripe references, lifecycle timestamps, and
          process refunds from a dedicated transaction detail view.
        </p>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Order data could not be fully refreshed: {error}
        </div>
      ) : null}

      <OrderDetailPanel
        order={selectedOrder}
        loading={loadingDetail}
        mutating={mutating}
        refundForm={refundForm}
        setRefundForm={setRefundForm}
        courseTitle={courseTitle}
        onClose={() => navigate("/orders")}
        onRefund={() => {
          if (!selectedOrder) return;

          const loadingId = showToast({
            type: "loading",
            message: "Processing refund...",
            options: {
              description: "Please wait while the refund request is sent to Commerce.",
            },
          });

          dispatch(
            refundOrder({
              purchaseId: selectedOrder._id,
              payload: {
                reason: refundForm.reason,
                ...(refundForm.notes.trim()
                  ? { notes: refundForm.notes.trim() }
                  : {}),
                ...(refundForm.partialAmount.trim()
                  ? { partialAmount: Number(refundForm.partialAmount) }
                  : {}),
              },
            }),
          )
            .unwrap()
            .then(() => {
              dispatch(fetchOrders({ page: 1, limit: 10 }));
              dispatch(fetchOrderDetail(selectedOrder._id));
              showToast({
                type: "success",
                message: "Refund completed.",
                options: {
                  id: loadingId,
                  description: "The purchase was refunded successfully.",
                },
              });
            })
            .catch((refundError: unknown) => {
              showToast({
                type: "error",
                message: "Unable to refund purchase.",
                options: {
                  id: loadingId,
                  description:
                    typeof refundError === "string"
                      ? refundError
                      : "Please try again.",
                },
              });
            });
        }}
      />
    </div>
  );
}
