const userDao = require("../model/user");
const fDao = require("../model/friend");
const giDao = require("../model/grouping");
const guDao = require("../model/groupUser");
const groupDao = require("../model/group");
const { Op } = require("sequelize");
const CryptoJS = require("crypto-js");
const _token = require("jsonwebtoken");
const db = require("../model/db");
const passwordKey = "_+qq+_";
const _ = require("lodash");
class User {
  async login(ctx) {
    let { val, password } = ctx.request.body;
    const model = await userDao.findOne({
      where: {
        [Op.or]: [
          {
            uQq: val
          },
          {
            uPhone: val
          }
        ]
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "uSocketId"]
      }
    });
    if (!model) {
      ctx.body = {
        code: 0,
        message: "账号不存在!"
      };
    } else {
      let t = CryptoJS.AES.decrypt(model.uPassword, passwordKey).toString(
        CryptoJS.enc.Utf8
      );
      if (t !== password) {
        ctx.body = {
          code: 0,
          message: "密码错误!"
        };
      } else {
        await db.transaction(async t => {
          const detail = await model.getUD({
            attributes: {
              exclude: ["createdAt", "updatedAt", "uId"]
            }
          });
          const vip = await model.getVip({
            attributes: {
              exclude: ["createdAt", "updatedAt", "uId"]
            }
          });
          let { uPassword, updatedAt, ...mt } = model.get({
            //bug
            plain: true
          });
          ctx.body = {
            code: 1,
            message: "登陆成功!",
            token: _token.sign(model.uId, global.secret),
            uId: model.uId,
            info: _.assign(
              {},
              mt,
              detail.get({
                plain: true
              }),
              vip.get({
                plain: true
              })
            )
          };
        });
      }
    }
  }
  async logout(ctx) {
    let { uId } = ctx.request.body;
    const model = await userDao.findById(uId);
    if (!!model) {
      model.uStatus = "0";
      model.uDeviceStatus = "0";
      await model.save();
      ctx.body = {
        code: 1
      };
    } else {
      ctx.body = {
        code: 0
      };
    }
  }
  async register(ctx) {
    const { nickname, phone, password } = ctx.request.body;
    let uQq = User.generateQQ(); //this is undefind
    while (1) {
      const uId = await userDao.findOne({
        where: {
          uQq
        },
        attributes: ["uId"]
      });
      if (!uId) {
        break;
      } else {
        uQq = User.generateQQ();
      }
    }
    await db.transaction(async t => {
      const model = await userDao.create(
        {
          uQq,
          uPhone: phone,
          uPassword: CryptoJS.AES.encrypt(password, passwordKey) + ""
        },
        {
          transaction: t
        }
      );


      if (!!model) {


        await model.createUD(
          {
            udNickname: nickname,
            udFace: `/img/udf-${_.random(1, 8)}.png`
          },
          {
            transaction: t
          }
        );
        await model.createGrouping(
          {
            groupingName: "特别关心"
          },
          {
            transaction: t
          }
        );
        await model.createGrouping(
          {
            groupingName: "我的好友",
            groupingDefault: true
          },
          {
            transaction: t
          }
        );
        await model.createVip(
          {},
          {
            transaction: t
          }
        );
        await guDao.create({
          guRole: '0',
          guName: nickname,
          guGId: '1',
          guUId: model.uId
        },{
          transaction: t
        });
        ctx.body = {
          code: 1,
          uQq
        };
      } else {
        ctx.body = {
          code: 0,
          message: "未知错误,注册失败!"
        };
      }
    });
  }
  async auth(ctx) {
    const token = ctx.headers["authorization"].split(" ")[1];
    const uId = _token.verify(token, global.secret);
    const model = await userDao.findById(uId, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "uSocketId"]
      }
    });
    if (!!model) {
      const detail = await model.getUD({
        attributes: {
          exclude: ["createdAt", "updatedAt", "uId"]
        }
      });
      const vip = await model.getVip({
        attributes: {
          exclude: ["createdAt", "updatedAt", "uId"]
        }
      });
      let { uPassword, updatedAt, ...mt } = model.get({
        plain: true
      });
      ctx.body = {
        code: 1,
        uId,
        info: _.assign(
          {},
          mt,
          detail.get({
            plain: true
          }),
          vip.get({
            plain: true
          })
        )
      };
    } else {
      ctx.body = {
        code: 2
      };
    }
  }
  async validateCode(ctx) {
    const { code } = ctx.request.body;
    if (code.trim() === "111111") {
      ctx.body = {
        code: 1
      };
    } else {
      ctx.body = {
        code: 0,
        message: "验证码错误!"
      };
    }
  }

  async checkPhone(ctx) {
    const { phone } = ctx.request.body;
    const uId = await userDao.findOne({
      where: {
        uPhone: phone
      },
      attributes: ["uId"]
    });
    if (!!uId) {
      ctx.body = {
        code: 0,
        message: "该手机号已存在!"
      };
    } else {
      ctx.body = {
        code: 1
      };
    }
  }
  async getFriends(ctx) {
    const { uId } = ctx.request.body;
    const sql = `SELECT
    u.uId as 'id',
    ud.udNickname as 'name',
    ud.udAge as 'age',
    ud.udSex as 'sex',
    ud.udConstellation as 'xz',
    ud.udPlace as 'place',
    ud.udFace as 'face',
    ud.udSignature as 'qm'
  FROM
    users u join userDetails ud on ud.udUId = u.uId
  WHERE
    u.uId NOT IN ( SELECT f.fFUId FROM friends f WHERE f.fIs = '1' AND f.fUId = ? ) 
    AND u.uId != ?`;
    const result = await db.query(sql, {
      type: db.QueryTypes.SELECT,
      replacements: [uId + "", uId + ""]
    });
    ctx.body = {
      code: 1,
      result
    };
  }
  async getGroups(ctx){
    const { uId } = ctx.request.body;
    const sql =`SELECT
    g.groupName AS 'name',
    g.groupIntro AS 'intro',
    g.groupId AS 'id',
    g.groupFace AS 'face',
    ( SELECT count( gut.guUId ) FROM groupUsers gut WHERE gut.guGId = g.groupId ) AS 'count' 
  FROM
    groups g 
  WHERE
    g.groupId NOT IN ( SELECT gu.guGId FROM groupUsers gu WHERE gu.guUId = ? )`
    const result = await db.query(sql, {
      type: db.QueryTypes.SELECT,
      replacements: [uId + ""]
    });
    ctx.body = {
      code: 1,
      result
    };
  }
  async addFriend(ctx) {
    const { id, fId, note, name } = ctx.request.body;
    await fDao.create({
      fNote: note,
      fIs: true,
      fUId: id,
      fFUId: fId
    });
    await fDao.create({
      fNote: name,
      fIs: true,
      fUId: fId,
      fFUId: id
    });
    const t = await giDao.findOne({
      where: {
        gUId: id,
        groupingDefault: true
      }
    });
    const ft = await giDao.findOne({
      where: {
        gUId: fId,
        groupingDefault: true
      }
    });
    t.groupingUIds = !t.groupingUIds ? fId : t.groupingUIds + "," + fId;
    ft.groupingUIds = !ft.groupingUIds ? id : ft.groupingUIds + "," + id;
    await t.save();
    await ft.save();
    ctx.body = {
      code: 1
    };
  }
  async addGroup(ctx) {
    const { id, gId,  name } = ctx.request.body;
    await guDao.create({
      guRole: '0',
      guName: name,
      guGId: gId,
      guUId: id
    });
    ctx.body = {
      code: 1
    };
  }
  async cg(ctx) {
    const { id,name,uName} = ctx.request.body;
    const model =await groupDao.create({
      groupName: name,
      groupIntro:'',
      gCUId:id
    });
    await guDao.create({
      guRole: '2',
      guName: uName,
      guGId: model.groupId,
      guUId: id
    });
    ctx.body = {
      code: 1
    };
  }
  static generateQQ() {
    let qq = "";
    let n = Math.round(Math.random() * 2 + 8);
    let first = Math.round(Math.random() * 8 + 1);
    qq += first;
    for (let i = 0; i < n - 1; i++) {
      qq += Math.round(Math.random() * 9);
    }
    return qq;
  }
}

module.exports = new User();
