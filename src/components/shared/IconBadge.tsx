type IconBadgeProps = {
  icon: React.ReactNode | string;
  cssClass?: string;
  dark?: boolean;
  size?: "small" | "medium" | "large";
};

const IconBadge = (props: IconBadgeProps) => {
  const { icon, cssClass, dark, size } = props;

  return (
    <div
      className={`icon-badge ${size ? size : "medium"} ${dark ? "dark" : ""} ${
        cssClass ? cssClass : ""
      }`}
    >
      {icon}
    </div>
  );
};

export default IconBadge;
