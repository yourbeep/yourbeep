import { courseSteps } from "../hooks/useCourseBuilder";

const CourseBuilderStepper = ({ stepIndex, setStep }) => (
  <div className="rounded-[24px] border border-[#e7eadf] bg-white p-4 shadow-sm">
    <div className="space-y-2">
      {courseSteps.map((step, index) => {
        const isActive = index === stepIndex;
        const isComplete = index < stepIndex;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setStep(index)}
            className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left transition ${
              isActive ? "bg-[#f2f7ed]" : "hover:bg-[#fafcf7]"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                isActive
                  ? "bg-[var(--primary)] text-white"
                  : isComplete
                    ? "bg-[#dcebd6] text-[var(--primary)]"
                    : "bg-[#eef1ea] text-[#758273]"
              }`}
            >
              {index + 1}
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${isActive ? "text-[#203321]" : "text-[#314330]"}`}>
                {step.title}
              </p>
              <p className="mt-1 text-xs text-[#74816f]">{step.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default CourseBuilderStepper;
