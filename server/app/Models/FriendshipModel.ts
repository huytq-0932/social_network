import BaseModel from "./BaseModel";

class FriendshipModel extends BaseModel {
  static tableName = "friendship";
  static NO_FRIENDSHIP = -1
  static REQUEST = 1
  static FRIEND = 2
  static BLOCK = 3

  static ACCEPT_REQUEST = "1"
  static REJECT_REQUEST = "0"

  //fields
  id: number;
  user_one_id: number;
  user_two_id: number;
  status: number;
  action_user_id: number;
  createdAt: string;
  updatedAt: string;

  static async getFriendship(firstUserId, secondUserId) {
    const friendships = await this.query().select().where({
      user_one_id: firstUserId,
      user_two_id: secondUserId
    }).orWhere({
      user_one_id: secondUserId,
      user_two_id: firstUserId
    })
    if (friendships.length != 1) return false
    return friendships[0]
  }

  static async removeFriendship(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId)
    if (friendship) {
      this.query().del()
      return true
    }
    return false
  }

  static async acceptFriendRequest(senderId, receiverId) {
    if (!(await this.isRequesting(senderId, receiverId))) return false
    return this.query().update({
      status: FriendshipModel.FRIEND,
      action_user_id: receiverId
    })
      .where({
        user_one_id: senderId,
        user_two_id: receiverId
      })
  }

  static async sendRequest(senderId, receiverId) {
    if ((await this.getFriendship(senderId, receiverId))) return false
    return this.query().insert({
      user_one_id: senderId,
      user_two_id: receiverId,
      status: FriendshipModel.REQUEST,
      action_user_id: senderId
    })
  }

  static async block(blockerId, isBlockedUserId) {
    const friendship = await this.getFriendship(blockerId, isBlockedUserId)
    if (!friendship) {
      return this.query().insert({
        user_one_id: blockerId,
        user_two_id: isBlockedUserId,
        status: FriendshipModel.BLOCK,
        action_user_id: blockerId
      })
    }
    return this.query().update({
      status: FriendshipModel.BLOCK,
      action_user_id: blockerId
    })
      .where({
        user_one_id: blockerId,
        user_two_id: isBlockedUserId
      })
      .orWhere({
        user_one_id: isBlockedUserId,
        user_two_id: blockerId
      })
  }

  static async getSentRequests(userId) {
    return this.query().where({action_user_id: userId, status: FriendshipModel.REQUEST})
  }

  static async getReceivedRequests(userId) {
    return this.query()
      .whereNot({action_user_id: userId})
      .andWhere({user_two_id: userId, status: FriendshipModel.REQUEST})
  }

  static async unblock(blockerId, isBlockedUserId) {
    if (await this.isBlocked(blockerId, isBlockedUserId)) return false
    return this.removeFriendship(blockerId, isBlockedUserId)
  }

  static async isFriend(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId)
    return friendship && friendship.status == FriendshipModel.FRIEND
  }

  static async isBlocked(firstUserId, secondUserId) {
    const friendship = await this.getFriendship(firstUserId, secondUserId)
    return friendship && friendship.status == FriendshipModel.BLOCK
  }

  static async isRequesting(senderId, receivedId) {
    const friendship = await this.getFriendship(senderId, receivedId)
    return friendship && friendship.status == FriendshipModel.REQUEST && friendship.action_user_id == senderId
  }
}

export default FriendshipModel;
