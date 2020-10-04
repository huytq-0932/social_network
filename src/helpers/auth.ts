import nextCookie from "next-cookies";
import Cookies from "universal-cookie";
import moment from "moment";

export interface AuthInterface {
  token: string;
  cookies: Cookies;
  setAuth: Function;
  logout: Function;
  user: {
    id: number;
    username: string;
    fullname: string;
    permissions: any;
    isRoot: number;
    groupId: number;
  };
}

export default (context?: any): AuthInterface => {
  const cookiesObj = context ? nextCookie(context) : {};
  let cookies = new Cookies(cookiesObj);
 
  const isBrowser = () => ( typeof window !== "undefined");
  
  let token = cookies.get("token");
  let user = cookies.get("user");
  if (isBrowser() && !token) {
    token = window?.localStorage.getItem("token");
  }
  if (isBrowser() && !user) {
    user = window?.localStorage.getItem("user") || {};
  }

  const setAuth = ({ token, user }: AuthInterface) => {
    const options = {
      path: "/",
      //maxAge: 86400 * 365
      expires: moment().add(1, "years").toDate(),
    };
    cookies.set("token", token, options);
    cookies.set("user", user, options);
    if (typeof window != "undefined") {
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("user", JSON.stringify(user));
    }
  };
  const logout = () => {
    cookies.remove("token", {
      path: "/",
    });
    cookies.remove("user", {
      path: "/",
    });
    if (typeof window != "undefined") {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }
  };
  return {
    token,
    user,
    cookies,
    setAuth,
    logout,
  };
};
