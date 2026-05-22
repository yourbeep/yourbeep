import { env } from "@yourbeep/shared";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type OpenApiSchema = Record<string, unknown>;
type OpenApiResponse = Record<string, unknown>;
type OpenApiOperation = Record<string, unknown>;

const bearerSecurity = [{ bearerAuth: [] }];
const adminSecurity = [{ bearerAuth: [] }];

const successEnvelope = (description: string, dataSchema: OpenApiSchema = { type: "object" }): OpenApiResponse => ({
  description,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: description },
          data: dataSchema,
        },
        required: ["success", "data"],
      },
    },
  },
});

const errorEnvelope = (description = "Error response"): OpenApiResponse => ({
  description,
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorEnvelope",
      },
    },
  },
});

const jsonBody = (schema: OpenApiSchema, required = true) => ({
  required,
  content: {
    "application/json": {
      schema,
    },
  },
});

const pathParam = (name: string, description: string) => ({
  name,
  in: "path",
  required: true,
  description,
  schema: { type: "string" },
});

const queryParam = (
  name: string,
  description: string,
  schema: OpenApiSchema = { type: "string" },
  required = false,
) => ({
  name,
  in: "query",
  required,
  description,
  schema,
});

const operation = ({
  summary,
  description,
  tags,
  security,
  parameters,
  requestBody,
  responses,
}: {
  summary: string;
  description?: string;
  tags: string[];
  security?: Record<string, string[]>[];
  parameters?: Record<string, unknown>[];
  requestBody?: Record<string, unknown>;
  responses: Record<string, OpenApiResponse>;
}): OpenApiOperation => ({
  summary,
  ...(description ? { description } : {}),
  tags,
  ...(security ? { security } : {}),
  ...(parameters ? { parameters } : {}),
  ...(requestBody ? { requestBody } : {}),
  responses,
});

const pathItem = (methods: Partial<Record<HttpMethod, OpenApiOperation>>) => methods;

export const buildOpenApiSpec = () => {
  const paths: Record<string, unknown> = {
    "/auth/sync": pathItem({
      post: operation({
        summary: "Sync Firebase user profile",
        tags: ["Auth"],
        security: bearerSecurity,
        requestBody: jsonBody({
          type: "object",
          properties: {
            timezone: { type: "string", example: "Asia/Calcutta" },
            region: { type: "string", example: "IN" },
            fcmToken: { type: "string" },
          },
        }),
        responses: {
          "200": successEnvelope("User synced", { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }),
          "401": errorEnvelope("Authentication failed"),
        },
      }),
    }),
    "/users/me": pathItem({
      get: operation({
        summary: "Get current user",
        tags: ["Users"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("Current user profile", { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }),
          "401": errorEnvelope(),
        },
      }),
      patch: operation({
        summary: "Update current user profile",
        tags: ["Users"],
        security: bearerSecurity,
        requestBody: jsonBody({
          type: "object",
          properties: {
            name: { type: "string" },
            avatar: { type: "string", format: "uri" },
            timezone: { type: "string" },
            phoneCountryCode: { type: "string", example: "+91" },
          },
        }),
        responses: {
          "200": successEnvelope("Profile updated", { type: "object", properties: { user: { $ref: "#/components/schemas/User" } } }),
          "400": errorEnvelope(),
        },
      }),
    }),
    "/users/me/stats": pathItem({
      get: operation({
        summary: "Get current user stats",
        tags: ["Users"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("User stats", {
            type: "object",
            properties: {
              userLevel: { type: "number" },
              points: { type: "number" },
              streakDays: { type: "number" },
              badges: { type: "array", items: { type: "string" } },
              progression: { type: "object" },
              activitySummary: { type: "object" },
            },
          }),
        },
      }),
    }),
    "/users/me/activity-log": pathItem({
      get: operation({
        summary: "Get current user activity log",
        tags: ["Users"],
        security: bearerSecurity,
        parameters: [
          queryParam("page", "Page number", { type: "integer", minimum: 1 }),
          queryParam("limit", "Page size", { type: "integer", minimum: 1, maximum: 100 }),
          queryParam("courseId", "Filter by course id"),
          queryParam("gameKey", "Filter by game key"),
          queryParam("from", "ISO start date", { type: "string", format: "date-time" }),
          queryParam("to", "ISO end date", { type: "string", format: "date-time" }),
        ],
        responses: {
          "200": successEnvelope("Activity log", {
            type: "object",
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/ActivityLog" } },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          }),
        },
      }),
    }),
    "/users/me/purchases": pathItem({
      get: operation({
        summary: "Get current user purchases",
        tags: ["Users", "Commerce"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("User purchases", {
            type: "object",
            properties: {
              purchases: { type: "array", items: { $ref: "#/components/schemas/Purchase" } },
            },
          }),
        },
      }),
    }),
    "/users/me/progress": pathItem({
      get: operation({
        summary: "Get current user course progress",
        tags: ["Users", "Courses"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("Progress", {
            type: "object",
            properties: {
              summary: { type: "object" },
              courses: { type: "array", items: { type: "object" } },
            },
          }),
        },
      }),
    }),
    "/users/me/dashboard": pathItem({
      get: operation({
        summary: "Get current user dashboard",
        tags: ["Users", "Dashboard"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("Dashboard", { $ref: "#/components/schemas/HomeDashboard" }),
        },
      }),
    }),
    "/notifications/token": pathItem({
      post: operation({
        summary: "Register FCM token",
        tags: ["Notifications"],
        security: bearerSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["fcmToken"],
          properties: {
            fcmToken: { type: "string" },
            deviceType: { type: "string", enum: ["web", "ios", "android"] },
          },
        }),
        responses: {
          "200": successEnvelope("FCM token registered", { $ref: "#/components/schemas/FcmTokenResponse" }),
        },
      }),
      delete: operation({
        summary: "Remove FCM token",
        tags: ["Notifications"],
        security: bearerSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["fcmToken"],
          properties: {
            fcmToken: { type: "string" },
          },
        }),
        responses: {
          "200": successEnvelope("FCM token removed", { $ref: "#/components/schemas/FcmTokenResponse" }),
        },
      }),
    }),
    "/tickets": pathItem({
      get: operation({
        summary: "List current user support tickets",
        tags: ["Support"],
        security: bearerSecurity,
        parameters: [
          queryParam("page", "Page number", { type: "integer", minimum: 1 }),
          queryParam("limit", "Page size", { type: "integer", minimum: 1, maximum: 100 }),
          queryParam("q", "Search subject or description"),
          queryParam(
            "type",
            "Ticket type",
            {
              type: "string",
              enum: [
                "refund_related",
                "account_access",
                "course_access",
                "video_access",
                "payment_issue",
                "game_issue",
                "technical_issue",
                "general_support",
              ],
            },
          ),
          queryParam("status", "Ticket status", { type: "string", enum: ["open", "in_progress", "waiting_on_user", "resolved", "closed"] }),
        ],
        responses: {
          "200": successEnvelope("Support tickets", {
            type: "object",
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/SupportTicket" } },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          }),
        },
      }),
      post: operation({
        summary: "Create support ticket",
        tags: ["Support"],
        security: bearerSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/SupportTicketCreate" }),
        responses: {
          "201": successEnvelope("Support ticket created", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/tickets/{ticketId}": pathItem({
      get: operation({
        summary: "Get support ticket detail",
        tags: ["Support"],
        security: bearerSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        responses: {
          "200": successEnvelope("Support ticket detail", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/tickets/{ticketId}/replies": pathItem({
      post: operation({
        summary: "Reply to a support ticket",
        tags: ["Support"],
        security: bearerSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        requestBody: jsonBody({
          type: "object",
          required: ["body"],
          properties: {
            body: { type: "string", maxLength: 5000 },
            attachments: { type: "array", items: { type: "string", format: "uri" } },
          },
        }),
        responses: {
          "200": successEnvelope("Support ticket replied", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/tickets/{ticketId}/close": pathItem({
      patch: operation({
        summary: "Close a current user support ticket",
        tags: ["Support"],
        security: bearerSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        responses: {
          "200": successEnvelope("Support ticket closed", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/get-in-touch": pathItem({
      post: operation({
        summary: "Create a public get in touch request",
        tags: ["Contact"],
        requestBody: jsonBody({ $ref: "#/components/schemas/ContactRequestCreate" }),
        responses: {
          "201": successEnvelope("Get in touch request created", { type: "object", properties: { request: { $ref: "#/components/schemas/ContactRequest" } } }),
        },
      }),
    }),
    "/platform/settings": pathItem({
      get: operation({
        summary: "Get public platform settings",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Platform settings", { $ref: "#/components/schemas/PlatformSettingsPublic" }),
        },
      }),
    }),
    "/platform/legal/terms": pathItem({
      get: operation({
        summary: "Get Terms & Conditions",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Terms & Conditions", { $ref: "#/components/schemas/LegalDocument" }),
        },
      }),
    }),
    "/platform/legal/privacy": pathItem({
      get: operation({
        summary: "Get Privacy Policy",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Privacy policy", { $ref: "#/components/schemas/LegalDocument" }),
        },
      }),
    }),
    "/platform/legal/refund": pathItem({
      get: operation({
        summary: "Get Refund Policy",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Refund policy", { $ref: "#/components/schemas/LegalDocument" }),
        },
      }),
    }),
    "/platform/legal/cookies": pathItem({
      get: operation({
        summary: "Get Cookie Policy",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Cookie policy", { $ref: "#/components/schemas/LegalDocument" }),
        },
      }),
    }),
    "/platform/legal/community-guidelines": pathItem({
      get: operation({
        summary: "Get Community Guidelines",
        tags: ["Platform"],
        responses: {
          "200": successEnvelope("Community guidelines", { $ref: "#/components/schemas/LegalDocument" }),
        },
      }),
    }),
    "/courses": pathItem({
      get: operation({
        summary: "List active courses",
        tags: ["Courses"],
        responses: {
          "200": successEnvelope("Courses list", {
            type: "object",
            properties: {
              courses: { type: "array", items: { $ref: "#/components/schemas/CourseListItem" } },
            },
          }),
        },
      }),
    }),
    "/courses/{courseId}": pathItem({
      get: operation({
        summary: "Get course detail",
        tags: ["Courses"],
        parameters: [pathParam("courseId", "Course id")],
        responses: {
          "200": successEnvelope("Course detail", { $ref: "#/components/schemas/CourseDetail" }),
          "404": errorEnvelope(),
        },
      }),
    }),
    "/courses/{courseId}/content": pathItem({
      get: operation({
        summary: "Get purchased course content",
        tags: ["Courses", "Content"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: {
          "200": successEnvelope("Course content", { $ref: "#/components/schemas/CourseContentResponse" }),
          "403": errorEnvelope("Course not purchased"),
        },
      }),
    }),
    "/courses/{courseId}/comments": pathItem({
      get: operation({
        summary: "List course comments",
        tags: ["Comments"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: {
          "200": successEnvelope("Course comments", { $ref: "#/components/schemas/CommentListResponse" }),
        },
      }),
      post: operation({
        summary: "Create course comment",
        tags: ["Comments"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 2000 },
            parentCommentId: { type: "string" },
          },
        }),
        responses: {
          "200": successEnvelope("Course comment created", { $ref: "#/components/schemas/CommentMutationResponse" }),
          "403": errorEnvelope("Only paid users can comment"),
        },
      }),
    }),
    "/content/{itemId}/comments": pathItem({
      get: operation({
        summary: "List lesson comments",
        tags: ["Comments"],
        security: bearerSecurity,
        parameters: [pathParam("itemId", "Content item id")],
        responses: { "200": successEnvelope("Content comments", { $ref: "#/components/schemas/CommentListResponse" }) },
      }),
      post: operation({
        summary: "Create lesson comment",
        tags: ["Comments"],
        security: bearerSecurity,
        parameters: [pathParam("itemId", "Content item id")],
        requestBody: jsonBody({
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", maxLength: 2000 },
            parentCommentId: { type: "string" },
          },
        }),
        responses: { "200": successEnvelope("Content comment created", { $ref: "#/components/schemas/CommentMutationResponse" }) },
      }),
    }),
    "/master-course": pathItem({
      get: operation({
        summary: "Get free master course video",
        tags: ["Master Course"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("Master course", { $ref: "#/components/schemas/MasterCourseResponse" }),
        },
      }),
    }),
    "/master-course/stream": pathItem({
      get: operation({
        summary: "Get signed master course stream url",
        tags: ["Master Course", "Video"],
        security: bearerSecurity,
        responses: { "200": successEnvelope("Master course stream", { $ref: "#/components/schemas/VideoStreamResponse" }) },
      }),
    }),
    "/courses/{courseId}/videos/{videoId}/stream": pathItem({
      get: operation({
        summary: "Get signed course video stream url",
        tags: ["Video"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id"), pathParam("videoId", "Video id")],
        responses: {
          "200": successEnvelope("Video stream", { $ref: "#/components/schemas/VideoStreamResponse" }),
          "403": errorEnvelope("Course not purchased"),
        },
      }),
    }),
    "/courses/{courseId}/videos/{videoId}/watch-event": pathItem({
      post: operation({
        summary: "Record a course video watch event",
        tags: ["Video", "Dashboard"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id"), pathParam("videoId", "Video id")],
        requestBody: jsonBody({
          type: "object",
          required: ["watchedSeconds"],
          properties: {
            watchedSeconds: { type: "integer", minimum: 1, maximum: 14400 },
            positionSeconds: { type: "integer", minimum: 0 },
            contentItemId: { type: "string" },
            completed: { type: "boolean" },
          },
        }),
        responses: {
          "201": successEnvelope("Course video watch event recorded", { $ref: "#/components/schemas/VideoWatchEventResponse" }),
          "403": errorEnvelope("Course not purchased"),
        },
      }),
    }),
    "/games/{gameId}/submit": pathItem({
      post: operation({
        summary: "Submit a game",
        tags: ["Games"],
        security: bearerSecurity,
        parameters: [pathParam("gameId", "Game id")],
        requestBody: jsonBody({
          type: "object",
          required: ["type", "payload"],
          properties: {
            type: {
              type: "string",
              enum: ["awareness_states", "somatic_states", "pattern_awareness", "reflect_act"],
            },
            step: { type: "number" },
            payload: { type: "object" },
          },
        }),
        responses: {
          "200": successEnvelope("Game submitted", { $ref: "#/components/schemas/GameSubmissionResponse" }),
          "403": errorEnvelope("Course not purchased"),
          "422": errorEnvelope("Validation or prerequisites failed"),
        },
      }),
    }),
    "/games/{gameId}/result": pathItem({
      get: operation({
        summary: "Get current user game result",
        tags: ["Games"],
        security: bearerSecurity,
        parameters: [pathParam("gameId", "Game id")],
        responses: { "200": successEnvelope("Game result", { $ref: "#/components/schemas/GameResultResponse" }) },
      }),
    }),
    "/games/{gameId}/activities/{activityKey}": pathItem({
      get: operation({
        summary: "Get activity detail for a somatic game activity",
        tags: ["Games"],
        security: bearerSecurity,
        parameters: [pathParam("gameId", "Game id"), pathParam("activityKey", "Activity key")],
        responses: { "200": successEnvelope("Game activity", { $ref: "#/components/schemas/GameActivityResponse" }) },
      }),
    }),
    "/courses/{courseId}/submissions": pathItem({
      get: operation({
        summary: "Get current user submissions for a course",
        tags: ["Games"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: { "200": successEnvelope("Course submissions", { $ref: "#/components/schemas/CourseSubmissionsResponse" }) },
      }),
    }),
    "/submissions/{submissionId}": pathItem({
      get: operation({
        summary: "Get submission by id",
        tags: ["Games"],
        security: bearerSecurity,
        parameters: [pathParam("submissionId", "Submission id")],
        responses: { "200": successEnvelope("Submission detail", { $ref: "#/components/schemas/SubmissionDetailResponse" }) },
      }),
    }),
    "/commerce/purchases": pathItem({
      get: operation({
        summary: "List current user purchases",
        tags: ["Commerce"],
        security: bearerSecurity,
        responses: {
          "200": successEnvelope("User purchases", {
            type: "object",
            properties: { purchases: { type: "array", items: { $ref: "#/components/schemas/Purchase" } } },
          }),
        },
      }),
    }),
    "/commerce/courses/{courseId}/access": pathItem({
      get: operation({
        summary: "Check course access for current user",
        tags: ["Commerce"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: { "200": successEnvelope("Course access", { $ref: "#/components/schemas/CourseAccessResponse" }) },
      }),
    }),
    "/commerce/courses/{courseId}/purchase/initiate": pathItem({
      post: operation({
        summary: "Initiate course purchase checkout",
        tags: ["Commerce"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["planType", "successUrl", "cancelUrl"],
          properties: {
            planType: { type: "string", enum: ["six_month", "annual"] },
            phoneCountryCode: { type: "string", example: "+91" },
            promotionCode: { type: "string" },
            successUrl: { type: "string", format: "uri" },
            cancelUrl: { type: "string", format: "uri" },
          },
        }),
        responses: { "200": successEnvelope("Purchase initiated", { $ref: "#/components/schemas/CheckoutInitiatedResponse" }) },
      }),
    }),
    "/commerce/courses/{courseId}/purchase/confirm": pathItem({
      post: operation({
        summary: "Confirm course purchase after checkout",
        tags: ["Commerce"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["sessionId"],
          properties: { sessionId: { type: "string" } },
        }),
        responses: { "200": successEnvelope("Purchase confirmed", { $ref: "#/components/schemas/PurchaseConfirmedResponse" }) },
      }),
    }),
    "/commerce/courses/{courseId}/renew/initiate": pathItem({
      post: operation({
        summary: "Initiate renewal checkout",
        tags: ["Commerce"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["planType", "successUrl", "cancelUrl"],
          properties: {
            planType: { type: "string", enum: ["six_month", "annual"] },
            phoneCountryCode: { type: "string", example: "+91" },
            promotionCode: { type: "string" },
            successUrl: { type: "string", format: "uri" },
            cancelUrl: { type: "string", format: "uri" },
          },
        }),
        responses: { "200": successEnvelope("Renewal initiated", { $ref: "#/components/schemas/CheckoutInitiatedResponse" }) },
      }),
    }),
    "/commerce/courses/{courseId}/renew/confirm": pathItem({
      post: operation({
        summary: "Confirm renewal after checkout",
        tags: ["Commerce"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["sessionId"],
          properties: { sessionId: { type: "string" } },
        }),
        responses: { "200": successEnvelope("Renewal confirmed", { $ref: "#/components/schemas/PurchaseConfirmedResponse" }) },
      }),
    }),
    "/commerce/courses/{courseId}/promotion/preview": pathItem({
      post: operation({
        summary: "Preview a promotion for a course plan",
        tags: ["Commerce", "Promotions"],
        security: bearerSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["planType"],
          properties: {
            planType: { type: "string", enum: ["six_month", "annual"] },
            promotionCode: { type: "string" },
          },
        }),
        responses: { "200": successEnvelope("Promotion preview", { $ref: "#/components/schemas/PromotionPreviewResponse" }) },
      }),
    }),
    "/courses/{courseId}/price": pathItem({
      get: operation({
        summary: "Get course price for detected region",
        tags: ["Commerce", "Pricing"],
        parameters: [],
        responses: { "200": successEnvelope("Course pricing", { $ref: "#/components/schemas/CoursePricingResponse" }) },
      }),
    }),
    "/courses/{courseId}/price/{region}": pathItem({
      get: operation({
        summary: "Get course price for specific region",
        tags: ["Commerce", "Pricing"],
        parameters: [pathParam("courseId", "Course id"), pathParam("region", "Region code")],
        responses: { "200": successEnvelope("Course pricing", { $ref: "#/components/schemas/CoursePricingResponse" }) },
      }),
    }),
    "/admin/dashboard": pathItem({
      get: operation({
        summary: "Get admin dashboard",
        tags: ["Admin", "Dashboard"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Students page", { type: "integer", minimum: 1 }),
          queryParam("limit", "Students page size", { type: "integer", minimum: 1, maximum: 100 }),
          queryParam("q", "Search students"),
          queryParam("isActive", "Filter active students", { type: "boolean" }),
        ],
        responses: { "200": successEnvelope("Admin dashboard", { $ref: "#/components/schemas/AdminDashboardResponse" }) },
      }),
    }),
    "/admin/tickets": pathItem({
      get: operation({
        summary: "List admin support tickets",
        tags: ["Admin", "Support"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer", minimum: 1 }),
          queryParam("limit", "Limit", { type: "integer", minimum: 1, maximum: 100 }),
          queryParam("q", "Search"),
          queryParam(
            "type",
            "Ticket type",
            {
              type: "string",
              enum: [
                "refund_related",
                "account_access",
                "course_access",
                "video_access",
                "payment_issue",
                "game_issue",
                "technical_issue",
                "general_support",
              ],
            },
          ),
          queryParam("status", "Ticket status", { type: "string", enum: ["open", "in_progress", "waiting_on_user", "resolved", "closed"] }),
          queryParam("priority", "Ticket priority", { type: "string", enum: ["low", "medium", "high", "urgent"] }),
          queryParam("assignedAdminId", "Assigned admin id"),
          queryParam("userId", "User id"),
        ],
        responses: {
          "200": successEnvelope("Admin support tickets", {
            type: "object",
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/SupportTicket" } },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          }),
        },
      }),
    }),
    "/admin/tickets/summary": pathItem({
      get: operation({
        summary: "Get admin ticket center summary",
        tags: ["Admin", "Support"],
        security: adminSecurity,
        responses: { "200": successEnvelope("Admin ticket summary", { $ref: "#/components/schemas/AdminTicketSummaryResponse" }) },
      }),
    }),
    "/admin/tickets/{ticketId}": pathItem({
      get: operation({
        summary: "Get admin support ticket detail",
        tags: ["Admin", "Support"],
        security: adminSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        responses: {
          "200": successEnvelope("Admin support ticket detail", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
      patch: operation({
        summary: "Update admin support ticket",
        tags: ["Admin", "Support"],
        security: adminSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        requestBody: jsonBody({
          type: "object",
          properties: {
            type: { type: "string" },
            status: { type: "string", enum: ["open", "in_progress", "waiting_on_user", "resolved", "closed"] },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
            assignedAdminId: { type: "string", nullable: true },
            tags: { type: "array", items: { type: "string" } },
          },
        }),
        responses: {
          "200": successEnvelope("Admin support ticket updated", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/admin/tickets/{ticketId}/replies": pathItem({
      post: operation({
        summary: "Reply to a support ticket as admin",
        tags: ["Admin", "Support"],
        security: adminSecurity,
        parameters: [pathParam("ticketId", "Ticket id")],
        requestBody: jsonBody({
          type: "object",
          required: ["body"],
          properties: {
            body: { type: "string", maxLength: 5000 },
            attachments: { type: "array", items: { type: "string", format: "uri" } },
          },
        }),
        responses: {
          "200": successEnvelope("Admin support ticket replied", { type: "object", properties: { ticket: { $ref: "#/components/schemas/SupportTicket" } } }),
        },
      }),
    }),
    "/admin/get-in-touch": pathItem({
      get: operation({
        summary: "List get in touch requests",
        tags: ["Admin", "Contact"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer", minimum: 1 }),
          queryParam("limit", "Limit", { type: "integer", minimum: 1, maximum: 100 }),
          queryParam("q", "Search"),
          queryParam(
            "topic",
            "Contact topic",
            {
              type: "string",
              enum: [
                "refund_related",
                "account_access",
                "course_access",
                "video_access",
                "payment_issue",
                "game_issue",
                "technical_issue",
                "general_support",
                "partnership",
                "feedback",
              ],
            },
          ),
          queryParam("status", "Request status", { type: "string", enum: ["new", "reviewed", "replied", "closed"] }),
        ],
        responses: {
          "200": successEnvelope("Get in touch requests", {
            type: "object",
            properties: {
              items: { type: "array", items: { $ref: "#/components/schemas/ContactRequest" } },
              pagination: { $ref: "#/components/schemas/Pagination" },
            },
          }),
        },
      }),
    }),
    "/admin/get-in-touch/{requestId}": pathItem({
      get: operation({
        summary: "Get get in touch request detail",
        tags: ["Admin", "Contact"],
        security: adminSecurity,
        parameters: [pathParam("requestId", "Request id")],
        responses: {
          "200": successEnvelope("Get in touch request detail", { type: "object", properties: { request: { $ref: "#/components/schemas/ContactRequest" } } }),
        },
      }),
      patch: operation({
        summary: "Update get in touch request",
        tags: ["Admin", "Contact"],
        security: adminSecurity,
        parameters: [pathParam("requestId", "Request id")],
        requestBody: jsonBody({
          type: "object",
          properties: {
            status: { type: "string", enum: ["new", "reviewed", "replied", "closed"] },
            notes: { type: "string", maxLength: 3000 },
          },
        }),
        responses: {
          "200": successEnvelope("Get in touch request updated", { type: "object", properties: { request: { $ref: "#/components/schemas/ContactRequest" } } }),
        },
      }),
    }),
    "/admin/platform/settings": pathItem({
      get: operation({
        summary: "Get admin platform settings",
        tags: ["Admin", "Platform"],
        security: adminSecurity,
        responses: {
          "200": successEnvelope("Admin platform settings", { $ref: "#/components/schemas/PlatformSettingsAdmin" }),
        },
      }),
      patch: operation({
        summary: "Update platform settings",
        tags: ["Admin", "Platform"],
        security: adminSecurity,
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: {
          "200": successEnvelope("Platform settings updated", { $ref: "#/components/schemas/PlatformSettingsAdmin" }),
        },
      }),
    }),
    "/admin/platform/settings/faqs": pathItem({
      post: operation({
        summary: "Create platform FAQ item",
        tags: ["Admin", "Platform"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["category", "question", "answer", "order"],
          properties: {
            category: { type: "string" },
            question: { type: "string" },
            answer: { type: "string" },
            order: { type: "integer", minimum: 1 },
            isPublished: { type: "boolean" },
          },
        }),
        responses: {
          "201": successEnvelope("Platform FAQ created", { $ref: "#/components/schemas/PlatformSettingsAdmin" }),
        },
      }),
    }),
    "/admin/platform/settings/faqs/{faqId}": pathItem({
      patch: operation({
        summary: "Update platform FAQ item",
        tags: ["Admin", "Platform"],
        security: adminSecurity,
        parameters: [pathParam("faqId", "FAQ item id")],
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: {
          "200": successEnvelope("Platform FAQ updated", { $ref: "#/components/schemas/PlatformSettingsAdmin" }),
        },
      }),
      delete: operation({
        summary: "Delete platform FAQ item",
        tags: ["Admin", "Platform"],
        security: adminSecurity,
        parameters: [pathParam("faqId", "FAQ item id")],
        responses: {
          "200": successEnvelope("Platform FAQ deleted", { $ref: "#/components/schemas/PlatformSettingsAdmin" }),
        },
      }),
    }),
    "/admin/users": pathItem({
      get: operation({
        summary: "List users",
        tags: ["Admin", "Users"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer" }),
          queryParam("limit", "Limit", { type: "integer" }),
          queryParam("q", "Search"),
          queryParam("role", "Role", { type: "string", enum: ["user", "admin"] }),
          queryParam("isActive", "Active filter", { type: "boolean" }),
        ],
        responses: { "200": successEnvelope("Users list", { $ref: "#/components/schemas/UsersListResponse" }) },
      }),
    }),
    "/admin/users/{id}": pathItem({
      get: operation({
        summary: "Get user by id",
        tags: ["Admin", "Users"],
        security: adminSecurity,
        parameters: [pathParam("id", "User id")],
        responses: {
          "200": successEnvelope("User detail", {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/AdminUserDetail" },
            },
          }),
        },
      }),
      delete: operation({
        summary: "Soft delete user",
        tags: ["Admin", "Users"],
        security: adminSecurity,
        parameters: [pathParam("id", "User id")],
        responses: { "200": successEnvelope("User soft-deleted", { $ref: "#/components/schemas/UserMutationResponse" }) },
      }),
    }),
    "/admin/users/{id}/role": pathItem({
      patch: operation({
        summary: "Update user role",
        tags: ["Admin", "Users"],
        security: adminSecurity,
        parameters: [pathParam("id", "User id")],
        requestBody: jsonBody({
          type: "object",
          required: ["role"],
          properties: { role: { type: "string", enum: ["user", "admin"] } },
        }),
        responses: { "200": successEnvelope("User role updated", { $ref: "#/components/schemas/UserMutationResponse" }) },
      }),
    }),
    "/admin/users/{id}/restore": pathItem({
      post: operation({
        summary: "Restore soft-deleted user",
        tags: ["Admin", "Users"],
        security: adminSecurity,
        parameters: [pathParam("id", "User id")],
        responses: { "200": successEnvelope("User restored", { $ref: "#/components/schemas/UserMutationResponse" }) },
      }),
    }),
    "/admin/notifications/broadcast": pathItem({
      post: operation({
        summary: "Send immediate admin broadcast",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["title", "body"],
          properties: {
            title: { type: "string" },
            body: { type: "string" },
            imageUrl: { type: "string", format: "uri" },
            courseId: { type: "string" },
            data: { type: "object", additionalProperties: true },
          },
        }),
        responses: { "200": successEnvelope("Notification broadcast sent", { $ref: "#/components/schemas/NotificationBroadcastResponse" }) },
      }),
    }),
    "/admin/notifications/summary": pathItem({
      get: operation({
        summary: "Get notification center summary",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        responses: { "200": successEnvelope("Notification center summary", { $ref: "#/components/schemas/NotificationCenterSummaryResponse" }) },
      }),
    }),
    "/admin/notifications/campaigns": pathItem({
      get: operation({
        summary: "List notification campaigns",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer" }),
          queryParam("limit", "Limit", { type: "integer" }),
          queryParam("q", "Search"),
          queryParam("status", "Campaign status", { type: "string", enum: ["draft", "sent", "cancelled"] }),
          queryParam("audienceType", "Audience type", { type: "string" }),
        ],
        responses: { "200": successEnvelope("Notification campaigns", { $ref: "#/components/schemas/NotificationCampaignListResponse" }) },
      }),
      post: operation({
        summary: "Create notification campaign",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["title", "body", "audience"],
          properties: {
            title: { type: "string" },
            body: { type: "string" },
            imageUrl: { type: "string", format: "uri" },
            type: { type: "string", enum: ["course_ready", "game_added", "game_reminder", "purchase_confirmed", "subscription_expiring", "subscription_expired", "admin_broadcast"] },
            audience: { $ref: "#/components/schemas/NotificationAudience" },
            data: { type: "object", additionalProperties: true },
            sendNow: { type: "boolean" },
          },
        }),
        responses: { "200": successEnvelope("Notification campaign created", { $ref: "#/components/schemas/NotificationCampaignResponse" }) },
      }),
    }),
    "/admin/notifications/campaigns/{campaignId}": pathItem({
      get: operation({
        summary: "Get notification campaign detail",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        parameters: [pathParam("campaignId", "Campaign id")],
        responses: { "200": successEnvelope("Notification campaign detail", { $ref: "#/components/schemas/NotificationCampaignResponse" }) },
      }),
      patch: operation({
        summary: "Update notification campaign draft",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        parameters: [pathParam("campaignId", "Campaign id")],
        requestBody: jsonBody({
          type: "object",
          properties: {
            title: { type: "string" },
            body: { type: "string" },
            imageUrl: { type: "string", format: "uri" },
            type: { type: "string" },
            audience: { $ref: "#/components/schemas/NotificationAudience" },
            data: { type: "object", additionalProperties: true },
          },
        }),
        responses: { "200": successEnvelope("Notification campaign updated", { $ref: "#/components/schemas/NotificationCampaignResponse" }) },
      }),
      delete: operation({
        summary: "Cancel notification campaign",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        parameters: [pathParam("campaignId", "Campaign id")],
        responses: { "200": successEnvelope("Notification campaign cancelled", { $ref: "#/components/schemas/NotificationCampaignResponse" }) },
      }),
    }),
    "/admin/notifications/campaigns/{campaignId}/send": pathItem({
      post: operation({
        summary: "Send notification campaign",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        parameters: [pathParam("campaignId", "Campaign id")],
        responses: { "200": successEnvelope("Notification campaign sent", { $ref: "#/components/schemas/NotificationCampaignResponse" }) },
      }),
    }),
    "/admin/notifications/audience-preview": pathItem({
      post: operation({
        summary: "Preview notification audience",
        tags: ["Admin", "Notifications"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["audience"],
          properties: {
            audience: { $ref: "#/components/schemas/NotificationAudience" },
          },
        }),
        responses: { "200": successEnvelope("Notification audience preview", { $ref: "#/components/schemas/NotificationAudiencePreviewResponse" }) },
      }),
    }),
    "/admin/games": pathItem({
      get: operation({
        summary: "List games",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        responses: { "200": successEnvelope("Games list", { $ref: "#/components/schemas/GamesListResponse" }) },
      }),
      post: operation({
        summary: "Create game",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          required: ["key", "title"],
          properties: {
            key: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
          },
        }),
        responses: { "200": successEnvelope("Game created", { $ref: "#/components/schemas/GameMutationResponse" }) },
      }),
    }),
    "/admin/games/{id}": pathItem({
      put: operation({
        summary: "Update game",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        parameters: [pathParam("id", "Game id")],
        requestBody: jsonBody({ type: "object", properties: { title: { type: "string" }, description: { type: "string" } } }),
        responses: { "200": successEnvelope("Game updated", { $ref: "#/components/schemas/GameMutationResponse" }) },
      }),
      delete: operation({
        summary: "Soft delete game",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        parameters: [pathParam("id", "Game id")],
        responses: { "200": successEnvelope("Game deleted", { $ref: "#/components/schemas/GameMutationResponse" }) },
      }),
    }),
    "/admin/games/{id}/restore": pathItem({
      post: operation({
        summary: "Restore game",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        parameters: [pathParam("id", "Game id")],
        responses: { "200": successEnvelope("Game restored", { $ref: "#/components/schemas/GameMutationResponse" }) },
      }),
    }),
    "/admin/courses": pathItem({
      get: operation({
        summary: "List admin courses",
        tags: ["Admin", "Courses"],
        security: adminSecurity,
        responses: { "200": successEnvelope("Admin courses", { $ref: "#/components/schemas/AdminCoursesResponse" }) },
      }),
      post: operation({
        summary: "Create course",
        tags: ["Admin", "Courses"],
        security: adminSecurity,
        requestBody: jsonBody({ type: "object", properties: { title: { type: "string" }, description: { type: "string" }, games: { type: "array", items: { type: "object" } } } }),
        responses: { "200": successEnvelope("Course created", { $ref: "#/components/schemas/CourseMutationResponse" }) },
      }),
    }),
    "/admin/courses/{id}": pathItem({
      put: operation({
        summary: "Update course",
        tags: ["Admin", "Courses"],
        security: adminSecurity,
        parameters: [pathParam("id", "Course id")],
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: { "200": successEnvelope("Course updated", { $ref: "#/components/schemas/CourseMutationResponse" }) },
      }),
      delete: operation({
        summary: "Soft delete course",
        tags: ["Admin", "Courses"],
        security: adminSecurity,
        parameters: [pathParam("id", "Course id")],
        responses: { "200": successEnvelope("Course deleted", { $ref: "#/components/schemas/CourseMutationResponse" }) },
      }),
    }),
    "/admin/courses/{id}/restore": pathItem({
      post: operation({
        summary: "Restore course",
        tags: ["Admin", "Courses"],
        security: adminSecurity,
        parameters: [pathParam("id", "Course id")],
        responses: { "200": successEnvelope("Course restored", { $ref: "#/components/schemas/CourseMutationResponse" }) },
      }),
    }),
    "/admin/courses/{courseId}/content": pathItem({
      get: operation({
        summary: "List course content items",
        tags: ["Admin", "Content"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: { "200": successEnvelope("Course content items", { $ref: "#/components/schemas/AdminContentItemsResponse" }) },
      }),
      post: operation({
        summary: "Create course content item",
        tags: ["Admin", "Content"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({ type: "object", properties: { type: { type: "string", enum: ["video", "game"] }, refId: { type: "string" }, order: { type: "number" }, title: { type: "string" }, description: { type: "string" }, durationMinutes: { type: "number" }, isFree: { type: "boolean" } } }),
        responses: { "200": successEnvelope("Content item created", { $ref: "#/components/schemas/ContentItemMutationResponse" }) },
      }),
    }),
    "/admin/courses/{courseId}/content/reorder": pathItem({
      put: operation({
        summary: "Reorder course content items",
        tags: ["Admin", "Content"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({ type: "object", properties: { items: { type: "array", items: { type: "object", properties: { itemId: { type: "string" }, order: { type: "number" } } } } } }),
        responses: { "200": successEnvelope("Course content reordered", { $ref: "#/components/schemas/AdminContentItemsResponse" }) },
      }),
    }),
    "/admin/content/{itemId}": pathItem({
      put: operation({
        summary: "Update content item",
        tags: ["Admin", "Content"],
        security: adminSecurity,
        parameters: [pathParam("itemId", "Content item id")],
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: { "200": successEnvelope("Content item updated", { $ref: "#/components/schemas/ContentItemMutationResponse" }) },
      }),
      delete: operation({
        summary: "Delete content item",
        tags: ["Admin", "Content"],
        security: adminSecurity,
        parameters: [pathParam("itemId", "Content item id")],
        responses: { "200": successEnvelope("Content item deleted", { $ref: "#/components/schemas/ContentItemMutationResponse" }) },
      }),
    }),
    "/admin/master-course": pathItem({
      post: operation({
        summary: "Create or replace master course",
        tags: ["Admin", "Master Course"],
        security: adminSecurity,
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: { "200": successEnvelope("Master course created", { $ref: "#/components/schemas/MasterCourseResponse" }) },
      }),
      patch: operation({
        summary: "Update master course",
        tags: ["Admin", "Master Course"],
        security: adminSecurity,
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: { "200": successEnvelope("Master course updated", { $ref: "#/components/schemas/MasterCourseResponse" }) },
      }),
    }),
    "/admin/master-course/upload-url": pathItem({
      post: operation({
        summary: "Create Bunny upload URL for master course video",
        tags: ["Admin", "Video"],
        security: adminSecurity,
        requestBody: jsonBody({ type: "object", properties: { title: { type: "string" }, description: { type: "string" } } }),
        responses: { "200": successEnvelope("Master course upload url", { $ref: "#/components/schemas/BunnyUploadResponse" }) },
      }),
    }),
    "/admin/courses/{courseId}/videos/upload-url": pathItem({
      post: operation({
        summary: "Create Bunny upload URL for course video",
        tags: ["Admin", "Video"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({ type: "object", properties: { title: { type: "string" }, description: { type: "string" }, order: { type: "number" } } }),
        responses: { "200": successEnvelope("Course video upload url", { $ref: "#/components/schemas/BunnyUploadResponse" }) },
      }),
    }),
    "/admin/videos/{videoId}": pathItem({
      patch: operation({
        summary: "Update video metadata",
        tags: ["Admin", "Video"],
        security: adminSecurity,
        parameters: [pathParam("videoId", "Video id")],
        requestBody: jsonBody({ type: "object", additionalProperties: true }),
        responses: { "200": successEnvelope("Video updated", { $ref: "#/components/schemas/VideoMutationResponse" }) },
      }),
      delete: operation({
        summary: "Delete video",
        tags: ["Admin", "Video"],
        security: adminSecurity,
        parameters: [pathParam("videoId", "Video id")],
        responses: { "200": successEnvelope("Video deleted", { $ref: "#/components/schemas/VideoMutationResponse" }) },
      }),
    }),
    "/admin/submissions/{submissionId}": pathItem({
      delete: operation({
        summary: "Delete submission",
        tags: ["Admin", "Games"],
        security: adminSecurity,
        parameters: [pathParam("submissionId", "Submission id")],
        responses: { "200": successEnvelope("Submission deleted", { $ref: "#/components/schemas/DeleteAcknowledgement" }) },
      }),
    }),
    "/admin/comments/{commentId}": pathItem({
      delete: operation({
        summary: "Delete comment",
        tags: ["Admin", "Comments"],
        security: adminSecurity,
        parameters: [pathParam("commentId", "Comment id")],
        responses: { "200": successEnvelope("Comment deleted", { $ref: "#/components/schemas/DeleteAcknowledgement" }) },
      }),
    }),
    "/admin/commerce/revenue": pathItem({
      get: operation({
        summary: "Get revenue summary",
        tags: ["Admin", "Commerce"],
        security: adminSecurity,
        parameters: [queryParam("region", "Region filter")],
        responses: { "200": successEnvelope("Revenue summary", { $ref: "#/components/schemas/RevenueSummaryResponse" }) },
      }),
    }),
    "/admin/commerce/purchases": pathItem({
      get: operation({
        summary: "List purchases",
        tags: ["Admin", "Commerce"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer" }),
          queryParam("limit", "Limit", { type: "integer" }),
          queryParam("status", "Purchase status", { type: "string", enum: ["pending", "active", "expired", "cancelled", "refunded"] }),
          queryParam("region", "Region"),
          queryParam("courseId", "Course id"),
        ],
        responses: { "200": successEnvelope("Admin purchases", { $ref: "#/components/schemas/AdminPurchasesResponse" }) },
      }),
    }),
    "/admin/commerce/purchases/{purchaseId}": pathItem({
      get: operation({
        summary: "Get purchase detail",
        tags: ["Admin", "Commerce"],
        security: adminSecurity,
        parameters: [pathParam("purchaseId", "Purchase id")],
        responses: { "200": successEnvelope("Admin purchase detail", { $ref: "#/components/schemas/AdminPurchaseDetailResponse" }) },
      }),
    }),
    "/admin/commerce/purchases/{purchaseId}/refund": pathItem({
      post: operation({
        summary: "Refund purchase",
        tags: ["Admin", "Commerce"],
        security: adminSecurity,
        parameters: [pathParam("purchaseId", "Purchase id")],
        requestBody: jsonBody({
          type: "object",
          required: ["reason"],
          properties: {
            reason: { type: "string", enum: ["duplicate", "fraudulent", "requested_by_customer", "other"] },
            notes: { type: "string" },
            partialAmount: { type: "number" },
          },
        }),
        responses: { "200": successEnvelope("Purchase refunded", { $ref: "#/components/schemas/PurchaseRefundResponse" }) },
      }),
    }),
    "/admin/commerce/notifications/process-subscriptions": pathItem({
      post: operation({
        summary: "Process subscription notifications",
        tags: ["Admin", "Commerce"],
        security: adminSecurity,
        requestBody: jsonBody({
          type: "object",
          properties: {
            daysBeforeExpiry: { type: "integer", minimum: 1, maximum: 30 },
          },
        }, false),
        responses: { "200": successEnvelope("Subscription notifications processed", { $ref: "#/components/schemas/SubscriptionNotificationProcessResponse" }) },
      }),
    }),
    "/admin/commerce/courses/{courseId}/pricing": pathItem({
      get: operation({
        summary: "List course pricing by region",
        tags: ["Admin", "Commerce", "Pricing"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        responses: { "200": successEnvelope("Course pricing list", { $ref: "#/components/schemas/AdminCoursePricingListResponse" }) },
      }),
      put: operation({
        summary: "Upsert course pricing",
        tags: ["Admin", "Commerce", "Pricing"],
        security: adminSecurity,
        parameters: [pathParam("courseId", "Course id")],
        requestBody: jsonBody({
          type: "object",
          required: ["region", "currency", "amount6mo", "amount1yr"],
          properties: {
            region: { type: "string" },
            currency: { type: "string" },
            amount6mo: { type: "number" },
            amount1yr: { type: "number" },
            stripeProductId6mo: { type: "string" },
            stripeProductId1yr: { type: "string" },
            stripePriceId6mo: { type: "string" },
            stripePriceId1yr: { type: "string" },
          },
        }),
        responses: { "200": successEnvelope("Pricing upserted", { $ref: "#/components/schemas/CoursePricingMutationResponse" }) },
      }),
    }),
    "/admin/commerce/promotions": pathItem({
      get: operation({
        summary: "List promotions",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        parameters: [
          queryParam("page", "Page", { type: "integer" }),
          queryParam("limit", "Limit", { type: "integer" }),
          queryParam("q", "Search"),
          queryParam("status", "Status", { type: "string", enum: ["active", "scheduled", "expired", "inactive", "archived"] }),
          queryParam("courseId", "Course id"),
        ],
        responses: { "200": successEnvelope("Promotions", { $ref: "#/components/schemas/PromotionListResponse" }) },
      }),
      post: operation({
        summary: "Create promotion",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        requestBody: jsonBody({ $ref: "#/components/schemas/PromotionUpsert" }),
        responses: { "200": successEnvelope("Promotion created", { $ref: "#/components/schemas/PromotionResponse" }) },
      }),
    }),
    "/admin/commerce/promotions/summary": pathItem({
      get: operation({
        summary: "Get promotions summary",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        responses: { "200": successEnvelope("Promotion summary", { $ref: "#/components/schemas/PromotionSummaryResponse" }) },
      }),
    }),
    "/admin/commerce/promotions/{promotionId}": pathItem({
      get: operation({
        summary: "Get promotion detail",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        parameters: [pathParam("promotionId", "Promotion id")],
        responses: { "200": successEnvelope("Promotion detail", { $ref: "#/components/schemas/PromotionResponse" }) },
      }),
      put: operation({
        summary: "Update promotion",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        parameters: [pathParam("promotionId", "Promotion id")],
        requestBody: jsonBody({ $ref: "#/components/schemas/PromotionUpsert" }),
        responses: { "200": successEnvelope("Promotion updated", { $ref: "#/components/schemas/PromotionResponse" }) },
      }),
      delete: operation({
        summary: "Archive promotion",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        parameters: [pathParam("promotionId", "Promotion id")],
        responses: { "200": successEnvelope("Promotion archived", { $ref: "#/components/schemas/PromotionResponse" }) },
      }),
    }),
    "/admin/commerce/promotions/{promotionId}/restore": pathItem({
      post: operation({
        summary: "Restore promotion",
        tags: ["Admin", "Commerce", "Promotions"],
        security: adminSecurity,
        parameters: [pathParam("promotionId", "Promotion id")],
        responses: { "200": successEnvelope("Promotion restored", { $ref: "#/components/schemas/PromotionResponse" }) },
      }),
    }),
    "/webhooks/stripe": pathItem({
      post: operation({
        summary: "Stripe webhook",
        tags: ["Webhooks"],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: { "200": successEnvelope("Stripe webhook processed", { $ref: "#/components/schemas/WebhookProcessResponse" }) },
      }),
    }),
    "/webhooks/bunny/stream": pathItem({
      post: operation({
        summary: "Bunny stream webhook",
        tags: ["Webhooks"],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true },
            },
          },
        },
        responses: { "200": successEnvelope("Bunny webhook processed", { $ref: "#/components/schemas/WebhookProcessResponse" }) },
      }),
    }),
  };

  return {
    openapi: "3.1.0",
    info: {
      title: "YourBeep Backend API",
      version: "0.1.0",
      description:
        "Generated OpenAPI spec for the Bun-based YourBeep backend gateway and services.",
    },
    servers: [
      {
        url: `${env.GATEWAY_URL}/v1`,
        description: "Gateway v1",
      },
    ],
    tags: [
      { name: "Auth" },
      { name: "Users" },
      { name: "Dashboard" },
      { name: "Notifications" },
      { name: "Courses" },
      { name: "Content" },
      { name: "Comments" },
      { name: "Support" },
      { name: "Contact" },
      { name: "Platform" },
      { name: "Games" },
      { name: "Video" },
      { name: "Master Course" },
      { name: "Commerce" },
      { name: "Pricing" },
      { name: "Promotions" },
      { name: "Admin" },
      { name: "Webhooks" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "Firebase ID Token",
        },
      },
      schemas: {
        ErrorEnvelope: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "VALIDATION_ERROR" },
                message: { type: "string", example: "Validation failed" },
              },
            },
          },
          required: ["success", "error"],
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 20 },
            total: { type: "integer", example: 100 },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6821usr001" },
            firebaseUid: { type: "string", example: "firebase_uid_123" },
            name: { type: "string", example: "Alolika" },
            email: { type: "string", format: "email", example: "user@example.com" },
            avatar: { type: "string", format: "uri", nullable: true, example: "https://cdn.app.com/avatar.jpg" },
            timezone: { type: "string", example: "Asia/Calcutta" },
            role: { type: "string", enum: ["user", "admin"], example: "user" },
            userLevel: { type: "number", example: 2 },
            points: { type: "number", example: 440 },
            streakDays: { type: "number", example: 7 },
            badges: { type: "array", items: { type: "string" }, example: ["consistent_learner"] },
            region: { type: "string", nullable: true, example: "IN" },
            phoneCountryCode: { type: "string", nullable: true, example: "+91" },
            isActive: { type: "boolean", example: true },
            lastActiveAt: { type: "string", format: "date-time", example: "2026-05-10T07:30:29.365Z" },
            createdAt: { type: "string", format: "date-time", example: "2026-01-10T07:30:29.365Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-05-10T07:30:29.365Z" },
          },
        },
        AdminUserDetail: {
          type: "object",
          properties: {
            _id: { type: "string" },
            firebaseUid: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            avatar: { type: "string", nullable: true },
            timezone: { type: "string" },
            region: { type: "string", nullable: true },
            role: { type: "string", enum: ["user", "admin"] },
            isActive: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            lastLoginAt: { type: "string", format: "date-time" },
            progression: {
              type: "object",
              properties: {
                level: { type: "integer", example: 3 },
                totalXp: { type: "integer", example: 1240 },
                currentXp: { type: "integer", example: 240 },
                nextLevelXp: { type: "integer", example: 500 },
                progressPercentage: { type: "integer", example: 48 },
                streakDays: { type: "integer", example: 7 },
                badges: { type: "array", items: { type: "string" }, example: ["consistent_learner"] },
              },
            },
            stats: {
              type: "object",
              properties: {
                enrolledCourses: { type: "integer", example: 2 },
                activeCourses: { type: "integer", example: 1 },
                completedCourses: { type: "integer", example: 1 },
                averageCompletionRate: { type: "integer", example: 74 },
                courseCompletionRate: { type: "integer", example: 74 },
                totalMoneySpent: { type: "number", example: 1998 },
                totalOrders: { type: "integer", example: 2 },
                activePurchases: { type: "integer", example: 1 },
                refundedPurchases: { type: "integer", example: 0 },
                lastPurchaseAt: { type: "string", format: "date-time", example: "2026-04-28T10:15:00.000Z" },
              },
            },
            enrolledCourses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  courseId: { type: "string", example: "6821b2c1a1b2c3d4e5f67890" },
                  title: { type: "string", example: "Behavioural Signal Intelligence" },
                  thumbnail: { type: "string", nullable: true, example: "https://cdn.app.com/course-thumb.jpg" },
                  durationMinutes: { type: "number", nullable: true, example: 120 },
                  status: { type: "string", example: "active" },
                  planType: { type: "string", example: "annual" },
                  expiryDate: { type: "string", format: "date-time", nullable: true, example: "2027-04-28T10:15:00.000Z" },
                  percentComplete: { type: "integer", example: 63 },
                  contentCompleted: { type: "integer", example: 5 },
                  contentTotal: { type: "integer", example: 8 },
                  gamesCompleted: { type: "integer", example: 3 },
                  gamesTotal: { type: "integer", example: 4 },
                  finalCourseScore: { type: "number", nullable: true, example: 2.35 },
                  nextItem: {
                    type: "object",
                    nullable: true,
                    properties: {
                      itemId: { type: "string", example: "6821b2c1a1b2c3d4e5f67891" },
                      title: { type: "string", example: "Reflect & Act Activity" },
                      type: { type: "string", example: "game" },
                      order: { type: "integer", example: 6 },
                    },
                  },
                  lastCompletedAt: { type: "string", format: "date-time", nullable: true, example: "2026-05-08T09:30:00.000Z" },
                },
              },
            },
            learningTrend: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string", example: "Jan" },
                  completions: { type: "integer", example: 6 },
                  watchMinutes: { type: "integer", example: 84 },
                },
              },
            },
            paymentHistory: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6821b2c1a1b2c3d4e5f67892" },
                  courseId: { type: "string", example: "6821b2c1a1b2c3d4e5f67890" },
                  planType: { type: "string", example: "annual" },
                  status: { type: "string", example: "active" },
                  region: { type: "string", example: "IN" },
                  currency: { type: "string", example: "INR" },
                  originalAmount: { type: "number", example: 999 },
                  discountAmount: { type: "number", example: 0 },
                  amountPaid: { type: "number", example: 999 },
                  promotionCode: { type: "string", nullable: true, example: null },
                  accessGranted: { type: "boolean", example: true },
                  startDate: { type: "string", format: "date-time", nullable: true, example: "2026-04-28T10:15:00.000Z" },
                  expiryDate: { type: "string", format: "date-time", nullable: true, example: "2027-04-28T10:15:00.000Z" },
                  purchasedAt: { type: "string", format: "date-time", nullable: true, example: "2026-04-28T10:15:00.000Z" },
                  renewedFromId: { type: "string", nullable: true, example: null },
                  stripeRefundId: { type: "string", nullable: true, example: null },
                },
              },
            },
            recentActivity: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string", example: "6821b2c1a1b2c3d4e5f67893" },
                  type: { type: "string", example: "video_watch" },
                  title: { type: "string", example: "The Vagal Tone Shift watched" },
                  courseId: { type: "string", nullable: true, example: "6821b2c1a1b2c3d4e5f67890" },
                  gameKey: { type: "string", nullable: true, example: null },
                  createdAt: { type: "string", format: "date-time", example: "2026-05-10T07:30:29.365Z" },
                  metadata: { type: "object", additionalProperties: true },
                },
              },
            },
          },
        },
        FcmTokenResponse: {
          type: "object",
          properties: {
            fcmTokens: {
              type: "array",
              items: { type: "string" },
              example: ["fcm_web_token_123", "fcm_ios_token_456"],
            },
          },
        },
        CommentListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6821cmt001" },
                  body: { type: "string", example: "This exercise helped me understand the pattern clearly." },
                  parentCommentId: { type: "string", nullable: true, example: null },
                  author: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "6821usr001" },
                      name: { type: "string", example: "Alolika" },
                      avatar: { type: "string", nullable: true, example: "https://cdn.app.com/avatar.jpg" },
                    },
                  },
                  createdAt: { type: "string", format: "date-time", example: "2026-05-10T09:00:00.000Z" },
                },
              },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        CommentMutationResponse: {
          type: "object",
          properties: {
            comment: {
              type: "object",
              properties: {
                _id: { type: "string", example: "6821cmt001" },
                body: { type: "string", example: "This exercise helped me understand the pattern clearly." },
                courseId: { type: "string", example: "6821course001" },
                contentItemId: { type: "string", nullable: true, example: null },
                parentCommentId: { type: "string", nullable: true, example: null },
                createdAt: { type: "string", format: "date-time", example: "2026-05-10T09:00:00.000Z" },
              },
            },
          },
        },
        CourseContentResponse: {
          type: "object",
          properties: {
            courseId: { type: "string", example: "6821course001" },
            title: { type: "string", example: "Behavioural Signal Intelligence" },
            contentItems: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "6821item001" },
                  order: { type: "integer", example: 1 },
                  type: { type: "string", enum: ["video", "game"], example: "video" },
                  refId: { type: "string", example: "6821video001" },
                  title: { type: "string", example: "Welcome to the Course" },
                  description: { type: "string", nullable: true, example: "Introduction to the journey." },
                  durationMinutes: { type: "number", nullable: true, example: 5 },
                  isFree: { type: "boolean", example: true },
                  videoId: { type: "string", nullable: true, example: "6821video001" },
                  bunnyVideoId: { type: "string", nullable: true, example: "bunny-guid-123" },
                  interactiveCueCount: { type: "integer", example: 1 },
                  userStatus: { type: "string", example: "completed" },
                },
              },
            },
            progress: {
              type: "object",
              properties: {
                completed: { type: "integer", example: 3 },
                total: { type: "integer", example: 8 },
                percentComplete: { type: "integer", example: 38 },
              },
            },
          },
        },
        MasterCourseResponse: {
          type: "object",
          properties: {
            title: { type: "string", example: "The Monthly Master Course" },
            description: { type: "string", example: "A free guided class available to all registered users." },
            videoId: { type: "string", example: "6821video999" },
            bunnyVideoId: { type: "string", example: "bunny-master-guid" },
            thumbnail: { type: "string", nullable: true, example: "https://cdn.app.com/master-course-thumb.jpg" },
            durationSeconds: { type: "integer", example: 1800 },
            playbackStatus: { type: "string", example: "ready" },
            streamEndpoint: { type: "string", example: "/master-course/stream" },
            updatedAt: { type: "string", format: "date-time", example: "2026-05-10T08:30:00.000Z" },
          },
        },
        VideoStreamResponse: {
          type: "object",
          properties: {
            streamUrl: { type: "string", example: "https://yourbeep.b-cdn.net/guid/playlist.m3u8?token=abc123&expires=1730000000" },
            expiresIn: { type: "integer", example: 3600 },
            title: { type: "string", example: "Understanding Your Nervous System" },
            durationSeconds: { type: "integer", example: 720 },
            thumbnailUrl: { type: "string", nullable: true, example: "https://cdn.app.com/video-thumb.jpg" },
            interactiveCues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  triggerAtSeconds: { type: "integer", example: 510 },
                  gameId: { type: "string", example: "6821game001" },
                  gameKey: { type: "string", example: "awareness_states" },
                  gameTitle: { type: "string", example: "Awareness States" },
                  title: { type: "string", example: "Pause and Reflect" },
                  description: { type: "string", example: "Complete the activity before moving on." },
                  ctaLabel: { type: "string", example: "Start Activity" },
                  pauseVideo: { type: "boolean", example: true },
                  isSkippable: { type: "boolean", example: false },
                },
              },
            },
          },
        },
        VideoWatchEventResponse: {
          type: "object",
          properties: {
            videoId: { type: "string", example: "6821video001" },
            watchedSeconds: { type: "integer", example: 540 },
            positionSeconds: { type: "integer", nullable: true, example: 540 },
            completed: { type: "boolean", example: true },
          },
        },
        GameSubmissionResponse: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6821sub001" },
            type: { type: "string", example: "pattern_awareness" },
            score: { type: "number", example: 2.33 },
            isComplete: { type: "boolean", example: true },
            resultData: {
              type: "object",
              additionalProperties: true,
              example: {
                presenceScore: 2.33,
                actionScore: 2.67,
                patternScore: 2,
                overallScore: 2.33,
              },
            },
            finalCourseScore: {
              type: "object",
              nullable: true,
              properties: {
                finalScore: { type: "number", example: 2.22 },
                scaleMax: { type: "number", example: 3 },
              },
            },
          },
        },
        GameResultResponse: {
          type: "object",
          additionalProperties: true,
          example: {
            sections: {
              emotionalState: { score: 2, label: "Waver", source: "awareness_states" },
              physiology: { score: 2, label: "Mixed", source: "somatic_states" },
              action: { score: 3, label: "High", source: "pattern_awareness" },
            },
            totals: { sum: 10, average: 2, percentage: "66%", maxPossible: 15 },
            recommendedAction: "remediation",
          },
        },
        GameActivityResponse: {
          type: "object",
          properties: {
            activityKey: { type: "string", example: "jaw_awareness_reset" },
            title: { type: "string", example: "Jaw Awareness Exercise" },
            subtitle: { type: "string", example: "Releasing Tension" },
            type: { type: "string", example: "timed_exercise" },
            instruction: { type: "string", example: "Drop the lower jaw and allow a small gap." },
            durationSeconds: { type: "integer", example: 180 },
            canSkip: { type: "boolean", example: true },
          },
        },
        CourseSubmissionsResponse: {
          type: "object",
          properties: {
            submissions: { type: "array", items: { $ref: "#/components/schemas/GameSubmissionResponse" } },
            finalCourseScore: {
              type: "object",
              properties: {
                finalScore: { type: "number", example: 2.22 },
                scaleMax: { type: "number", example: 3 },
              },
            },
          },
        },
        SubmissionDetailResponse: {
          allOf: [{ $ref: "#/components/schemas/GameSubmissionResponse" }],
        },
        CourseAccessResponse: {
          type: "object",
          properties: {
            hasAccess: { type: "boolean", example: true },
            purchase: {
              type: "object",
              properties: {
                purchaseId: { type: "string", example: "6821pur001" },
                planType: { type: "string", example: "annual" },
                status: { type: "string", example: "active" },
                startDate: { type: "string", format: "date-time", example: "2026-05-10T10:00:00.000Z" },
                expiryDate: { type: "string", format: "date-time", example: "2027-05-10T10:00:00.000Z" },
                daysRemaining: { type: "integer", example: 365 },
              },
            },
          },
        },
        CheckoutInitiatedResponse: {
          type: "object",
          properties: {
            checkoutUrl: { type: "string", example: "https://checkout.stripe.com/c/pay/cs_test_123" },
            sessionId: { type: "string", example: "cs_test_123" },
            purchaseId: { type: "string", example: "6821pur001" },
            originalAmount: { type: "number", example: 7999 },
            discountAmount: { type: "number", example: 1600 },
            finalAmount: { type: "number", example: 6399 },
            appliedPromotion: {
              type: "object",
              nullable: true,
              additionalProperties: true,
              example: { code: "LAUNCH20", discountType: "percentage", discountValue: 20 },
            },
            expiresAt: { type: "string", format: "date-time", example: "2026-05-10T12:00:00.000Z" },
          },
        },
        PurchaseConfirmedResponse: {
          type: "object",
          properties: {
            purchaseId: { type: "string", example: "6821pur001" },
            status: { type: "string", example: "active" },
            accessGranted: { type: "boolean", example: true },
            startDate: { type: "string", format: "date-time", example: "2026-05-10T10:00:00.000Z" },
            expiryDate: { type: "string", format: "date-time", example: "2027-05-10T10:00:00.000Z" },
          },
        },
        PromotionPreviewResponse: {
          type: "object",
          properties: {
            originalAmount: { type: "number", example: 7999 },
            discountAmount: { type: "number", example: 1600 },
            finalAmount: { type: "number", example: 6399 },
            appliedPromotion: {
              type: "object",
              nullable: true,
              additionalProperties: true,
              example: {
                id: "6821promo001",
                name: "Launch Offer",
                code: "LAUNCH20",
                discountType: "percentage",
                discountValue: 20,
              },
            },
          },
        },
        CoursePricingResponse: {
          type: "object",
          properties: {
            region: { type: "string", example: "IN" },
            currency: { type: "string", example: "INR" },
            amount6mo: { type: "number", example: 4999 },
            amount1yr: { type: "number", example: 7999 },
            displayPrice6mo: { type: "string", example: "INR 4,999" },
            displayPrice1yr: { type: "string", example: "INR 7,999" },
          },
        },
        AdminDashboardResponse: {
          type: "object",
          properties: {
            stats: {
              type: "object",
              additionalProperties: true,
              example: {
                totalUsers: { value: 15482, changePercent: 5.2 },
                activeUsers: { value: 8234, changePercent: 1.4 },
              },
            },
            weeklyActivity: { type: "array", items: { type: "object" } },
            revenueChart: { type: "array", items: { type: "object" } },
            userGrowth: { type: "array", items: { type: "object" } },
            platformUsage: { type: "object", additionalProperties: true },
            recentActivity: { type: "array", items: { type: "object" } },
            systemStatus: { type: "object", additionalProperties: true },
            students: { type: "object", additionalProperties: true },
          },
        },
        UsersListResponse: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/User" } },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        UserMutationResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
          },
        },
        NotificationBroadcastResponse: {
          type: "object",
          properties: {
            successCount: { type: "integer", example: 1200 },
            failureCount: { type: "integer", example: 12 },
            invalidTokenCount: { type: "integer", example: 4 },
          },
        },
        NotificationCenterSummaryResponse: {
          type: "object",
          properties: {
            campaignsSent: { type: "integer", example: 24 },
            totalDelivered: { type: "integer", example: 10420 },
            totalFailures: { type: "integer", example: 87 },
          },
        },
        NotificationCampaignListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                example: {
                  _id: "6821camp001",
                  title: "Premium Reminder",
                  status: "sent",
                  targetedUsersCount: 320,
                },
              },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        NotificationCampaignResponse: {
          type: "object",
          properties: {
            campaign: {
              type: "object",
              additionalProperties: true,
              example: {
                _id: "6821camp001",
                title: "Premium Reminder",
                body: "Continue your reflective practice today.",
                status: "sent",
              },
            },
          },
        },
        NotificationAudiencePreviewResponse: {
          type: "object",
          properties: {
            matchedUsers: { type: "integer", example: 320 },
            tokenCount: { type: "integer", example: 410 },
          },
        },
        GamesListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                example: { _id: "6821game001", key: "awareness_states", title: "Awareness States", isActive: true },
              },
            },
          },
        },
        GameMutationResponse: {
          type: "object",
          properties: {
            game: {
              type: "object",
              additionalProperties: true,
              example: { _id: "6821game001", key: "awareness_states", title: "Awareness States", isActive: true },
            },
          },
        },
        AdminCoursesResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                example: { _id: "6821course001", title: "Behavioural Signal Intelligence", isPublished: true },
              },
            },
          },
        },
        CourseMutationResponse: {
          type: "object",
          properties: {
            course: {
              type: "object",
              additionalProperties: true,
              example: { _id: "6821course001", title: "Behavioural Signal Intelligence", isPublished: false },
            },
          },
        },
        AdminContentItemsResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                example: { _id: "6821item001", type: "video", order: 1, title: "Welcome to the Course" },
              },
            },
          },
        },
        ContentItemMutationResponse: {
          type: "object",
          properties: {
            item: {
              type: "object",
              additionalProperties: true,
              example: { _id: "6821item001", type: "video", order: 1, title: "Welcome to the Course" },
            },
          },
        },
        BunnyUploadResponse: {
          type: "object",
          properties: {
            uploadUrl: { type: "string", example: "https://video.bunnycdn.com/library/123/videos/guid" },
            videoId: { type: "string", example: "6821video001" },
            bunnyVideoId: { type: "string", example: "bunny-guid-123" },
            method: { type: "string", example: "PUT" },
            headers: { type: "object", additionalProperties: true, example: { AccessKey: "BUNNY_API_KEY", "Content-Type": "video/mp4" } },
            note: { type: "string", example: "Upload directly from admin client to this URL using PUT" },
          },
        },
        VideoMutationResponse: {
          type: "object",
          properties: {
            video: {
              type: "object",
              additionalProperties: true,
              example: { _id: "6821video001", title: "Welcome to the Course", order: 1, isActive: true },
            },
          },
        },
        DeleteAcknowledgement: {
          type: "object",
          properties: {
            deleted: { type: "boolean", example: true },
          },
        },
        RevenueSummaryResponse: {
          type: "object",
          properties: {
            grossRevenue: { type: "number", example: 45200 },
            activeCount: { type: "integer", example: 123 },
            refundedCount: { type: "integer", example: 4 },
          },
        },
        AdminPurchasesResponse: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/Purchase" } },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        AdminPurchaseDetailResponse: {
          type: "object",
          properties: {
            purchase: { $ref: "#/components/schemas/Purchase" },
          },
        },
        PurchaseRefundResponse: {
          type: "object",
          properties: {
            purchaseId: { type: "string", example: "6821pur001" },
            stripeRefundId: { type: "string", example: "re_123" },
            amountRefunded: { type: "number", example: 999 },
            currency: { type: "string", example: "INR" },
            status: { type: "string", example: "refunded" },
            accessRevoked: { type: "boolean", example: true },
            revokedAt: { type: "string", format: "date-time", example: "2026-05-10T12:30:00.000Z" },
          },
        },
        SubscriptionNotificationProcessResponse: {
          type: "object",
          properties: {
            daysBeforeExpiry: { type: "integer", example: 7 },
            expiringProcessed: { type: "integer", example: 18 },
            expiredProcessed: { type: "integer", example: 4 },
          },
        },
        AdminCoursePricingListResponse: {
          type: "object",
          properties: {
            items: { type: "array", items: { $ref: "#/components/schemas/CoursePricingResponse" } },
          },
        },
        CoursePricingMutationResponse: {
          allOf: [{ $ref: "#/components/schemas/CoursePricingResponse" }],
        },
        PromotionListResponse: {
          type: "object",
          properties: {
            items: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
                example: { _id: "6821promo001", code: "LAUNCH20", name: "Launch Offer", isActive: true },
              },
            },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        PromotionResponse: {
          type: "object",
          properties: {
            promotion: {
              type: "object",
              additionalProperties: true,
              example: { _id: "6821promo001", code: "LAUNCH20", discountType: "percentage", percentageOff: 20 },
            },
          },
        },
        PromotionSummaryResponse: {
          type: "object",
          properties: {
            total: { type: "integer", example: 6 },
            active: { type: "integer", example: 3 },
            scheduled: { type: "integer", example: 1 },
            expired: { type: "integer", example: 1 },
            archived: { type: "integer", example: 1 },
            currentMonthDiscountGiven: { type: "number", example: 5200 },
          },
        },
        WebhookProcessResponse: {
          type: "object",
          properties: {
            processed: { type: "boolean", example: true },
            eventType: { type: "string", example: "checkout.session.completed" },
            purchaseId: { type: "string", nullable: true, example: "6821pur001" },
          },
        },
        Purchase: {
          type: "object",
          properties: {
            _id: { type: "string" },
            courseId: { type: "string" },
            planType: { type: "string", enum: ["six_month", "annual"] },
            status: { type: "string", enum: ["pending", "active", "expired", "cancelled", "refunded"] },
            region: { type: "string" },
            currency: { type: "string" },
            originalAmount: { type: "number" },
            discountAmount: { type: "number" },
            amountPaid: { type: "number" },
            promotionCode: { type: "string", nullable: true },
            accessGranted: { type: "boolean" },
            startDate: { type: "string", format: "date-time", nullable: true },
            expiryDate: { type: "string", format: "date-time", nullable: true },
            purchasedAt: { type: "string", format: "date-time", nullable: true },
          },
        },
        CourseListItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string", nullable: true },
            shortDescription: { type: "string", nullable: true },
            thumbnail: { type: "string", nullable: true },
            durationMinutes: { type: "number", nullable: true },
            pricing: { type: "object", nullable: true },
            userProgress: { type: "object", nullable: true },
          },
        },
        CourseDetail: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string", nullable: true },
            description: { type: "string" },
            shortDescription: { type: "string", nullable: true },
            thumbnail: { type: "string", nullable: true },
            trailerVideoId: { type: "string", nullable: true },
            games: { type: "array", items: { type: "object" } },
            contentItems: { type: "array", items: { type: "object" } },
          },
        },
        ActivityLog: {
          type: "object",
          properties: {
            _id: { type: "string" },
            userId: { type: "string" },
            courseId: { type: "string", nullable: true },
            gameKey: { type: "string", nullable: true },
            type: { type: "string" },
            title: { type: "string" },
            metadata: { type: "object", additionalProperties: true },
            completedAt: { type: "string", format: "date-time" },
          },
        },
        SupportTicketCreate: {
          type: "object",
          required: ["type", "subject", "description"],
          properties: {
            type: {
              type: "string",
              enum: [
                "refund_related",
                "account_access",
                "course_access",
                "video_access",
                "payment_issue",
                "game_issue",
                "technical_issue",
                "general_support",
              ],
            },
            subject: { type: "string", maxLength: 160 },
            description: { type: "string", maxLength: 5000 },
            priority: { type: "string", enum: ["low", "medium", "high", "urgent"] },
            courseId: { type: "string", nullable: true },
            purchaseId: { type: "string", nullable: true },
            videoId: { type: "string", nullable: true },
            gameId: { type: "string", nullable: true },
            attachments: { type: "array", items: { type: "string", format: "uri" } },
          },
        },
        SupportTicket: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6821ticket001" },
            userId: { type: "string", example: "6821usr001" },
            type: { type: "string", example: "video_access" },
            subject: { type: "string", example: "Course video not playing" },
            description: { type: "string", example: "The lesson opens but playback never starts on web." },
            status: { type: "string", example: "open" },
            priority: { type: "string", example: "high" },
            courseId: { type: "string", nullable: true, example: "6821course001" },
            purchaseId: { type: "string", nullable: true, example: "6821pur001" },
            videoId: { type: "string", nullable: true, example: "6821video001" },
            gameId: { type: "string", nullable: true, example: null },
            assignedAdminId: { type: "string", nullable: true, example: null },
            tags: { type: "array", items: { type: "string" }, example: ["video", "urgent"] },
            attachments: { type: "array", items: { type: "string", format: "uri" }, example: ["https://cdn.app.com/screenshot.jpg"] },
            replies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  authorType: { type: "string", enum: ["user", "admin"], example: "user" },
                  authorId: { type: "string", example: "6821usr001" },
                  body: { type: "string", example: "Playback stops at the loading spinner." },
                  attachments: { type: "array", items: { type: "string", format: "uri" }, example: [] },
                  createdAt: { type: "string", format: "date-time", example: "2026-05-10T09:15:00.000Z" },
                },
              },
            },
            createdAt: { type: "string", format: "date-time", example: "2026-05-10T09:10:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-05-10T09:15:00.000Z" },
          },
        },
        ContactRequestCreate: {
          type: "object",
          required: ["name", "email", "topic", "subject", "message"],
          properties: {
            name: { type: "string", maxLength: 120 },
            email: { type: "string", format: "email" },
            topic: {
              type: "string",
              enum: [
                "refund_related",
                "account_access",
                "course_access",
                "video_access",
                "payment_issue",
                "game_issue",
                "technical_issue",
                "general_support",
                "partnership",
                "feedback",
              ],
            },
            subject: { type: "string", maxLength: 160 },
            message: { type: "string", maxLength: 5000 },
            phoneCountryCode: { type: "string", nullable: true },
            userId: { type: "string", nullable: true },
          },
        },
        ContactRequest: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6821contact001" },
            name: { type: "string", example: "Aisha Khan" },
            email: { type: "string", format: "email", example: "aisha@example.com" },
            topic: { type: "string", example: "video_access" },
            subject: { type: "string", example: "Course video not playing" },
            message: { type: "string", example: "The lesson opens but the stream does not start on web." },
            phoneCountryCode: { type: "string", nullable: true, example: "+91" },
            userId: { type: "string", nullable: true, example: "client_reference_123" },
            status: { type: "string", enum: ["new", "reviewed", "replied", "closed"], example: "new" },
            notes: { type: "string", nullable: true, example: null },
            createdAt: { type: "string", format: "date-time", example: "2026-05-10T08:45:00.000Z" },
            updatedAt: { type: "string", format: "date-time", example: "2026-05-10T08:45:00.000Z" },
          },
        },
        AdminTicketSummaryResponse: {
          type: "object",
          properties: {
            open: { type: "integer", example: 12 },
            inProgress: { type: "integer", example: 5 },
            waitingOnUser: { type: "integer", example: 3 },
            resolvedToday: { type: "integer", example: 4 },
            urgent: { type: "integer", example: 2 },
          },
        },
        PlatformFaqItem: {
          type: "object",
          properties: {
            _id: { type: "string" },
            category: { type: "string", example: "courses" },
            question: { type: "string", example: "How do I access a purchased course?" },
            answer: { type: "string", example: "Open the course from your dashboard and continue learning from the content list." },
            order: { type: "integer", example: 1 },
            isPublished: { type: "boolean", example: true },
          },
        },
        LegalDocument: {
          type: "object",
          properties: {
            key: { type: "string", example: "terms_of_service" },
            title: { type: "string", example: "Terms & Conditions" },
            content: { type: "string", example: "These terms govern your use of the platform..." },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PlatformSettingsPublic: {
          type: "object",
          properties: {
            platformName: { type: "string", example: "YourBeep" },
            supportEmail: { type: "string", nullable: true, example: "support@yourbeep.com" },
            supportPhone: { type: "string", nullable: true, example: "+91 90000 00000" },
            supportWhatsapp: { type: "string", nullable: true, example: "+91 90000 00000" },
            contactAddress: { type: "string", nullable: true, example: "Bengaluru, India" },
            socialLinks: { type: "object", additionalProperties: { type: "string" } },
            homeBanner: { type: "object" },
            footer: { type: "object" },
            legal: { type: "object" },
            faqItems: { type: "array", items: { $ref: "#/components/schemas/PlatformFaqItem" } },
            seo: { type: "object" },
            appLinks: { type: "object" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        PlatformSettingsAdmin: {
          allOf: [
            { $ref: "#/components/schemas/PlatformSettingsPublic" },
            {
              type: "object",
              properties: {
                updatedBy: { type: "string", nullable: true },
              },
            },
          ],
        },
        HomeDashboard: {
          type: "object",
          properties: {
            header: {
              type: "object",
              properties: {
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    name: { type: "string" },
                    avatarUrl: { type: "string", nullable: true },
                  },
                },
                greeting: { type: "string" },
                subtitle: { type: "string" },
                notifications: {
                  type: "object",
                  properties: {
                    unreadCount: { type: "integer" },
                  },
                },
              },
            },
            progression: {
              type: "object",
              properties: {
                level: { type: "integer" },
                totalXp: { type: "integer" },
                currentXp: { type: "integer" },
                nextLevelXp: { type: "integer" },
                progressPercentage: { type: "integer" },
                stateTrend: { type: "string" },
                stateDirection: { type: "string" },
              },
            },
            activityEngagement: {
              type: "object",
              properties: {
                observationTime: { type: "object" },
                reflectionTime: { type: "object" },
              },
            },
            metrics: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  subtitle: { type: "string" },
                  score: { type: "number" },
                  unit: { type: "string" },
                  weeklyChange: { type: "number" },
                  trend: { type: "string" },
                  icon: { type: "string" },
                },
              },
            },
            continueLearning: { type: "array", items: { type: "object" } },
            recommendations: { type: "array", items: { type: "object" } },
          },
        },
        NotificationAudience: {
          type: "object",
          required: ["type"],
          properties: {
            type: {
              type: "string",
              enum: ["all_users", "premium_users", "course_purchasers", "specific_users", "region_users"],
            },
            courseId: { type: "string", nullable: true },
            userIds: { type: "array", items: { type: "string" } },
            regions: { type: "array", items: { type: "string" } },
          },
        },
        PromotionUpsert: {
          type: "object",
          required: ["name", "code", "discountType"],
          properties: {
            name: { type: "string" },
            code: { type: "string" },
            description: { type: "string" },
            courseId: { type: "string", nullable: true },
            regions: { type: "array", items: { type: "string" } },
            planTypes: { type: "array", items: { type: "string", enum: ["six_month", "annual"] } },
            discountType: { type: "string", enum: ["percentage", "fixed_amount"] },
            percentageOff: { type: "number", nullable: true },
            amountOff: { type: "number", nullable: true },
            currency: { type: "string", nullable: true },
            autoApply: { type: "boolean" },
            startsAt: { type: "string", format: "date-time", nullable: true },
            endsAt: { type: "string", format: "date-time", nullable: true },
            maxRedemptions: { type: "number", nullable: true },
            perUserLimit: { type: "number" },
            isActive: { type: "boolean" },
          },
        },
      },
    },
    paths,
  };
};

export const renderSwaggerHtml = () => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>YourBeep API Docs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #faf7f2; }
      .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/openapi.json",
        dom_id: "#swagger-ui",
        deepLinking: true,
        persistAuthorization: true,
      });
    </script>
  </body>
</html>`;
