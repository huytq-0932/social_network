import moment from "moment";
import Cookies from "universal-cookie";
const cookies = new Cookies();
interface Auth {
  user: string;
  token: string;
  setAuth: Function;
  logout: Function;
}

const auth = (): Auth => {
  let user = cookies.get("user");
  let token = cookies.get("token");

  const setAuth = ({ token, user }) => {
    const options = {
      path: "/",
      //maxAge: 86400 * 365
      expires: moment().add(1, "years").toDate(),
    };
    cookies.set("token", token, options);
    cookies.set("user", user, options);
  };
  const logout = () => {
    cookies.remove("token", {
      path: "/",
    });
    cookies.remove("user", {
      path: "/",
    });
  };

  return {
    user,
    token,
    setAuth,
    logout,
  };
};
export default auth;
