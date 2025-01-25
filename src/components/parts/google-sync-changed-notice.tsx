import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import googleAccessUrlLegacy from "@/utils/googleAccessUrlLegacy";
import { ScrollArea } from "../ui/scroll-area";
import { Copy } from "lucide-react";

export function GoogleSyncChangedNotice() {
  const { t } = useTranslation();
  return (
    <AlertDialog
      defaultOpen={(localStorage.getItem("alert") || "").charAt(0) !== "1"}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="text-sm">
          {t("ui.index.syncChangedNoticeTitle")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("ui.index.syncChangedNoticeTitle")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <ScrollArea className="max-h-96">
          <div className="py-4 flex flex-col gap-1 break-keep">
            <p>안녕하세요, 트릭컬 노트 개발자 Triple입니다.</p>
            <p className="mt-3">
              지난번 말씀드린 계정 연동 시의 오작동 현상에 대한 대응으로
              말씀드린 새로운 연동 및 저장 시스템을 새로운 개인정보처리방침
              적용과 함께 구축 및 적용했습니다.
            </p>
            <p>
              이제 사도별 정보를 한 번에 관리하고, 충돌 가능성을 낮춰 데이터가
              더 견고하게 유지 및 관리되며, 동기화 역시 서버의 검증을 거쳐 보다
              안전하게 동기화를 이용하실 수 있습니다.
            </p>
            <p>
              다만 이렇게 적용하며 공지가 미흡했던 것과, 초기 오류 때문에
              혼란으로 다가온 것 같아 죄송스럽습니다.
            </p>
            <p className="mt-3">
              이제 데이터 연동은 자체 DB를 활용하게 됩니다. 자세한 사항은{" "}
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/private"
              >
                개인정보처리방침
              </Link>
              과{" "}
              <a
                className="underline text-blue-600 dark:text-blue-400"
                href="https://triple3t.notion.site/102c52e157ae80f5a581dda26232a96b"
              >
                업데이트 내역
              </a>
              을 참고해 주세요. 이전에 연동을 한 적이 있더라도 1회에 한해 다시
              연동해야 합니다.
            </p>
            <p>
              데이터가 잘못 변환된 경우,{" "}
              <Link
                className="underline text-blue-600 dark:text-blue-400"
                to="/setting"
              >
                설정
              </Link>
              에서 이전 데이터 변환 재시도를 진행해 주세요.
            </p>
            <p>
              이전의 드라이브 연동 방식을 사용하던 때의 데이터를 적용하고 싶을
              경우,{" "}
              <a
                className="underline text-blue-600 dark:text-blue-400"
                href={googleAccessUrlLegacy}
              >
                여기
              </a>
              를 눌러 다운로드를 받을 수 있습니다.
            </p>
            <p className="mt-2">
              이 알림 메시지는 최초 1회만 자동으로 나타나며 이후엔 메인 페이지의{" "}
              <span className="bg-red-500/60">
                [중요] 연동 및 저장 방식 변경 안내
              </span>{" "}
              버튼을 누르면 볼 수 있습니다.
            </p>
            <p className="mt-2">즐거운 연휴 되세요.</p>
            <p className="font-onemobile">
              쿠폰 코드:{" "}
              <Button
                variant="link"
                className="text-emerald-600 dark:text-green-400 cursor-pointer"
                onClick={() => {
                  window.navigator.clipboard.writeText("QUEENWIN");
                }}
              >
                QUEENWIN <Copy className="ml-2 w-4 h-4 inline" />
              </Button>
            </p>
          </div>
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogAction
            className="font-onemobile"
            onClick={() =>
              localStorage.setItem(
                "alert",
                "1" + (localStorage.getItem("alert") || "").slice(1)
              )
            }
          >
            {t("ui.board.closeGuide")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default GoogleSyncChangedNotice;
