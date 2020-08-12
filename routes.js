import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';


const createRoutes = (
	<BrowserRouter>
		<Route path='/' component={CitySearch} />
		<Route path='/application' component={Application}>
			<Route path='/week' component={WeekCard} />
		</Route>
	</BrowserRouter>
)



export default createRoutes;
