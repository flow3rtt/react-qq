const Router =require('koa-router')
const user = require('./controller/user')
const message = require('./controller/message')
const contacts = require('./controller/contacts')
const router = new Router({
    prefix:'/api/v1'
})

router.get('/userAuth',user.auth)
router.post('/message/layout',message.layout)
router.post('/message/remove_unread',message.removeUnread)
router.post('/message/get',message.get)
router.post('/contacts',contacts.get)
router.post('/login',user.login)
router.post('/logout',user.logout)
router.post('/register',user.register)
router.post('/checkPhone',user.checkPhone)
router.post('/validateCode',user.validateCode)
router.post('/get_friends',user.getFriends)
router.post('/get_groups',user.getGroups)
router.post('/add_friend',user.addFriend)
router.post('/add_group',user.addGroup)
router.post('/cg',user.cg)

module.exports = router;



