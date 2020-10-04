import ActionStrategy from "./ActionStrategy";
import BaseStrategy from './BaseStrategy';
const cheerio = require("cherio");

interface Param {
  pageId: string;
}

class LikePageStrategy extends BaseStrategy implements ActionStrategy {
  private pageId: string;

  constructor({ pageId }: Param) {
    super();
    this.pageId = pageId;
  }

  public async run() {
    this.request.setReferrer(`${this.request.BASEURL}/`);
    this.pageId = encodeURI(this.pageId);

    let response = await this.request.get(
      `${this.request.BASEURL}/${this.pageId}`
    );
    let responseText = await response.text();
    let $ = cheerio.load(responseText);
    let aTag = $('a[href*="/a/profile.php?fan"]').first();
    if(aTag){
      let href = aTag.attr("href");
      this.request.setReferrer(`${this.request.BASEURL}/pages/more/${this.pageId}/`);
      let response = await this.request.get(
        `${this.request.BASEURL}/${href}`
      );
      return response.ok ? 1 : 0;
    }
    
    return 0;
  }
}

export default LikePageStrategy;
