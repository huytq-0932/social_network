import ActionStrategy from './ActionStrategy';
import BaseStrategy from './BaseStrategy';
const cheerio = require('cherio')
import formurlencoded from "form-urlencoded";

interface Param {
    content: string
}

class PostStrategy extends BaseStrategy implements ActionStrategy {
    private content: string;
    constructor({content }: Param) {
      super()
        this.content = content;
    }
    
    public async run () {
        this.request.setReferrer(`${this.request.BASEURL}`);
        let response = await this.request.get(this.request.BASEURL);
        let responseText = await response.text();

        let $ = cheerio.load(responseText);
        const form = $("#mbasic-composer-form").first();
        const action = form.attr("action");
        const inputs = $("input", form);
        let data = {};
        for (let i = 0; i < inputs.length; i++) {
          let inpName = $(inputs[i]).attr("name");
          let inpValue = $(inputs[i]).attr("value");
          if (inpValue == null || inpName == null) continue;
          data[inpName] = inpValue;
        }
    
        data["xc_message"] = this.content;
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

export default PostStrategy;