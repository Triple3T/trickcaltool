import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface StepperProps {
  step: number;
  setStep: (step: number) => void;
  stepTexts: string[];
  disabled?: boolean;
}

const Stepper = ({ step, setStep, stepTexts, disabled }: StepperProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center gap-2 py-4">
      {stepTexts.map((text, i) => {
        return (
          <div
            key={i}
            className={cn(
              "flex flex-col flex-1",
              !disabled && "cursor-pointer"
            )}
          >
            <div
              className={cn(
                "flex justify-start text-lg",
                !disabled && i === step
                  ? "text-foreground"
                  : "text-foreground/50"
              )}
            >
              {i + 1}
            </div>
            <div
              key={i}
              className={cn(
                "flex h-12 text-right text-sm border-t-4 break-keep justify-end p-0.5",
                !disabled && i === step
                  ? "bg-accent/40 border-accent"
                  : "bg-muted/40 border-muted"
              )}
              onClick={() => !disabled && setStep(i)}
            >
              {t(text)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
