import lodash from "lodash";
import ActionStrategy from "./strategy/ActionStrategy";
interface Param {
    cookie?: string,
    proxy?: string,
    userAgent?: string
  }
  
class Action {
    private strategy: ActionStrategy;
    readonly cookie: string;
    readonly proxy: string;
    readonly userAgent: string;
    constructor({ cookie, proxy, userAgent }:Param){
        this.cookie = cookie;
        this.proxy = proxy;
        this.userAgent = userAgent;
    }

    public setActionStrategy(strategy: ActionStrategy) {
        this.strategy = strategy;
        this.strategy.setCookie(this.cookie);
        this.strategy.setProxy(this.proxy);
        this.strategy.setUserAgent(this.userAgent);
    }
 
    async run() {
        return await this.strategy.run();
    }
}

export default Action;