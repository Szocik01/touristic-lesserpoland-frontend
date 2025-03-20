type MenuTogglerProps = {
  onClick: () => void;
  menuOpened: boolean;
};

const MenuToggler = (props: MenuTogglerProps) => {
  const { onClick, menuOpened } = props;
  return (
    <div
      onClick={onClick}
      className={`menu-toggler ${menuOpened ? "menu-toggler-active" : ""}`}
    ></div>
  );
};

export default MenuToggler;
