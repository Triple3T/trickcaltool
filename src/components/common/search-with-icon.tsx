import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComponentPropsWithRef } from "react";

interface SearchBoxProp {
  value: string;
  onValueChange: (value: string) => void;
}

const SearchBox = ({
  value,
  onValueChange,
  className,
  ...props
}: SearchBoxProp & ComponentPropsWithRef<typeof Input>) => {
  return (
    <div className={className}>
      <div className="relative">
        <Input
          {...props}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          inputMode="search"
          className="pl-8"
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <Search className="text-gray-500 w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
