import { Outlet } from "react-router-dom";
import Logo from "../shared/Logo";

const Footer = () => {
  return (
    <>
      <Outlet />
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-9 col-md-5 mb-5 mb-md-0">
              <Logo />
              <div className="info">
                Nasza aplikacja turystyczna to narzędzie do planowania i
                udostępniania wycieczek. Umożliwia łatwe tworzenie planów
                podróży, dzielenie się nimi z innymi oraz odkrywanie nowych
                miejsc dzięki rekomendacjom społeczności.
              </div>
            </div>
            <div className="col-12 col-md-6 offset-md-1">
              <h2 className="site-map-header">Mapa strony</h2>
              <ul className="site-map">
                <li>
                  <a href="/">Strona główna</a>
                </li>
                <li>
                  <a href="/planer">Planer</a>
                </li>
                <li>
                  <a href="/wyszukaj">Wyszukiwarka</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
