import { attachErrorHandler, buildBaseApp, success } from "@yourbeep/shared";
import { commentRouter } from "./routes/comment.routes";
import { contentItemRouter } from "./routes/content-item.routes";
import { courseRouter } from "./routes/course.routes";
import { gameRouter } from "./routes/game.routes";
import { internalRouter } from "./routes/internal.routes";
import { masterCourseRouter } from "./routes/master-course.routes";
import { submissionRouter } from "./routes/submission.routes";
import { videoRouter } from "./routes/video.routes";
import { videoCueRouter } from "./routes/video-cue.routes";

export const createContentApp = () => {
  const app = buildBaseApp("content-service");

  app.use("/", gameRouter);
  app.use("/", courseRouter);
  app.use("/", commentRouter);
  app.use("/", contentItemRouter);
  app.use("/", masterCourseRouter);
  app.use("/", submissionRouter);
  app.use("/", videoRouter);
  app.use("/", videoCueRouter);
  app.use("/internal", internalRouter);

  attachErrorHandler(app);
  return app;
};
