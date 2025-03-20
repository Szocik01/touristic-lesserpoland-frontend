import PinImage from "../assets/map/pins/pin.svg";

type PinProps = {
  width: number;
  text?: string;
};

const Pin = (props: PinProps) => {
  const { width, text } = props;

  return (
    <div
      className="pin-container"
      style={{ width: `${width}px`, marginTop: `-${width * 1.4}px` }}
    >
      <img src={PinImage} alt="" />
      {text && <div className="text">{text}</div>}
    </div>
  );
};

export default Pin;
