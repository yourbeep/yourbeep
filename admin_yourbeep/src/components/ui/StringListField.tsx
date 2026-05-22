import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { FieldLabel } from "./FieldLabel";
import { InputField } from "./InputField";
import { MainButton } from "./MainButton";

type StringListFieldProps = {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  helpText?: string;
  placeholder?: string;
  addLabel?: string;
  maxItems?: number;
};

export function StringListField({
  label,
  items,
  onChange,
  helpText,
  placeholder = "Add a point",
  addLabel = "Add item",
  maxItems = 12,
}: StringListFieldProps) {
  const addItem = () => {
    if (items.length >= maxItems) return;
    onChange([...items, ""]);
  };

  const updateItem = (index: number, value: string) => {
    onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <FieldLabel>{label}</FieldLabel>
          {helpText ? (
            <p className="mt-1 text-xs leading-5 text-[#72806e]">{helpText}</p>
          ) : null}
        </div>
        <MainButton
          type="button"
          size="sm"
          variant="outline"
          headIcon={<Plus className="h-4 w-4" />}
          onClick={addItem}
          disabled={items.length >= maxItems}
        >
          {addLabel}
        </MainButton>
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <motion.div
              key={`${label}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-start gap-3 rounded-[20px] border border-[#e7eadf] bg-[#fbfcf8] p-3"
            >
              <div className="min-w-0 flex-1">
                <InputField
                  label={`${label} ${index + 1}`}
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) => updateItem(index, event.target.value)}
                />
              </div>
              <MainButton
                type="button"
                size="sm"
                variant="ghost"
                headIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => removeItem(index)}
                className="mt-8"
              >
                Remove
              </MainButton>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StringListField;
