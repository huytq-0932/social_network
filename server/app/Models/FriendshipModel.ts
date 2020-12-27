import BaseModel from "./BaseModel";

class FriendshipModel extends BaseModel {
  static tableName = "friendship";

  static Constant = {
    STATUS_REQUEST: 1,
    STATUS_FRIEND: 2,
    STATUS_BLOCK: 3
  };

  //fields
  id: number;
  user_one_id: number;
  user_two_id: number;
  status: number;
  action_user_id: number;
  createdAt: string;
  updatedAt: string;

  static async getFriendship(firstUserId, secondUserId) {
    const friendships = await this.query()
      .select()
      .where({
        user_one_id: firstUserId,
        user_two_id: secondUserId
      })
      .orWhere({
        user_one_id: secondUserId,
        user_two_id: firstUserId
      });
    return friendships[0];
  }

  static async removeFriendship(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId);
    if (friendship) {
      await this.query().findOne({id: friendship.id}).del();
      return true;
    }
    return false;
  }

  static async acceptFriendRequest(senderId, receiverId) {
    if (!(await this.isRequesting(senderId, receiverId))) return false;
    return this.query()
      .update({
        status: FriendshipModel.Constant.STATUS_FRIEND,
        action_user_id: receiverId
      })
      .where({
        user_one_id: senderId,
        user_two_id: receiverId
      });
  }

  static async sendRequest(senderId, receiverId) {
    if (await this.getFriendship(senderId, receiverId)) return false;
    return this.query().insert({
      user_one_id: senderId,
      user_two_id: receiverId,
      status: FriendshipModel.Constant.STATUS_REQUEST,
      action_user_id: senderId
    });
  }

  static async block(blockerId, isBlockedUserId) {
    const isBlocked = await this.isBlocked(blockerId, isBlockedUserId);
    if (isBlocked) return false;

    const friendship = await this.getFriendship(blockerId, isBlockedUserId);
    if (!friendship) {
      return this.query().insert({
        user_one_id: blockerId,
        user_two_id: isBlockedUserId,
        status: FriendshipModel.Constant.STATUS_BLOCK,
        action_user_id: blockerId
      });
    }
    return this.query()
      .update({
        status: FriendshipModel.Constant.STATUS_BLOCK,
        action_user_id: blockerId
      })
      .where({
        user_one_id: blockerId,
        user_two_id: isBlockedUserId
      })
      .orWhere({
        user_one_id: isBlockedUserId,
        user_two_id: blockerId
      });
  }

  static async unblock(blockerId, isBlockedUserId) {
    const isBlocked = await this.isBlocked(blockerId, isBlockedUserId);
    if (!isBlocked) return false;
    return this.removeFriendship(blockerId, isBlockedUserId);
  }

  static async getSentRequests(userId) {
    return this.query().where({
      action_user_id: userId,
      status: FriendshipModel.Constant.STATUS_REQUEST
    });
  }

  static async getReceivedRequests(userId) {
    return this.query()
      .whereNot({action_user_id: userId})
      .andWhere({user_two_id: userId, status: FriendshipModel.Constant.STATUS_REQUEST});
  }

  static async getUserFriends(userId) {
    return this.query()
      .where({user_one_id: userId, status: FriendshipModel.Constant.STATUS_FRIEND})
      .orWhere({user_two_id: userId, status: FriendshipModel.Constant.STATUS_FRIEND});
  }

  static async getMultipleFriendsCount(firstUserId, secondUserId) {
    const firstFriends = (await this.getUserFriends(firstUserId)).map((friendship) =>
      friendship.user_two_id == firstUserId ? friendship.user_one_id : friendship.user_two_id
    );
    const secondFriends = (await this.getUserFriends(secondUserId)).map((friendship) =>
      friendship.user_two_id == firstUserId ? friendship.user_one_id : friendship.user_two_id
    );
    return firstFriends.filter((id) => secondFriends.includes(id) && id != secondUserId).length;
  }

  static async getBlockedFriendship(userId) {
    return this.query().where({
      action_user_id: userId,
      status: FriendshipModel.Constant.STATUS_BLOCK
    });
  }

  static async isBlockedTogether(user_one_id, user_two_id) {
    let list = await this.query()
      .where({user_one_id, user_two_id, status: FriendshipModel.Constant.STATUS_BLOCK})
      .orWhere({
        user_one_id: user_two_id,
        user_two_id: user_one_id,
        status: FriendshipModel.Constant.STATUS_BLOCK
      });
    return Boolean(list.length);
  }

  static async isFriend(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId);
    return friendship && friendship.status == FriendshipModel.Constant.STATUS_FRIEND;
  }

  static async isBlocked(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId);
    return friendship && friendship.status == FriendshipModel.Constant.STATUS_BLOCK;
  }

  static async isRequesting(senderId, receivedId) {
    const friendship = await this.getFriendship(senderId, receivedId);
    return (
      friendship &&
      friendship.status == FriendshipModel.Constant.STATUS_REQUEST &&
      friendship.action_user_id == senderId
    );
  }
}

export default FriendshipModel;
