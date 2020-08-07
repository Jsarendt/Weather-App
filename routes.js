import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';

const createRoutes = () => (
	<Router basename={process.env.PUBLIC_URL}>
		<Route path='/weather-app/' component={CitySearch} />
		<Route path='/application' component={Application}>
			<Route path='/week' component={WeekCard} />
		</Route>
	</Router>
)

export default createRoutes;