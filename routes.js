import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import { CitySearch, Application, WeekCard } from './application.js';

class Routes extends React.Component {
	render() {
		return (
		<Router basename="/weather-app">
			<Route exact path='/' component={CitySearch} />
			<Route path='/application' component={Application}>
				<Route path='/week' component={WeekCard} />
			</Route>
		</Router>
		)
	}
}


export default Routes;
