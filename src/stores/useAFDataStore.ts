import { create } from "zustand";

interface AFDataStore {
  isActive: boolean;
  isOverlayActive: boolean;
  isToday: boolean;
  toggleActive: () => void;
  toggleOverlayActive: () => void;
}

const whetherIsOverlayActive = () => {
  return localStorage.getItem("afo") !== "no";
};

const whetherIsCharaActive = () => {
  return localStorage.getItem("afc") !== "no";
};

const whetherIsToday = () => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
};

export const useAFDataStore = create<AFDataStore>((set) => ({
  isActive: whetherIsCharaActive(),
  isOverlayActive: whetherIsOverlayActive(),
  isToday: whetherIsToday(),
  toggleActive: () =>
    set((state) => {
      if (state.isActive) localStorage.setItem("afc", "no");
      else localStorage.removeItem("afc");
      return { isActive: !state.isActive };
    }),
  toggleOverlayActive: () =>
    set((state) => {
      if (state.isOverlayActive) localStorage.setItem("afo", "no");
      else localStorage.removeItem("afo");
      return { isOverlayActive: !state.isOverlayActive };
    }),
}));

/**
 * Whether AF chara should actually be active
 * @returns {boolean} Whether AF chara setting is active AND today is the day
 */
export const useIsAFActive = () => {
  const isActive = useAFDataStore((s) => s.isActive);
  const isToday = useAFDataStore((s) => s.isToday);
  return isActive && isToday;
};
/**
 * Whether AF overlay should actually be active
 * @returns {boolean} Whether AF overlay setting is active AND today is the day
 */
export const useIsAFOverlayActive = () => {
  const isActive = useAFDataStore((s) => s.isOverlayActive);
  const isToday = useAFDataStore((s) => s.isToday);
  return isActive && isToday;
};
export const useIsToday = () => useAFDataStore((s) => s.isToday);
export const useAFSettingActive = () => useAFDataStore((s) => s.isActive);
export const useAFOverlaySettingActive = () => useAFDataStore((s) => s.isOverlayActive);
export const useAFToggle = () => useAFDataStore((s) => s.toggleActive);
export const useAFOverlayToggle = () => useAFDataStore((s) => s.toggleOverlayActive);
