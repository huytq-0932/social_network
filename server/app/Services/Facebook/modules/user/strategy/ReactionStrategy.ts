import ActionStrategy from './ActionStrategy';
import BaseStrategy from './BaseStrategy';
const cheerio = require('cherio')
import Helper from "../../helper";
const randomItem = require('random-item');

interface Param {
    groupId?: string,
    type?: number,
    postId: string
}

class ReactionStrategy extends BaseStrategy implements ActionStrategy {
    private groupId: string;
    private postId: string;
    private type: number;

    constructor({groupId, type, postId }: Param) {
        super();
        this.groupId = groupId
        this.postId = postId
        this.type = type
    }
    private assignGroupIdIfNull () {
        this.groupId = this.groupId ||( Helper.randomRange(1, 9999999999) + "")
    }
    public async run () {
        this.assignGroupIdIfNull();
        this.request.setReferrer(`${this.request.BASEURL}/story.php?story_fbid=${this.postId}&id=${this.groupId}`)
        let response = await this.request.get(`${this.request.BASEURL}/reactions/picker/?ft_id=${this.postId}`)
        let responseText = await response.text();
        let $ = cheerio.load(responseText)
        if(!this.type){
            this.type = randomItem([1, 2, 16]);
        }
        
        const url = Helper.getLinks($, `reaction_type=${this.type}`);
        if (url.length > 0) {
            response = await this.request.get(`${this.request.BASEURL}/${url[0]}`);
            return response.ok ? 1 : 0
        }
        return 0
    }
}

export default ReactionStrategy;