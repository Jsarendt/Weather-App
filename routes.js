import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';

const createRoutes = (
	<Router>
		<Route exact path={process.env.PUBLIC_URL + '/weather-app/'} component={CitySearch} />
		<Route path={process.env.PUBLIC_URL + '/application'} component={Application}>
			<Route path={process.env.PUBLIC_URL + '/week'} component={WeekCard} />
		</Route>
	</Router>
)



export default createRoutes;
