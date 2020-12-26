import moment from "moment";
import Cookies from "universal-cookie";
const cookies = new Cookies();
interface Auth {
  user: string;
  phonenumber: string;
  token: string;
  setAuth: Function;
  logout: Function;
}

const auth = (): Auth => {
  let user = cookies.get("user");
  let token = cookies.get("token");
  let phonenumber = cookies.get("phonenumber");

  const setAuth = ({ token, user, phonenumber }) => {
    const options = {
      path: "/",
      //maxAge: 86400 * 365
      expires: moment().add(1, "years").toDate(),
    };
    cookies.set("token", token, options);
    cookies.set("phonenumber", phonenumber, options);
    cookies.set("user", user, options);
  };
  const logout = () => {
    cookies.remove("token", {
      path: "/",
    });
    cookies.remove("user", {
      path: "/",
    });
    cookies.remove("phonenumber", {
      path: "/",
    });
  };

  return {
    user,
    phonenumber,
    token,
    setAuth,
   
    logout,
  };
};
export default auth;
