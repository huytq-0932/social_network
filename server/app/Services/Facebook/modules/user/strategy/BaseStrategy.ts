import Request from "../../request";
class BaseStrategy {
  proxy: string;
  readonly request: Request;
  constructor() {
    this.request = new Request();
  }

  setProxy(proxy: string) {
    this.proxy = proxy;
  }
  setCookie(cookie: string) {
    this.request.setCookie(cookie);
  }
  setUserAgent(userAgent: string) {
    this.request.setUserAgent(userAgent);
  }
}

export default BaseStrategy;
