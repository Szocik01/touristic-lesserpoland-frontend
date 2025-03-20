import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import Logo from "../shared/Logo";
import MenuToggler from "./MenuToggler";
import { useCallback, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { authSliceActions } from "../../redux/authSlice";
import deleteSingleCookie from "../../utils/deleteSingleCookie";

const links = [
  {
    title: "Zaplanuj",
    url: "/planer",
  },
  {
    title: "Wyszukaj",
    url: "/wyszukaj",
  },
];

type HeaderProps = {
  transparentized?: boolean;
};

const Header = (props: HeaderProps) => {
  const [menuOpened, setMenuOpened] = useState(false);

  const { transparentized } = props;

  const authData = useAppSelector((state) => state.authState);
  const dispatch = useAppDispatch();

  const isUserLoggedIn = authData.token !== "";

  const logoutHandler = useCallback(() => {
    deleteSingleCookie("token");
    deleteSingleCookie("userId");
    deleteSingleCookie("userName");
    dispatch(authSliceActions.deleteUserData());
  }, [dispatch]);

  const renderedLinks = links.map((link) => (
    <li key={link.url}>
      <NavLink to={link.url}>{link.title}</NavLink>
    </li>
  ));

  return (
    <header className={transparentized ? "transparentized" : ""}>
      <div className="navbar ">
        <div className="navbar-side-left">
          <Link to="/">
            <div className="logo-container">
              <Logo />
            </div>
          </Link>
        </div>
        <div className="navbar-side-right">
          <ul className="links">
            {renderedLinks}
            {isUserLoggedIn && (
              <>
                <li>
                  <NavLink to="/moje-wycieczki">Moje wycieczki</NavLink>
                </li>
                <li>
                  <NavLink to="/moje-ulubione">Moje ulubione</NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="buttons">
            {!isUserLoggedIn ? (
              <>
                <Button
                  variant="contained"
                  onClick={() => {
                    dispatch(authSliceActions.openLoginDialog());
                  }}
                >
                  Zaloguj
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    dispatch(authSliceActions.openRegisterDialog());
                  }}
                >
                  Zarejestruj
                </Button>
              </>
            ) : (
              <>
                <Button variant="contained" onClick={logoutHandler}>
                  Wyloguj
                </Button>
              </>
            )}
          </div>

          <MenuToggler
            onClick={() => {
              setMenuOpened((prevValue) => !prevValue);
            }}
            menuOpened={menuOpened}
          />
        </div>
      </div>
      <div className={`sidebar ${menuOpened ? "opened" : ""}`}>
        <ul className="links">
          {renderedLinks}
          {isUserLoggedIn && (
            <>
              <li>
                <NavLink to="/moje-wycieczki">Moje wycieczki</NavLink>
              </li>
              <li>
                <NavLink to="/moje-ulubione">Moje ulubione</NavLink>
              </li>
            </>
          )}
        </ul>
        <div className="buttons">
          {!isUserLoggedIn ? (
            <>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  dispatch(authSliceActions.openLoginDialog());
                }}
              >
                Zaloguj
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  dispatch(authSliceActions.openRegisterDialog());
                }}
              >
                Zarejestruj
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth variant="contained" onClick={logoutHandler}>
                Wyloguj
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
