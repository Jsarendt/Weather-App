import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';
console.log('test');

const createRoutes = (
	<BrowserRouter>
	<Switch>
		<Route path='/' component={CitySearch} />
		<Route path='/application' component={Application} />
			
	</Switch>
	</BrowserRouter>
)



export default createRoutes;
