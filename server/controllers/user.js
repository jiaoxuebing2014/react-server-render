async function getUserInfo(ctx) {
    ctx.body = {
        name: 'Xuebing Jiao',
        gender: '男'
    }
}

export default {getUserInfo};
