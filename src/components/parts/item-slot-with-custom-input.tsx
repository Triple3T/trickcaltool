import {
  HTMLAttributes,
  HTMLInputTypeAttribute,
  useCallback,
  useRef,
  useState,
} from "react";
import ItemSlot, { ItemSlotProps } from "./item-slot";

interface ItemSlotWithCustomInputProps extends ItemSlotProps {
  onInputChange?: (value: string) => void;
  sanitizeInput?: (value: string) => string;
  keyboardType?: HTMLInputTypeAttribute;
  keyboardMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
}

const defaultSanitizeInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9 ]/g, "");

const ItemSlotWithCustomInput = ({
  rarityInfo,
  item,
  fullItemPath,
  amount,
  size = 5,
  innerSize = 60,
  ring = false,
  onInputChange,
  sanitizeInput = defaultSanitizeInput,
  keyboardType = "text",
  keyboardMode = "text",
}: ItemSlotWithCustomInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  const sanitizedView = useCallback(
    (input: string | undefined) => {
      if (typeof input === "undefined") return "";
      const sanitized = sanitizeInput(input);
      if (sanitized.length < 1) return "";
      return sanitized;
    },
    [sanitizeInput]
  );
  const applyValue = useCallback(
    (v: string) => {
      onInputChange?.(v);
      setEditing(false);
    },
    [onInputChange]
  );
  const handleClick = useCallback(() => {
    setEditing(true);
    // setTimeout(() => inputRef.current?.focus(), 0);
    // requestAnimationFrame(() => {
    //   inputRef.current?.focus();
    // })
  }, []);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(sanitizeInput(e.target.value));
    },
    [sanitizeInput]
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (inputRef.current && e.key === "Enter") {
        applyValue(sanitizeInput(inputRef.current.value));
        setValue("");
      }
    },
    [applyValue, sanitizeInput]
  );
  const handleBlur = useCallback(() => {
    if (inputRef.current) applyValue(sanitizeInput(inputRef.current.value));
    setValue("");
  }, [applyValue, sanitizeInput]);

  return (
    <div onClick={handleClick} className="relative inline-block">
      {editing && (
        <input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          type={keyboardType}
          inputMode={keyboardMode}
          autoFocus
        />
      )}
      <ItemSlot
        rarityInfo={rarityInfo}
        item={item}
        fullItemPath={fullItemPath}
        amount={editing ? sanitizedView(value) : amount}
        size={size}
        innerSize={innerSize}
        ring={ring}
      />
    </div>
  );
};

export default ItemSlotWithCustomInput;
