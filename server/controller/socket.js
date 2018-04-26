const userDao = require("../model/user");
const db = require("../model/db");
const PM = require("../model/privateMessage");
const GM = require("../model/groupMessage");
const _ = require("lodash");
class Socket {
  async login(uId, uSocketId) {
    await db.transaction(async t => {
      await userDao.update(
        {
          uSocketId,
          uLastLoginTime: Date.now(),
          uStatus: "1",
          uDeviceStatus: _.random(1, 4) + ""
        },
        {
          where: {
            uId
          },
          transaction: t
        }
      );
    });
  }
  async getSocketId(toId) {
    const sql = `select uSocketId as socketId from users where uId=? limit 1`;
    const r = await db.query(sql, {
      type: db.QueryTypes.SELECT,
      replacements: [toId]
    });
    return r.length !== 0 ? r[0].socketId : "";
  }
  async getSocketIds(id,toId) {
    const sql = `SELECT u.uSocketId as socketIds from groupUsers gu join users u on u.uId = gu.guUId  WHERE gu.guGId=? and guUId !=?`;
    const socketIds = await db.query(sql, {
      type: db.QueryTypes.SELECT,
      replacements: [toId,id]
    });
    return socketIds.map(v=>v.socketIds);
  }
  async saveMessage(payload,type) {
    if(type==='private'){
      await PM.create({
        pmContent: payload.content,
        pmUnread: "1",
        pmFUId: payload.id,
        pmTUId: payload.toId,
        createdAt: new Date()
      });
    }else{
      await GM.create({
        gmContent:payload.content,
        createdAt: new Date(),
        gmGId:payload.toId,
        gmUId:payload.id
      })
    }
  }
}

module.exports = new Socket();
