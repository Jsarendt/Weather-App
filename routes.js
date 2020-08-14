import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';

const createRoutes = (
	<BrowserRouter>
		<Route exact path='/' component={CitySearch} />
		<Route path='/application' component={Application} />
		<Route path='/application/week' component={WeekCard} />
	</BrowserRouter>
)


export default createRoutes;
