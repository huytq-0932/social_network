import BaseStrategy from './BaseStrategy';
import ActionStrategy from './ActionStrategy';
import Request from '../../request';
const cheerio = require('cherio')

class CheckLoginStrategy extends BaseStrategy  implements ActionStrategy{
    constructor() {
        super()
    }
    
    public async run () {
        this.request.setReferrer(this.request.BASEURL)
        let response = await this.request.get(this.request.BASEURL)
        //if (!response.ok) throw new Error(response.statusText)
        const responseText = await response.text();
        const $ = cheerio.load(responseText)
        return $("textarea").length
    }
}

export default CheckLoginStrategy;