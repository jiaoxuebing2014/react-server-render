import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import routes from '../../client/config/routes';

const initStore = {'userId': 123};

async function clientRoute(ctx, next) {
    let _renderProps;

    match({routes, location: ctx.url}, (error, redirectLocation, renderProps) => {
        _renderProps = renderProps;
    });

    if (_renderProps) {
        await ctx.render('index', {
            root: renderToString(
                <RouterContext {..._renderProps}/>
            ),
            state: initStore
        })
    } else {
        await next()
    }
}

export default clientRoute;
