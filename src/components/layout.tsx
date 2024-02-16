import { ThemeProvider } from "./theme-provider";
import BackButton from "./common/back-button";
import { ModeToggle } from "./mode-toggle";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="fixed top-0 left-0 p-2 w-full flex gap-2 z-20">
        <div className="flex-1 flex gap-2 justify-start">
          <BackButton />
        </div>
        <div className="flex-1 flex gap-2 justify-end">
          <ModeToggle />
        </div>
      </div>
      {/* <div className="w-full h-10" /> */}
      {children}
    </ThemeProvider>
  );
};

export default Layout;
