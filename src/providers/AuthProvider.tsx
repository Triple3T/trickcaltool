import { ReactNode, useEffect, useRef } from "react";
import {
  useSaveUserData,
  useUserDataActions,
  useUserDataDirty,
  useUserDataError,
  useUserGoogleLinked,
  useUserDataStatus,
} from "@/stores/useUserDataStore";
import { useSyncQuery } from "@/hooks/useSyncQuery";

export const AuthProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const status = useUserDataStatus();
  const dirtyFlag = useUserDataDirty();
  const userGoogleLinked = useUserGoogleLinked();
  const { readIntoUserData } = useUserDataActions();
  const saveData = useSaveUserData();
  const { storeFile } = useSyncQuery();
  const error = useUserDataError();
  if (error) throw new Error(error);
  // read data from storage to initialize
  useEffect(() => {
    if (status !== "initialized") {
      readIntoUserData();
    }
  }, [status, readIntoUserData]);
  // sync with storage periodically but only when data is dirty
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!saveData) return;
    if (dirtyFlag) {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
      saveTimeout.current = setTimeout(() => {
        saveData();
        if (userGoogleLinked) {
          storeFile.mutateAsync(undefined);
        }
      }, 1000);
      return () => {
        if (saveTimeout.current) {
          clearTimeout(saveTimeout.current);
        }
      };
    }
  }, [dirtyFlag, saveData, storeFile, userGoogleLinked]);
  //
  return <>{children}</>;
};
