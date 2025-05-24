import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { changeLanguage } from "@/locale/localize";

export function useLanguageChange() {
  const navigate = useNavigate();
  const location = useLocation();

  const languageChange = useCallback(
    async (newLng: string) => {
      await changeLanguage(newLng).then(() => {
        const parts = location.pathname.split("/");
        if (parts[1]?.match(/^[a-z]+-[A-Z]+/)) {
          parts[1] = newLng;
          const newPath = parts.join("/") || "/";
          navigate(newPath, { replace: true });
        }
      });
    },
    [navigate, location]
  );

  return { languageChange };
}
