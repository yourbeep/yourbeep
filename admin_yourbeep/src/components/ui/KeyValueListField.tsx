import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { FieldLabel } from "./FieldLabel";
import { InputField } from "./InputField";
import { MainButton } from "./MainButton";

type KeyValueItem = {
  key: string;
  value: string;
};

type KeyValueListFieldProps = {
  label: string;
  items: KeyValueItem[];
  onChange: (items: KeyValueItem[]) => void;
  helpText?: string;
  keyLabel?: string;
  valueLabel?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  addLabel?: string;
  maxItems?: number;
};

export function KeyValueListField({
  label,
  items,
  onChange,
  helpText,
  keyLabel = "Question",
  valueLabel = "Answer",
  keyPlaceholder = "Add label",
  valuePlaceholder = "Add value",
  addLabel = "Add row",
  maxItems = 12,
}: KeyValueListFieldProps) {
  const addItem = () => {
    if (items.length >= maxItems) return;
    onChange([...items, { key: "", value: "" }]);
  };

  const updateItem = (index: number, field: "key" | "value", fieldValue: string) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: fieldValue } : item,
      ),
    );
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
              className="rounded-[20px] border border-[#e7eadf] bg-[#fbfcf8] p-3"
            >
              <div className="grid gap-3">
                <InputField
                  label={`${keyLabel} ${index + 1}`}
                  value={item.key}
                  placeholder={keyPlaceholder}
                  onChange={(event) => updateItem(index, "key", event.target.value)}
                />
                <InputField
                  label={valueLabel}
                  element="textarea"
                  rows={4}
                  value={item.value}
                  placeholder={valuePlaceholder}
                  onChange={(event) => updateItem(index, "value", event.target.value)}
                />
                <div className="flex justify-end">
                  <MainButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    headIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </MainButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default KeyValueListField;
