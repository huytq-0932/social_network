import fetch from "node-fetch";
const tough = require("tough-cookie");
const Cookie = tough.Cookie;

interface RequestParam {
  headers?: {
    "User-Agent": string;
  };
}
class Request {
  private headers: any = {
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    //    "referrer": "https://mbasic.facebook.com/"
  };
  private cookie = new tough.CookieJar();
  readonly BASEURL = "https://mbasic.facebook.com";
  private tmpHeader;
  constructor() {}

  setUserAgent(userAgent) {
    if (!userAgent) return;
    this.headers["User-Agent"] = userAgent;
  }

  setCookie(cookieString, url?: string) {
    if (!cookieString) return;
    let cookies = cookieString.split(";");
    for (let c of cookies) {
      if (!c.trim()) {
        continue;
      }
      this.cookie.setCookieSync(c.trim(), this.BASEURL);
    }
  }

  setReferrer(referrer) {
    this.headers["referrer"] = referrer;
  }

  getHeaders() {
    let header = {
      ...this.headers,
      cookie: this.cookie.getCookieStringSync(this.BASEURL),
      ...this.tmpHeader,
    };

    this.tmpHeader = {};
    return header;
  }

  setTempHeader(headers) {
    this.tmpHeader = headers;
  }

  async request({
    url,
    method = "GET",
    body,
  }: {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: any;
  }) {
    let result = await fetch(url, {
      method: method,
      headers: this.getHeaders(),
      body: body,
      referrerPolicy: "origin-when-cross-origin",
      mode: "cors",
      credentials: "include"
    });
    let cookies = result.headers.raw()["set-cookie"];
    // console.log("cookies", cookies)
    // if (cookies) cookies.map((c) => { this.cookie.addCookie(c) })
    return result;
  }

  async get(url) {
    return this.request({
      url,
    });
  }

  async post(url, data) {
    return this.request({
      url,
      body: data,
      method: "POST",
    });
  }
}

export default Request;
