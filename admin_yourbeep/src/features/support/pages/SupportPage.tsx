import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, LifeBuoy, Mail, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppPagination } from "../../../components/ui/AppPagination";
import { MainButton } from "../../../components/ui/MainButton";
import { SegmentToggle } from "../../../components/ui/SegmentToggle";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  clearSelectedContact,
  fetchAdminTickets,
  fetchContactRequestDetail,
  fetchContactRequests,
  fetchSupportSummary,
  updateContactRequest,
} from "../../../store/slices/support";
import { showToast } from "../../../utils/showToast";
import ContactRequestDetailPanel from "../components/ContactRequestDetailPanel";
import ContactRequestsTable from "../components/ContactRequestsTable";
import ContactRequestsToolbar from "../components/ContactRequestsToolbar";
import SupportPageSkeleton from "../components/SupportPageSkeleton";
import SupportSectionCard from "../components/SupportSectionCard";
import SupportSummaryCards from "../components/SupportSummaryCards";
import TicketsTable from "../components/TicketsTable";
import TicketsToolbar from "../components/TicketsToolbar";
import { useSupportFilters } from "../hooks/useSupportFilters";

type SupportView = "tickets" | "contact";

export default function SupportPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    summary,
    tickets,
    contacts,
    selectedContact,
    ticketsFilters,
    contactsFilters,
    loadingSummary,
    loadingTickets,
    loadingContacts,
    loadingContactDetail,
    mutating,
    error,
  } = useAppSelector((state) => state.support);
  const filters = useSupportFilters(ticketsFilters, contactsFilters);
  const [activeView, setActiveView] = useState<SupportView>("tickets");

  useEffect(() => {
    if (!summary && !loadingSummary) {
      dispatch(fetchSupportSummary());
    }
    if (!tickets && !loadingTickets) {
      dispatch(fetchAdminTickets(ticketsFilters));
    }
    if (!contacts && !loadingContacts) {
      dispatch(fetchContactRequests(contactsFilters));
    }
  }, [
    contacts,
    contactsFilters,
    dispatch,
    loadingContacts,
    loadingSummary,
    loadingTickets,
    summary,
    tickets,
    ticketsFilters,
  ]);

  const refreshAll = () => {
    dispatch(fetchSupportSummary());
    if (activeView === "tickets") {
      dispatch(fetchAdminTickets(ticketsFilters));
      showToast({
        type: "info",
        message: "Ticket queue refreshed.",
        options: {
          description: "The latest support tickets and summary counts were requested.",
        },
      });
      return;
    }

    dispatch(fetchContactRequests(contactsFilters));
    showToast({
      type: "info",
      message: "Get in touch requests refreshed.",
      options: {
        description: "The latest public contact requests and summary counts were requested.",
      },
    });
  };

  const applyTicketFilters = () => {
    dispatch(
      fetchAdminTickets({
        page: 1,
        limit: ticketsFilters.limit,
        q: filters.ticketsSearch.trim(),
        type: filters.ticketType || undefined,
        status: filters.ticketStatus || undefined,
        priority: filters.ticketPriority || undefined,
      }),
    );
  };

  const applyContactFilters = () => {
    dispatch(
      fetchContactRequests({
        page: 1,
        limit: contactsFilters.limit,
        q: filters.contactsSearch.trim(),
        topic: filters.contactTopic || undefined,
        status: filters.contactStatus || undefined,
      }),
    );
  };

  const ticketsTotalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil((tickets?.pagination.total || 0) / (tickets?.pagination.limit || 10)),
      ),
    [tickets],
  );

  const contactsTotalPages = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil((contacts?.pagination.total || 0) / (contacts?.pagination.limit || 10)),
      ),
    [contacts],
  );

  if (loadingSummary && !summary && loadingTickets && !tickets) {
    return <SupportPageSkeleton />;
  }

  const supportHighlights = [
    {
      icon: <LifeBuoy className="h-5 w-5 text-[#0d6e6e]" />,
      title: "Support queue",
      body: "Operational issue handling for learner access, payments, refunds, and course delivery problems.",
    },
    {
      icon: <Mail className="h-5 w-5 text-[#0d6e6e]" />,
      title: "Get in touch",
      body: "A cleaner inbox for public enquiries, partnerships, and general feedback that should not enter the ticket queue.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-[#e8eadf] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="mb-2 text-[28px] font-bold tracking-tight text-gray-900">
              Support & Get In Touch
            </h1>
            <p className="max-w-3xl text-sm text-gray-600">
              Work through ticket queues, refund-related escalations, account access issues, and public get in touch requests using the real backend support system.
            </p>
          </div>
          <MainButton
            text="Refresh Current View"
            variant="outline"
            headIcon={<RefreshCw className="h-4 w-4" />}
            onClick={refreshAll}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {supportHighlights.map((item) => (
            <motion.div
              key={item.title}
              layout
              className="rounded-[24px] border border-[#e7eadf] bg-[#fbfcf8] p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dfe8d6] bg-white">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#203321]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#72806e]">{item.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6">
          <SegmentToggle
            value={activeView}
            onChange={setActiveView}
            motionId="support-view"
            size="md"
            className="max-w-[420px]"
            items={[
              {
                label: (
                  <span className="inline-flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    Ticket Queue
                  </span>
                ),
                value: "tickets",
              },
              {
                label: (
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Get In Touch
                  </span>
                ),
                value: "contact",
              },
            ]}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-[#f3e2b4] bg-[#fff9ea] px-4 py-3 text-sm text-[#9a7a19]">
          Support data could not be fully refreshed: {error}
        </div>
      ) : null}

      <SupportSummaryCards summary={summary} />

      <AnimatePresence mode="wait">
        {activeView === "tickets" ? (
          <motion.div
            key="tickets-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <SupportSectionCard
              title="Ticket Queue"
              subtitle="Triage learner issues, respond to escalations, and open a full ticket detail page when you need to work through a case."
            >
              <TicketsToolbar
                searchQuery={filters.ticketsSearch}
                setSearchQuery={filters.setTicketsSearch}
                type={filters.ticketType}
                setType={filters.setTicketType}
                status={filters.ticketStatus}
                setStatus={filters.setTicketStatus}
                priority={filters.ticketPriority}
                setPriority={filters.setTicketPriority}
                onApply={applyTicketFilters}
                onRefresh={refreshAll}
                loading={loadingTickets || loadingSummary}
              />
            </SupportSectionCard>

            <TicketsTable
              items={tickets?.items ?? []}
              onOpen={(ticketId) => navigate(`/support/tickets/${ticketId}`)}
            />

            <AppPagination
              currentPage={tickets?.pagination.page ?? 1}
              totalPages={ticketsTotalPages}
              onPageChange={(page) =>
                dispatch(
                  fetchAdminTickets({
                    page,
                    limit: tickets?.pagination.limit ?? ticketsFilters.limit,
                    q: filters.ticketsSearch.trim(),
                    type: filters.ticketType || undefined,
                    status: filters.ticketStatus || undefined,
                    priority: filters.ticketPriority || undefined,
                  }),
                )
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="contact-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <SupportSectionCard
              title="Get In Touch Requests"
              subtitle="Keep public enquiries separate from support tickets so feedback, partnerships, and general contact requests are easier to triage."
            >
              <ContactRequestsToolbar
                searchQuery={filters.contactsSearch}
                setSearchQuery={filters.setContactsSearch}
                topic={filters.contactTopic}
                setTopic={filters.setContactTopic}
                status={filters.contactStatus}
                setStatus={filters.setContactStatus}
                onApply={applyContactFilters}
                onRefresh={refreshAll}
                loading={loadingContacts}
              />
            </SupportSectionCard>

            <ContactRequestsTable
              items={contacts?.items ?? []}
              onOpen={(requestId) => dispatch(fetchContactRequestDetail(requestId))}
            />

            <AppPagination
              currentPage={contacts?.pagination.page ?? 1}
              totalPages={contactsTotalPages}
              onPageChange={(page) =>
                dispatch(
                  fetchContactRequests({
                    page,
                    limit: contacts?.pagination.limit ?? contactsFilters.limit,
                    q: filters.contactsSearch.trim(),
                    topic: filters.contactTopic || undefined,
                    status: filters.contactStatus || undefined,
                  }),
                )
              }
            />

            <ContactRequestDetailPanel
              request={selectedContact}
              loading={loadingContactDetail}
              mutating={mutating}
              onClose={() => dispatch(clearSelectedContact())}
              onSave={(payload) =>
                selectedContact &&
                dispatch(updateContactRequest({ requestId: selectedContact._id, payload }))
                  .unwrap()
                  .then(() => {
                    showToast({
                      type: "success",
                      message: "Request updated.",
                      options: {
                        description: "The get in touch request was updated successfully.",
                      },
                    });
                  })
                  .catch((updateError: unknown) => {
                    showToast({
                      type: "error",
                      message: "Unable to update request.",
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
