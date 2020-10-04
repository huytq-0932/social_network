import lodash from "lodash";
import Request from '../../request';
interface ActionStrategy {
    readonly proxy?: string;
    readonly request?: Request;
    // userAgent?: string
    setProxy(proxy);
    setCookie(cookie);
    setUserAgent(userAgent);
    run();
}

export default ActionStrategy;