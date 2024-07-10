import React from 'react';
import {Route, Switch} from 'react-router-dom';
import NotFound from '@assets/loadables/NotFound';
import Home from '@assets/loadables/Home';
import Notifications from '@assets/loadables/Notifications';
import Settings from '@assets/loadables/Settings';
import {routePrefix} from '@assets/config/app';

// eslint-disable-next-line react/prop-types
const Routes = ({prefix = routePrefix}) => {
  return (
    <Switch>
      <Route exact path={prefix + '/'} component={Home} />
      <Route exact path={prefix + '/notifications'} component={Notifications} />
      <Route exact path={prefix + '/settings'} component={Settings} />
      <Route exact path="*" component={NotFound} />
    </Switch>
  );
};

export default Routes;
