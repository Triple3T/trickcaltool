import { ReactNode } from "react";

interface SubtitleBarProps {
  children?: string | ReactNode | ReactNode[];
}

const SubtitleBar = ({ children }: SubtitleBarProps) => {
  return (
    <div className="w-full px-2 py-1 mt-3">
      <div className="w-full rounded-lg bg-accent text-accent-foreground text-center p-0.5">
        {children}
      </div>
    </div>
  );
};

export default SubtitleBar;
