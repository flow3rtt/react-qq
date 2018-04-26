
const { resolve } = require('path')
const _  =require('lodash')
const send = require('koa-send')

const staticMiddleware = (root, opts)=> {
  opts = _.assign({}, opts)
  opts.root = resolve(root)
  if (opts.index !== false) opts.index = opts.index || 'index.html'
    return async function serve (ctx, next) {
      let done = false
        let at  =/^\/api\/v1\/static(\/.+)$/.exec(ctx.path)
        let path = ctx.path;
        if(!!at&&at.length>=2){
            path = at[1];
        }
      if (ctx.method === 'HEAD' || ctx.method === 'GET') {
        try {
          done = await send(ctx, path, opts)
        } catch (err) {
          if (err.status !== 404) {
            throw err
          }
        }
      }

      if (!done) {
        await next()
      }
    }
}
module.exports = staticMiddleware
