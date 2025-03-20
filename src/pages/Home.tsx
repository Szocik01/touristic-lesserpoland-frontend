import { useState } from "react";
import HomeMovie from "../assets/movies/home-bg.mp4";
import Logo from "../components/shared/Logo";
import ContentLoading from "../components/utils/ContentLoading";

const Home = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  return (
    <div className="home-container">
      <video
        autoPlay
        muted
        loop
        src={HomeMovie}
        onLoadedData={(event) => {
          setIsVideoLoaded(true);
        }}
      ></video>
      {isVideoLoaded ? (
        <div className="logo-container">
          <Logo withAnimation startAnimation={isVideoLoaded} />
        </div>
      ) : (
        <ContentLoading coverParent={true} color="white" />
      )}
    </div>
  );
};

export default Home;
