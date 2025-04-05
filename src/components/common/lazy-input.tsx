import { ComponentPropsWithRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface LazyInputProp {
  value: string;
  sanitize: (value: string) => string;
  onValueChange: (value: string) => void;
}

const LazyInput = ({
  value,
  sanitize,
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
        const s = sanitize(v);
        onValueChange(s);
        setV(s);
      }}
      onFocus={(e) => e.target.select()}
    />
  );
};
export default LazyInput;
