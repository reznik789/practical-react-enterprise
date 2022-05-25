import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = props => {
  const token = localStorage.getItem('token');

  return token ? <Route {...props} /> : <Redirect to="/login" />;
};

export default ProtectedRoute;
