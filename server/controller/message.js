const db = require("../model/db");
class Message {
  async layout(ctx) {
    const { uId } = ctx.request.body;
    if (!uId) {
      return (ctx.body = {
        code: 0
      });
    } else {
      let pSql = `SELECT
      'private' as type,
      pm.pmFUId AS id,
      ud.udFace AS face,
      SUM( CASE pm.pmUnread WHEN '1' THEN 1 ELSE 0 END ) AS unread,
      (
    SELECT
      pmt.pmContent 
    FROM
      privateMessages pmt 
    WHERE
      ( pmt.pmFUId = pm.pmFUId AND pmt.pmTUId = pm.pmTUId ) 
    ORDER BY
      pmt.createdAt DESC 
      LIMIT 1 
      ) AS content,
      (
    SELECT
      pmt.createdAt 
    FROM
      privateMessages pmt 
    WHERE
      ( pmt.pmFUId = pm.pmFUId AND pmt.pmTUId = pm.pmTUId ) 
    ORDER BY
      pmt.createdAt DESC 
      LIMIT 1 
      ) AS time,
      (ifnull(f.fNote,ud.udNickname)) AS name 
    FROM
      privateMessages pm
      JOIN userDetails ud ON pm.pmFUId = ud.udUId
      LEFT JOIN friends f ON pm.pmFUId = f.fFUId 
      AND pm.pmTUId = f.fUId 
    WHERE
      pm.pmTUId = ? 
    GROUP BY
      pm.pmFUId
      `;
      const pt = await db.query(pSql, {
        type: db.QueryTypes.SELECT,
        replacements: [uId]
      });
      const pRows = pt.filter(v => v.unread != "0");
      const gSql = `SELECT
      'group' as type,
      gu.guGId AS id,
      '0' AS unread,
      g.groupName AS name,
      g.groupFace AS face,
      ( SELECT gmt.gmContent FROM groupMessages gmt WHERE gmt.gmGId = gu.guGId ORDER BY gmt.createdAt DESC LIMIT 1 ) AS content,
      ( SELECT gmt.createdAt FROM groupMessages gmt WHERE gmt.gmGId = gu.guGId ORDER BY gmt.createdAt DESC LIMIT 1 ) AS time 
    FROM
      groupUsers gu
      JOIN groupMessages gm ON gm.gmGId = gu.guGId
      JOIN groups g ON g.groupId = gu.guGId 
    WHERE
      guUId = ?
    GROUP BY
      gu.guGId`;
      const gRows = await db.query(gSql, {
        type: db.QueryTypes.SELECT,
        replacements: [uId]
      });
      ctx.body = {
        code: 1,
        private: pRows,
        group: gRows
      };
    }
  }

  async removeUnread(ctx) {
    const { tuId, fuId } = ctx.request.body;
    const sql = `update privateMessages set pmUnread='0' where pmTUId =? and pmFUId =?`;
    await db.query(sql, {
      type: db.QueryTypes.UPDATE,
      replacements: [tuId, fuId]
    });
    ctx.body = {
      code: 1
    };
    return;
  }

  async get(ctx) {
    const { type } = ctx.request.body;
    if (type === "private") {
      const { tuId, fuId } = ctx.request.body;

      const lSql = `SELECT pmContent as value, 'left' as 'type',createdAt  from privateMessages WHERE (pmTUId=? and pmFUId=?)`;
      const lefts = await db.query(lSql, {
        type: db.QueryTypes.SELECT,
        replacements: [fuId + "", tuId + ""]
      });
      const rSql = `SELECT pmContent as value, 'right' as 'type',createdAt  from privateMessages WHERE (pmTUId=? and pmFUId=?)`;
      const rights = await db.query(rSql, {
        type: db.QueryTypes.SELECT,
        replacements: [tuId + "", fuId + ""]
      });
      const contents = lefts.concat(rights);
      contents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const iSql = `SELECT
      u.uDeviceStatus AS status,
      f.fNote AS note,
      ud.udFace AS face,
      ttf.fNote
    FROM
      users u
      JOIN userDetails ud ON u.uId = ud.udUId
      JOIN friends ttf ON ttf.fUId = u.uId 
      AND ttf.fFUId = ?
      LEFT JOIN friends f ON f.fUId = ?
      AND f.fFUId = u.uId 
    WHERE
      u.uId = ?`;
      const i = await db.query(iSql, {
        type: db.QueryTypes.SELECT,
        replacements: [fuId, fuId, tuId + ""]
      });
      if (i.length !== 0) {
        let v = i[0];
        let statusText =
          v.status == "0"
            ? "离线请留言"
            : v.status == "1"
              ? "手机在线"
              : v.status == "2"
                ? "3G在线"
                : v.status == "3"
                  ? "4G在线"
                  : v.status == "4"
                    ? "WiFi在线"
                    : "电脑在线";
        v["statusText"] = statusText;
        ctx.body = {
          code: 1,
          contents,
          ...v,
          id: tuId
        };
        return;
      }
    }
    if (type === "group") {
      const { tuId, fuId } = ctx.request.body;
      const lSql = `SELECT
      gm.gmUId as id,
      gm.gmContent AS 'value',
      ud.udFace as face,
      gu.guName as name,
      'left' AS type,
      gm.createdAt 
    FROM
      groupMessages gm join userDetails ud on ud.udUId = gmUId
      join groupUsers gu on guGId = gmGId and guUId = gmUId
    WHERE
      gmGId = ? 
      AND gmUId != ?`;
      const lefts = await db.query(lSql, {
        type: db.QueryTypes.SELECT,
        replacements: [tuId + "", fuId + ""]
      });
      const rSql = `SELECT
      gm.gmUId as id,
      gm.gmContent AS 'value',
      ud.udFace as face,
      gu.guName as name,
      'right' AS type,
      gm.createdAt 
    FROM
      groupMessages gm join userDetails ud on ud.udUId = gmUId
      join groupUsers gu on guGId = gmGId and guUId = gmUId
    WHERE
      gmGId = ? 
      AND gmUId = ?`;
      const rights = await db.query(rSql, {
        type: db.QueryTypes.SELECT,
        replacements: [tuId + "", fuId + ""]
      });
      const contents = lefts.concat(rights);
      contents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const iSql = `SELECT
      groupName as name,
      groupFace as face,
      gu.guName as uName
     FROM
       groups join groupUsers gu on gu.guGId = groupId
     WHERE
       groupId = ? and gu.guUId =?
     `;
      const i = await db.query(iSql, {
        type: db.QueryTypes.SELECT,
        replacements: [tuId + "", fuId + ""]
      });
      if (i.length !== 0) {
        let payload = i[0];
        ctx.body = {
          code: 1,
          contents,
          ...payload,
          id: tuId
        };
        return;
      }
    }
    ctx.body = {
      code: 0
    };
  }
}

module.exports = new Message();
