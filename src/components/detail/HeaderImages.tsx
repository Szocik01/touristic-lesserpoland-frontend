type HeaderImagesProps = {
  imagesUrls: string[];
  onOpenLightbox: (index: number) => void;
};

const HeaderImages = (props: HeaderImagesProps) => {
  const { imagesUrls, onOpenLightbox } = props;

  return (
    <div className={`images-presentation-container grid-${Math.min(imagesUrls.length, 5)}`}>
      {imagesUrls.map((url, index) => (
        <div
          key={index}
          className={`image-container image-${index + 1}`}
          onClick={() => onOpenLightbox(index)}
        >
          <img className="thumb" src={url} alt="" />
        </div>
      ))}
    </div>
  );
};

export default HeaderImages;
