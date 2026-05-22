import { Reorder } from "framer-motion";
import type { ReactNode } from "react";

type SortableStackProps<T> = {
  items: T[];
  onReorder: (items: T[]) => void;
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
};

export function SortableStack<T>({
  items,
  onReorder,
  getKey,
  renderItem,
  className = "space-y-3",
  itemClassName = "rounded-2xl border border-[#edf1e7] bg-white p-4 shadow-sm",
}: SortableStackProps<T>) {
  return (
    <Reorder.Group axis="y" values={items} onReorder={onReorder} className={className}>
      {items.map((item, index) => (
        <Reorder.Item
          key={getKey(item)}
          value={item}
          className={itemClassName}
          whileDrag={{
            scale: 1.01,
            boxShadow: "0 16px 36px rgba(32, 51, 33, 0.12)",
          }}
        >
          {renderItem(item, index)}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
