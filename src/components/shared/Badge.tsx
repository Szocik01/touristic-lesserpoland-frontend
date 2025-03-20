import { PropsWithChildren } from "react";

type BadgeProps = {
  size?: "small" | "medium" | "large";
  rounded?: boolean;
  className?: string;
} & PropsWithChildren;

export const Badge = (props: BadgeProps) => {
  return (
    <div
      className={`badge ${props.size ? props.size : "medium"} ${
        props.rounded ? "rounded" : ""
      } ${props.className}`}
    >
      {props.children}
    </div>
  );
};
