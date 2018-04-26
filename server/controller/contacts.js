const db = require("../model/db");
const _ = require("lodash");
class Contacts {
  async get(ctx) {
    const { uId } = ctx.request.body;
    const fSql = `SELECT
    u.uId AS id,
    f.fNote AS note,
    f.fConcern AS concern,
    ud.udFace AS face,
    ud.udSignature AS sign,
    v.vipType AS type,
    u.uDeviceStatus AS status 
  FROM
    friends f
    JOIN users u ON f.fFUId = u.uId
    JOIN userDetails ud ON f.fFUId = ud.udUId
    LEFT JOIN vips v ON v.vipUId = f.fFUId 
  WHERE
    f.fUId =? 
    AND f.fIs ='1'`;
    const giSql = `SELECT
    g.groupingName AS name,
    g.groupingUIds AS uids 
  FROM
    groupings g 
  WHERE
    g.gUId =?`;
    const fRows = await db.query(fSql, {
      type: db.QueryTypes.SELECT,
      replacements: [uId]
    });
    const giRows = await db.query(giSql, {
      type: db.QueryTypes.SELECT,
      replacements: [uId]
    });
    let friends = {};
    for (let gi of giRows) {
      let { name, uids } = gi;
      const uidsa = uids.split(",").map(v => +v);
      if (!friends[name]) {
        friends[name] = [];
      }
      for (let f of fRows) {
        if (uidsa.includes(+f.id)) {
          let statusText =
            f.status == "0"
              ? "离线请留言"
              : f.status == "1"
                ? "手机在线"
                : f.status == "2"
                  ? "3G在线"
                  : f.status == "3"
                    ? "4G在线"
                    : f.status == "4" ? "WiFi在线" : "电脑在线";
          f["statusText"] = statusText;
          friends[name].push(f);
        }
      }
    }
    const gSql = `SELECT
    g.groupId as id,
    gu.guRole as role,
    g.groupName as name,
    g.groupFace as face
  FROM
    groupUsers gu
    JOIN groups g ON gu.guGId = g.groupId 
  WHERE
    gu.guUId = ?`;
    let groups = await db.query(gSql, {
      type: db.QueryTypes.SELECT,
      replacements: [uId]
    });
    ctx.body = {
      code: 1,
      groups,
      friends
    };
  }
}

module.exports = new Contacts();
