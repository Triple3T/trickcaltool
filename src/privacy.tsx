import Layout from "@/components/layout";
import { Card } from "@/components/ui/card";

const Privacy = () => {
  return (
    <Layout>
      <Card className="p-4 bg-slate-100 dark:bg-slate-900 bg-opacity-60 text-left">
        <h4 className="pt-6 text-2xl font-bold">
          <img
            src="/AppImages/windows11/Square44x44Logo.scale-400.png"
            className="h-9 inline-block mr-3"
            alt="logo"
          />
          개인정보처리방침
        </h4>
        <h6 className="pt-4">1. 개인정보의 처리 목적</h6>
        <p className="pt-4">
          트릭컬 노트는 다음의 목적을 위하여 개인정보를 처리하고 있으며, 다음의
          목적 이외의 용도로는 이용하지 않습니다.
        </p>
        <p className="pt-4">1) 사용자 데이터 동기화</p>
        <p className="pt-2">
          트릭컬 노트는 사용자의 트릭컬 노트 서비스 데이터를 Google Drive에
          동기화하기 위하여 개인정보를 처리하고 있습니다.
        </p>
        <p className="pt-4">2) 사용자 데이터 분석</p>
        <p className="pt-2">
          트릭컬 노트는 익명화된 사용자 데이터의 통계를 Cloudflare Analytics를
          이용하여 분석해 최적화된 서비스를 제공하기 위하여 개인정보를 처리하고
          있습니다.
        </p>
        <h6 className="pt-4">2. 개인정보의 처리 및 보유 기간</h6>
        <p className="pt-4">1) 사용자 데이터 동기화</p>
        <p className="pt-2">
          트릭컬 노트는 사용자가 트릭컬 노트 서비스 데이터를 동기화하기 위해
          Google 계정에 연결하는 동안에만 개인정보를 처리하고 있으며, 동기화
          절차 중 트릭컬 노트는 사용자의 개인정보를 조회할 수 없습니다.
        </p>
        <p className="pt-4">2) 사용자 데이터 분석</p>
        <p className="pt-2">
          트릭컬 노트는 사용자가 트릭컬 노트 서비스를 이용하는 동안에만
          개인정보를 처리하고 있으며, 이 정보는 Cloudflare Analytics를 통해 먼저
          익명화 처리되어 사용 통계만을 남기므로 트릭컬 노트에서 개개인을 식별할
          수 없습니다.
        </p>
        <h6 className="pt-4">3. 개인정보의 제3자 제공에 관한 사항</h6>
        <p className="pt-4">
          트릭컬 노트는 사용자의 개인정보를 제3자에게 제공하지 않습니다.
        </p>
        <h6 className="pt-4">4. 개인정보처리 위탁</h6>
        <p className="pt-4">
          트릭컬 노트는 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
        </p>
        <p className="pt-4">1) Google Drive</p>
        <p className="pt-2">위탁받는 자 (수탁자) : Google Inc.</p>
        <p className="pt-1">
          위탁하는 업무의 내용 : 사용자의 트릭컬 노트 서비스 데이터를 Google
          Drive에 저장 및 동기화
        </p>
        <p className="pt-1">
          개인정보 보유 및 이용기간 : 사용자가 트릭컬 노트 서비스를 이용하며
          데이터 동기화를 하는 동안
        </p>
        <p className="pt-4">2) Cloudflare Analytics</p>
        <p className="pt-2">위탁받는 자 (수탁자) : Cloudflare Inc.</p>
        <p className="pt-1">
          위탁하는 업무의 내용 : 트릭컬 노트 사용 데이터를 익명화하여 Cloudflare
          Analytics에 통계화
        </p>
        <p className="pt-1">
          개인정보 보유 및 이용기간 : 사용자가 트릭컬 노트 서비스를 이용하는
          동안
        </p>
        <h6 className="pt-4">5. 개인정보의 파기</h6>
        <p className="pt-4">
          트릭컬 노트는 사용자의 개인정보를 자체적으로 저장하지 않습니다.
          사용자의 서비스 데이터는 Google Drive에 저장되며, 사용자가 트릭컬 노트
          서비스 데이터를 파기하려면 Google Drive 설정의 앱 관리 메뉴에서 트릭컬
          노트 항목의 옵션을 눌러서 데이터를 삭제하면 됩니다.
        </p>
        <h6 className="pt-4">6. 개인정보의 안전성 확보 조치</h6>
        <p className="pt-4">
          트릭컬 노트는 사용자의 개인정보를 안전하게 처리하기 위해 다음과 같은
          조치를 취하고 있습니다.
        </p>
        <p className="pt-4">1) 기술적 조치</p>
        <p className="pt-2">
          모든 개인정보는 개인정보를 처리할 때 익명화되어 개개인을 특정할 수
          없도록 조치하고 있습니다.
        </p>
        <h6 className="pt-4">
          7. 개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항
        </h6>
        <p className="pt-4">
          트릭컬 노트는 사용자의 정보를 수시로 저장하고 찾아내는
          ‘쿠키(cookie)’를 운용합니다. 쿠키란 트릭컬 노트의 웹사이트를
          운영하는데 이용되는 서버가 사용자의 브라우저에 보내는 아주 작은 텍스트
          파일로서 사용자의 컴퓨터 하드디스크에 저장됩니다.
        </p>
        <p className="pt-2">
          트릭컬 노트는 다음과 같은 목적을 위해 쿠키를 사용합니다.
        </p>
        <p className="pt-4">1) 쿠키 등 사용 목적</p>
        <p className="pt-2">
          이용자의 구글 계정을 통해 로그인을 하여 트릭컬 노트 서비스를 이용할 수
          있습니다. 이용자가 구글 계정을 통해 로그인을 하면 트릭컬 노트는
          이용자의 구글 계정 정보를 이용한 ‘쿠키(cookie)’를 운용합니다. 이
          쿠키는 구글 드라이브를 통해 트릭컬 노트 서비스 데이터를 동기화할 때만
          사용됩니다.
        </p>
        <p className="pt-4">2) 쿠키 설정 거부 방법</p>
        <p className="pt-2">
          이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서 이용자는
          웹브라우저를 통해 쿠키의 설치를 거부할 수 있습니다. 쿠키 설치를 거부할
          경우, 구글 로그인이 필요한 트릭컬 노트 서비스를 이용할 수 없습니다.
          쿠키 설치를 거부하려면 웹브라우저 설정의 개인정보 메뉴에서 쿠키 저장을
          거부할 수 있습니다.
        </p>
        <p className="pt-4">3) 쿠키 설정을 통한 광고주의 광고성 정보 전송</p>
        <p className="pt-2">
          트릭컬 노트는 이용자의 쿠키 설정 여부와 무관하게 광고성 정보를
          전송하지 않습니다.
        </p>
        <h6 className="pt-4">8. 개인정보 처리방침 변경</h6>
        <p className="pt-2">
          이 개인정보 처리방침은 2024년 3월 12일부터 적용됩니다.
        </p>
      </Card>
    </Layout>
  );
};

export default Privacy;
