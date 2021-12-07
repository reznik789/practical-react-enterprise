import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './views/pages/Home';
import NotFoundPage from './views/pages/NotFoundPage';
import Dashboard from './layouts/dashboard-layout';
import SettingsAndPrivacy from './views/dashboard/settings-and-privacy';
import { LinearProgress } from '@material-ui/core';
const AboutPage = lazy(() => import('./views/pages/About'));
const DashboardDefaultContent = lazy(
  () => import('./views/dashboard/dashboard-default-content'),
);

const Routes = () => {
  return (
    <Suspense fallback={<LinearProgress style={{ margin: '10rem' }} />}>
      <Switch>
        <Route
          path={'/dashboard'}
          render={({ match: { path } }) => (
            <Dashboard>
              <Switch>
                <Route
                  exact
                  path={path + '/'}
                  component={DashboardDefaultContent}
                />
                <Route
                  exact
                  path={path + '/settings-and-privacy'}
                  component={SettingsAndPrivacy}
                />
              </Switch>
            </Dashboard>
          )}
        />
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path={'/not-found'} component={NotFoundPage} />
        <Redirect from={'*'} to={'/not-found'} exact />
      </Switch>
    </Suspense>
  );
};
export default Routes;
