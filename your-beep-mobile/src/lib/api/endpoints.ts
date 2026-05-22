export const apiEndpoints = {
  auth: {
    me: '/auth/me',
    sync: '/auth/sync',
  },
  identity: {
    dashboard: '/users/me/dashboard',
    me: '/users/me',
    progress: '/users/me/progress',
    purchases: '/users/me/purchases',
    stats: '/users/me/stats',
    activityLog: '/users/me/activity-log',
  },
  content: {
    contentComments: (itemId: string) => `/content/${itemId}/comments`,
    courseContent: (courseId: string) => `/courses/${courseId}/content`,
    courseComments: (courseId: string) => `/courses/${courseId}/comments`,
    courseDetail: (courseId: string) => `/courses/${courseId}`,
    coursePrice: (courseId: string) => `/courses/${courseId}/price`,
    coursePriceForRegion: (courseId: string, region: string) => `/courses/${courseId}/price/${region}`,
    courseSubmissions: (courseId: string) => `/courses/${courseId}/submissions`,
    courses: '/courses',
    courseVideoStream: (courseId: string, videoId: string) =>
      `/courses/${courseId}/videos/${videoId}/stream`,
    courseVideoWatchEvent: (courseId: string, videoId: string) =>
      `/courses/${courseId}/videos/${videoId}/watch-event`,
    gameActivity: (gameId: string, activityKey: string) =>
      `/games/${gameId}/activities/${activityKey}`,
    gameResult: (gameId: string) => `/games/${gameId}/result`,
    gameSubmit: (gameId: string) => `/games/${gameId}/submit`,
    masterCourse: '/master-call',
    masterCourseStream: '/master-call/stream',
    submissionDetail: (submissionId: string) => `/submissions/${submissionId}`,
    videoCues: (videoId: string) => `/videos/${videoId}/cues`,
  },
  checkIns: {
    activation: '/check-ins/activation',
    expansion: '/check-ins/expansion',
    rootCauses: '/check-ins/root-causes',
    valueSystems: '/check-ins/value-systems',
  },
  lms: {
    masterclasses: '/lms/masterclasses',
    progress: '/lms/progress',
  },
  notifications: {
    registerDevice: '/notifications/token',
  },
  platform: {
    communityGuidelines: '/platform/legal/community-guidelines',
    cookies: '/platform/legal/cookies',
    privacy: '/platform/legal/privacy',
    refund: '/platform/legal/refund',
    settings: '/platform/settings',
    terms: '/platform/legal/terms',
  },
  programs: {
    detail: (programId: string) => `/programs/${programId}`,
    list: '/programs',
  },
  reflections: {
    daily: '/reflections/daily',
    weekly: '/reflections/weekly',
  },
  support: {
    closeTicket: (ticketId: string) => `/tickets/${ticketId}/close`,
    listTickets: '/tickets',
    createTicket: '/tickets',
    getInTouch: '/get-in-touch',
    replyTicket: (ticketId: string) => `/tickets/${ticketId}/replies`,
    ticketDetail: (ticketId: string) => `/tickets/${ticketId}`,
  },
  somatics: {
    activities: (region: string) => `/somatics/${region}/activities`,
    awarenessTests: (region: string) => `/somatics/${region}/awareness-tests`,
    selection: '/somatics/selection',
  },
} as const;
