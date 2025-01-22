import { useState } from "react";
import { Card } from "@/components/ui/card";
import Privacy2 from "@/components/privacy/v2";
import Privacy1 from "@/components/privacy/v1";
import Select from "@/components/common/combobox-select";

const versions = [
  { value: 2, label: "2025-01-22" },
  { value: 1, label: "2024-03-12" },
];

const PrivacyCore = ({ version }: { version: number }) => {
  if (version === 1) {
    return <Privacy1 />;
  }
  return <Privacy2 />;
};

const Privacy = () => {
  const [version, setVersion] = useState<number>(2);
  return (
    <Card className="p-4 bg-slate-100 dark:bg-slate-900 bg-opacity-60 text-left">
      <h4 className="pt-6 text-2xl font-bold">
        <img
          src="/AppImages/windows11/Square44x44Logo.scale-400.png"
          className="h-9 inline-block mr-3"
          alt="logo"
        />
        개인정보처리방침
      </h4>
      <PrivacyCore version={version} />
      <div className="h-8" />
      <div className="font-onemobile">
        <div className="text-xs">이전 개인정보처리방침 조회</div>
        <Select value={version} setValue={setVersion} items={versions} />
      </div>
    </Card>
  );
};

export default Privacy;
