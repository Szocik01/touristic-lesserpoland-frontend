type GalleryProps = {
  imagesUrls: string[];
  onOpenLightbox: (index: number) => void;
};

const Gallery = (props: GalleryProps) => {
  const { imagesUrls, onOpenLightbox } = props;

  return (
    <div className="gallery">
        <div className="title">Galeria</div>
      {imagesUrls.map((url, index) => (
        <div
          key={index}
          className={`image-container`}
          onClick={() => onOpenLightbox(index)}
        >
          <img className="thumb" src={url} alt="" />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
