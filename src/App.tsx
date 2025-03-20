import "maplibre-gl/dist/maplibre-gl.css";
import { Map } from "react-map-gl/maplibre";
import { mapTilesConfig } from "./config/map";
import { matchPath, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";
import AuthDialog from "./components/auth/AuthDialog";
import { useEffect } from "react";
import getSingleCookie from "./utils/getSingleCookie";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { authSliceActions } from "./redux/authSlice";
import Planer from "./pages/Planer";
import Detail from "./pages/Detail";
import UserTrips from "./pages/UserTrips";
import Search from "./pages/Search";
import UserFavourites from "./pages/UserFavourites";
import EditTrip from "./pages/EditTrip";
import Footer from "./components/layout/Footer";

function App() {
  const dispatch = useAppDispatch();
  const isUserLogged = useAppSelector((state) => {
    return state.authState.token !== "";
  });

  useEffect(() => {
    const token = getSingleCookie("token");
    const userId = getSingleCookie("userId");
    const userName = getSingleCookie("userName");
    if (!token || !userId || !userName) {
      dispatch(authSliceActions.setUserDataLoaded());
      return;
    }
    dispatch(
      authSliceActions.addLoggedUserData({
        token,
        userId,
        userName,
        userStateLoaded: true,
      })
    );
  }, []);

  const location = useLocation();
  return (
    <>
      <AuthDialog />
      <Header transparentized={location.pathname === "/"} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/planer" element={<Planer />}></Route>
        <Route element={<Footer />}>
          <Route path="/wyszukaj" element={<Search />}></Route>
          <Route path="/wycieczka/:id" element={<Detail />}></Route>
          {isUserLogged && (
            <Route path="/moje-wycieczki" element={<UserTrips />}></Route>
          )}
          {isUserLogged && (
            <Route path="/moje-ulubione" element={<UserFavourites />}></Route>
          )}
          {isUserLogged && (
            <Route path="/edytuj-wycieczke/:id" element={<EditTrip />}></Route>
          )}
        </Route>
      </Routes>
    </>
    // <a href="https://www.flaticon.com/free-icons/cloud" title="cloud icons">Cloud icons created by iconixar - Flaticon</a>
  );
}

export default App;
