import Action from "./Action";
import {
  CheckLoginStrategy,
  CommentStrategy,
  PostStategy,
  ReactionStrategy,
  LikePageStrategy,
} from "@app/Services/Facebook/modules/user/strategy";

interface UserParam {
  cookie: string;
  proxy?: string;
  userAgent?: string;
}

class User {
  private action: Action;

  constructor({ cookie, proxy, userAgent }: UserParam) {
    this.action = new Action({ cookie, proxy, userAgent });
  }

  async checkLogin() {
    this.action.setActionStrategy(new CheckLoginStrategy());
    return await this.action.run();
  }

  async comment({ postId, content, groupId }: { postId: string; content: string, groupId: string }) {
    this.action.setActionStrategy(new CommentStrategy({ postId, content, groupId }));
    return await this.action.run();
  }

  async reaction({ postId, groupId }: { postId: string, groupId: string }) {
    this.action.setActionStrategy(new ReactionStrategy({ postId }));
    return await this.action.run();
  }
}

export default User;
