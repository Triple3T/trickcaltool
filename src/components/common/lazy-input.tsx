import { ComponentPropsWithRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface LazyInputProp {
  value: string;
  onValueChange: (value: string) => void;
}

const LazyInput = ({
  value,
  onValueChange,
  ...props
}: LazyInputProp & ComponentPropsWithRef<typeof Input>) => {
  const [v, setV] = useState(value);
  useEffect(() => {
    setV(value);
  }, [value]);
  return (
    <Input
      {...props}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        onValueChange(v);
      }}
    />
  );
};
export default LazyInput;
