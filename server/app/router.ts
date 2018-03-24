/*
 * @Author: cuiweiqiang
 * @Date:   2018-02-02 11:25:28
 * @Last Modified by:   cuiweiqiang
 * @Last Modified time: 2018-03-05 15:57:47
 */

export default (app) => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.get('/doc', controller.home.doc);

    const auth = app.middlewares.auth();

    router.get ('/api/v1/captcha', controller.v1.session.getCaptcha);
    router.post('/api/v1/login'  , controller.v1.session.login);

    router.post('/api/v1/login/verifyMobile', auth, controller.v1.session.needVerifyMobile);
    router.post('/api/v1/changepasswd',       auth, controller.v1.session.changePasswd);
    router.post('/api/v1/logout' ,            auth, controller.v1.session.logout);

    router.get ('/api/v1/sms/:mobile'      , auth, controller.v1.sms.create);
    router.post('/api/v1/sms/:mobile/:code', auth, controller.v1.sms.verify);

    router.get('/api/v1/permissions', auth, controller.v1.permissions.index);

    router.post('/api/v1/users'    , auth, controller.v1.users.create);
    router.get ('/api/v1/users/:id', auth, controller.v1.users.show);
    router.put ('/api/v1/users/:id', auth, controller.v1.users.update);
    router.get ('/api/v1/users'    , auth, controller.v1.users.index);

    router.get ('/api/v1/groups/:id/permissions', auth, controller.v1.groups.getPermissions);
    router.post('/api/v1/groups/:id/permissions', auth, controller.v1.groups.assignPermissions);

    router.get ('/api/v1/groups/:id/users', auth, controller.v1.groups.getUsers);
    router.post('/api/v1/groups/:id/:uid', auth, controller.v1.groups.assignUser);
    router.del ('/api/v1/groups/:id/:uid', auth, controller.v1.groups.removeUser);

    router.get ('/api/v1/groups'    , auth, controller.v1.groups.index);
    router.post('/api/v1/groups'    , auth, controller.v1.groups.create);
    router.get ('/api/v1/groups/:id', auth, controller.v1.groups.show);
    router.put ('/api/v1/groups/:id', auth, controller.v1.groups.update);
    router.del ('/api/v1/groups/:id', auth, controller.v1.groups.del);

    router.get ('/api/v1/parameters'    , auth, controller.v1.parameters.index);
    router.post('/api/v1/parameters'    , auth, controller.v1.parameters.create);
    router.get ('/api/v1/parameters/:id', auth, controller.v1.parameters.show);
    router.put ('/api/v1/parameters/:id', auth, controller.v1.parameters.update);
    router.del ('/api/v1/parameters/:id', auth, controller.v1.parameters.del);

    router.get ('/api/v1/activities'               , auth, controller.v1.activities.index);
    router.post('/api/v1/activities'               , auth, controller.v1.activities.create);
    router.post('/api/v1/activities/swap/:fid/:sid', auth, controller.v1.activities.swap);
    router.get ('/api/v1/activities/:id'           , auth, controller.v1.activities.show);
    router.put ('/api/v1/activities/:id'           , auth, controller.v1.activities.update);
    router.del ('/api/v1/activities/:id'           , auth, controller.v1.activities.del);

    router.get ('/api/v1/subscripts'    , auth, controller.v1.subscripts.index);
    router.post('/api/v1/subscripts'    , auth, controller.v1.subscripts.create);
    router.get ('/api/v1/subscripts/:id', auth, controller.v1.subscripts.show);
    router.put ('/api/v1/subscripts/:id', auth, controller.v1.subscripts.update);
    router.del ('/api/v1/subscripts/:id', auth, controller.v1.subscripts.del);

    router.get ('/api/v1/broadcasts'    , auth, controller.v1.broadcasts.index);
    router.post('/api/v1/broadcasts'    , auth, controller.v1.broadcasts.create);
    router.get ('/api/v1/broadcasts/:id', auth, controller.v1.broadcasts.show);
    router.put ('/api/v1/broadcasts/:id', auth, controller.v1.broadcasts.update);
    router.del ('/api/v1/broadcasts/:id', auth, controller.v1.broadcasts.del);

    router.get ('/api/v1/messages'    , auth, controller.v1.messages.index);
    router.post('/api/v1/messages'    , auth, controller.v1.messages.create);
    router.get ('/api/v1/messages/:id', auth, controller.v1.messages.show);
    router.put ('/api/v1/messages/:id', auth, controller.v1.messages.update);
    router.del ('/api/v1/messages/:id', auth, controller.v1.messages.del);

    router.get ('/api/v1/decorations'    , auth, controller.v1.decorations.index);
    router.post('/api/v1/decorations'    , auth, controller.v1.decorations.create);
    router.get ('/api/v1/decorations/:id', auth, controller.v1.decorations.show);
    router.put ('/api/v1/decorations/:id', auth, controller.v1.decorations.index);
    router.del ('/api/v1/decorations/:id', auth, controller.v1.decorations.del);

    router.get ('/api/v1/channels'    , auth, controller.v1.channels.index);
    router.post('/api/v1/channels'    , auth, controller.v1.channels.create);
    router.get ('/api/v1/channels/:id', auth, controller.v1.channels.show);
    router.put ('/api/v1/channels/:id', auth, controller.v1.channels.update);
    router.del ('/api/v1/channels/:id', auth, controller.v1.channels.del);

    router.get ('/api/v1/games'    , auth, controller.v1.games.index);
    router.post('/api/v1/games'    , auth, controller.v1.games.create);
    router.get ('/api/v1/games/:id', auth, controller.v1.games.show);
    router.put ('/api/v1/games/:id', auth, controller.v1.games.update);
    router.del ('/api/v1/games/:id', auth, controller.v1.games.del);

    router.get ('/api/v1/players'    , auth, controller.v1.players.index);
    router.get ('/api/v1/players/:id', auth, controller.v1.players.show);

    router.get ('/api/v1/image', auth, controller.v1.files.downloadImage);
    router.post('/api/v1/image', auth, controller.v1.files.uploadImage);
}