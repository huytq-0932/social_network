import ActionStrategy from "./ActionStrategy";
import BaseStrategy from './BaseStrategy';
import Request from "../../request";
const cheerio = require("cherio");
import Helper from "../../helper";
import formurlencoded from "form-urlencoded";
interface Param {
  content: string;
  groupId?: string;
  postId: string;
}

class CommentStrategy extends BaseStrategy   implements ActionStrategy {
  private content: string;
  private groupId: string;
  private postId: string;
  constructor({ content, groupId, postId }: Param) {
    super();
    this.content = content; //nội dung của comment
    this.postId = postId;
    this.groupId = groupId;
  }

  public setContent(content: string) {
    this.content = content;
  }
  private assignGroupIdIfNull() {
    this.groupId = this.groupId || Helper.randomRange(1, 9999999999) + "";
  }
  public async run() {
    this.assignGroupIdIfNull();
    const postUrl = `${this.request.BASEURL}/story.php?story_fbid=${this.postId}&id=${this.groupId}`;
    this.request.setReferrer(`${this.request.BASEURL}/story.php?story_fbid=${this.postId}&id=${this.groupId}`);
    let response = await this.request.get(postUrl);
    let responseText = await response.text();

    let $ = cheerio.load(responseText);

    const form = $("form").first();
    const action = form.attr("action");
    const inputs = $("input", form);
    let data = {};
    for (let i = 0; i < inputs.length; i++) {
      let inpName = $(inputs[i]).attr("name");
      let inpValue = $(inputs[i]).attr("value");
      if (inpValue == null || inpName == null) continue;
      data[inpName] = inpValue;
    }

    data["comment_text"] = this.content;
    console.log(data, action);
    if (action) {
      this.request.setTempHeader({
        "content-type": "application/x-www-form-urlencoded"
      });
      response = await this.request.post(
        `${this.request.BASEURL}${action}`,
        formurlencoded(data)
      );

      let responseText = await response.text();
      console.log(responseText);
      return response.ok ? 1 : 0;
    }

    return 0;
  }
}

export default CommentStrategy;
