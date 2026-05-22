import React, { type ReactNode } from "react";
import { AnimatedDropdown } from "./AnimatedDropdown";

type OptionDropdownProps = {
  name: string;
  defaultValue?: string | number;
  headIcon?: ReactNode;
  children: ReactNode;
};

/**
 * Native `<option>` children → {@link AnimatedDropdown} for consistent styling.
 */
export function OptionDropdown({
  name,
  defaultValue,
  headIcon,
  children,
}: OptionDropdownProps) {
  const options = React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ value?: string | number }>(child)) {
      return [];
    }
    if (child.props.value === undefined) {
      return [];
    }

    const element = child as React.ReactElement<{
      value: string | number;
      children?: ReactNode;
    }>;

    return [
      {
        label:
          typeof element.props.children === "string"
            ? element.props.children
            : String(element.props.children),
        value: String(element.props.value),
      },
    ];
  });

  return (
    <AnimatedDropdown
      name={name}
      options={options}
      defaultValue={defaultValue ? String(defaultValue) : undefined}
      placeholder="Select…"
      headIcon={headIcon}
      className="w-full"
    />
  );
}
