"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface ButtonProps {
  textKey: string; // i18n key
  value: number | boolean; // resolve될 값
  className?: string; // 추가 스타일 (옵션)
}

interface ConfirmOptions {
  title: string; // i18n key
  description?: string; // i18n key
  input?: {
    placeholder?: string; // i18n key
    maxLength?: number;
  };
  confirm: ButtonProps;
  cancel: ButtonProps;
  extra?: ButtonProps[]; // 선택적으로 추가 버튼
}

type ConfirmContextType = (
  opts: ConfirmOptions
) => Promise<string | number | boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [resolver, setResolver] = useState<
    ((v: string | number | boolean) => void) | null
  >(null);

  const confirm: ConfirmContextType = (opts) => {
    setOptions(opts);
    setOpen(true);
    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleClose = (value: string | number | boolean) => {
    setOpen(false);
    resolver?.(value);
    setResolver(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="font-onemobile">
          <AlertDialogHeader>
            <AlertDialogTitle>{options && t(options.title)}</AlertDialogTitle>
            {options?.description && (
              <AlertDialogDescription>
                {t(options.description)}
              </AlertDialogDescription>
            )}
            {options?.input && (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                maxLength={options.input.maxLength}
                placeholder={
                  options.input.placeholder && t(options.input.placeholder)
                }
              />
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            {/* 취소 버튼 */}
            {options && (
              <AlertDialogCancel
                onClick={() => handleClose(options.cancel.value)}
                className={cn(options.cancel.className)}
              >
                {t(options.cancel.textKey)}
              </AlertDialogCancel>
            )}
            {/* 추가 버튼들 */}
            {options?.extra?.map((btn, i) => (
              <AlertDialogAction
                key={i}
                onClick={() => handleClose(btn.value)}
                className={cn(btn.className)}
              >
                {t(btn.textKey)}
              </AlertDialogAction>
            ))}
            {/* 확인 버튼 */}
            {options && (
              <AlertDialogAction
                onClick={() =>
                  handleClose(
                    options.input ? inputValue : options.confirm.value
                  )
                }
                className={cn(options.confirm.className)}
                disabled={options.input && inputValue.length < 1}
              >
                {t(options.confirm.textKey)}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
  return ctx;
};
