import React from 'react';
import {Route, Switch} from 'react-router-dom';
import NotFound from '@assets/loadables/NotFound';
import {routePrefix} from '@assets/config/app';
import Home from '@assets/loadables/Home';
import MainFeed from '@assets/loadables/MainFeed';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => (
  <Switch>
    <Route exact path={prefix + '/home'} component={Home} />
    <Route exact path={prefix + '/main-feed'} component={MainFeed} />
    <Route exact path="*" component={Home} />
  </Switch>
);

export default Routes;
