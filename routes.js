import React from 'react';
import { Switch, HashRouter, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';

const createRoutes = (
	<HashRouter basename={process.env.PUBLIC_URL}>
		<Route exact path='/weather-app/' component={CitySearch} />
		<Route path='/application' component={Application}>
			<Route path='/week' component={WeekCard} />
		</Route>
	</HashRouter>
)



export default createRoutes;
