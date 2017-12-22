// Hook for server
if (typeof require.ensure !== 'function') {
    require.ensure = function (dependencies, callback) {
        callback(require)
    }
}

const routes = {
    childRoutes: [{
        path: '/',
        component: require('../containers/root.component'),
        indexRoute:{
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('../containers/index/index.component'))
                }, 'index')
            }
        },
        childRoutes: [{
            path: 'demo',
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('../containers/demo/demo.component'))
                }, 'demo')
            }
        }]
    }]
};

export default routes;
