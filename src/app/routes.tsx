import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './views/pages/Home';
import NotFoundPage from './views/pages/NotFoundPage';
import Dashboard from './layouts/dashboard-layout';
import { LinearProgress } from '@mui/material';
import ProtectedRoute from './components/protected-routes';

const AboutPage = lazy(() => import('./views/pages/About'));
const DashboardDefaultContent = lazy(
  () => import('./views/dashboard/dashboard-default-content'),
);

const Routes = () => {
  return (
    <Suspense fallback={<LinearProgress style={{ margin: '10rem' }} />}>
      <Switch>
        <ProtectedRoute
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
                  path={path + '/list-products'}
                  component={lazy(
                    () => import('./views/dashboard/product/ProductListView'),
                  )}
                  exact
                />
                <Route
                  path={path + '/create-product'}
                  component={lazy(
                    () => import('./views/dashboard/product/ProductCreateView'),
                  )}
                  exact
                />
                <Route
                  exact
                  path={path + '/calendar'}
                  component={lazy(
                    () => import('./views/dashboard/calendar/CalendarView'),
                  )}
                />
              </Switch>
            </Dashboard>
          )}
        />
        <Route
          exact
          path={'/login'}
          component={lazy(() => import('./views/pages/auth/LoginPage'))}
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
