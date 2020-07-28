import { Link } from 'react-router-dom';
var PropTypes = 'prop-types',
{Router, Route, IndexRoute, browserHistory} = ReactRouter,
darkBackground = "linear-gradient(#01081C, #002AA0)",
lightBackground = "linear-gradient(#004BAE, #99D9FC)",
hours = new Date().getHours(),
minutes = new Date().getMinutes(),
lat = '',
lon = '',
city = '',
days = [
	{id: "Sunday", abb: "Sun"}, 
	{id: "Monday", abb: "Mon"}, 
	{id: "Tuesday", abb: "Tues"}, 
	{id: "Wednesday", abb: "Wed"}, 
	{id: "Thursday", abb: "Thurs"}, 
	{id: "Friday", abb: "Fri"}, 
	{id: "Saturday", abb: "Sat"}];

//delays rendering of /application route to allow for the Geocoding API call to make changes
class DelayLink extends React.Component {
  static propTypes = {
    delay:        PropTypes.number,
    onDelayStart: PropTypes.func,
    onDelayEnd:   PropTypes.func
  };
  static defaultProps = {
    delay:        0,
    onDelayStart: () => {},
    onDelayEnd:   () => {}
  };
  static contextTypes = Link.contextTypes;
  constructor(props) {
    super(props);
    this.timeout = null;
  };
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  handleClick = (e) => {
    const { replace, to, delay, onDelayStart, onDelayEnd } = this.props;
    const history = this.context.router;
		
    onDelayStart(e, to);
    if (e.defaultPrevented) {
      return;
    }
		
    e.preventDefault();
		
    this.timeout = setTimeout(() => {
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
      onDelayEnd(e, to);
    }, delay);
  };

  render() {
    const props = Object.assign({}, this.props);
    delete props.delay;
    delete props.onDelayStart;
    delete props.onDelayEnd;
    return (
      <Link {...props} onClick={this.handleClick} >Search</Link>
    );
  }
}

class CitySearch extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			input: '',
		}
		this.handleChange = this.handleChange.bind(this);
		this.updateCity = this.updateCity.bind(this);
	}
	updateCity() {
		let geoAPI = "https://maps.googleapis.com/maps/api/geocode/json?address=" + this.state.input + "&key=AIzaSyB_oG1OC4gzj7MvBJyUVQTJqGCAoUmeCeE&libraries=places";
		let request = new XMLHttpRequest();
		request.open("GET", geoAPI, true);
		request.onload = () => {
			city = JSON.parse(request.response).results[0].formatted_address;
			lat = JSON.parse(request.response).results[0].geometry.location.lat;
			lon = JSON.parse(request.response).results[0].geometry.location.lng;
		}
		request.send();
	};

	handleChange(event) {
		this.setState({
			input: event.target.value
		});
	};
	render() {
		return (
			<div id="search-main">
				<div>
					<input
						id="search-input"
						placeholder="Enter City"
						value={this.state.input}
  					onChange={this.handleChange} />
					<button id="search-button" className="btn" onClick={this.updateCity}>
						<DelayLink to="/application" delay={800} className="btn" />
					</button>
				</div>
			</div>
		)
	}
};

class Application extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			icon: '',
			unit: "fahrenheit",
			currentTemp: '',
			currentDay: '',
			daily: '',
			timeTest: new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())
		}
		this.unitChange = this.unitChange.bind(this);
	}

	componentDidMount() {
		this.intervalID = setInterval(
      () => this.setState(state => ({
				timeTest: new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes())
			})),
      10000
    );
		 
		let request = new XMLHttpRequest();
		var API = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly&appid=3daff8b6e93781c1d80277bbed731195";
		request.open("GET", API, true);
		request.onload = () => {
			let APIResponse = JSON.parse(request.response);
			this.setState(state => ({
				daily: APIResponse.daily,
				icon: APIResponse.current.weather[0].icon,
				currentTemp: JSON.stringify(Math.floor(APIResponse.current.temp)),
				currentDay: days[(Math.floor((JSON.stringify(APIResponse.current.dt) - 18000) / 86400) + 4) % 7].id
			}));
		}
		request.send();
	};

  componentWillUnmount() {
    clearInterval(this.intervalID);
  };
	
	unitChange(props) {
		props == "f" ?
		this.setState(state => ({
			unit: "fahrenheit"
		})) :
		this.setState(state => ({
			unit: "celsius"
		}))
	};
	
	render() {
		return (
			<main style={{
					backgroundImage: (hours >= 20|| hours < 5) ? 
					darkBackground : 
					lightBackground}}>
				<nav id="header">
					<Link  to={{pathname: "/week", query:{daily: 5}}} className="btn">5-Day Forecast</Link>
					<Link to="/" className="btn">City Search</Link>
					<Link  to={{pathname: "/week", query:{daily: 7}}} className="btn">7-Day Forecast</Link>
				</nav>
				<div 
					id="container"
					style={{color: this.state.darkMode ? "lightgrey" : "#F0F0F0"}}>
					<section id="activeDay">
						<h4>{city}</h4>
						<div id="activeTemp">
							<img 
								id="currentIcon" 
								style={{width: "65px", height: "65px"}} 
								src={"http://openweathermap.org/img/wn/" + `${this.state.icon}` +"@2x.png"} />
							<div id="currentTemp">{this.state.unit == "fahrenheit" ? this.state.currentTemp : Math.round(metric(this.state.currentTemp, "temp"))}&#176;</div>
							<div id="unitChange">
								<button
									style={{fontWeight: this.state.unit == "fahrenheit" ? "bold" : "400"}}
									className="btn unitBtn"
									onClick={() => this.unitChange("f")}>F&#176;</button>
								<button
									style={{fontWeight: this.state.unit == "celsius" ? "bold" : "400"}}
									className="btn unitBtn"
									onClick={() => this.unitChange("c")}>C&#176;</button>
							</div>
						</div>
					</section>
					{/*passes unit type to change temp units
						 passes daily # to tell how many day cards to render (5 vs 7)*/}
					{React.Children.map
						(this.props.children, child => 
							React.cloneElement(child, {currentTemp: this.state.currentTemp, daily: this.state.daily, unit: this.state.unit}))
					}
				</div>
			</main>
		)
	}
}

function metric(input, type) {
	switch (type) {
		case "temp":
			return ((input - 32) * (5/9));
			break;
		case "distance":
			return Math.round((input * 1.609) * 10) / 10;
			break;
	}
}

var WeekCard = React.createClass({
	getInitialState() {
    return {
			averageHigh: [],
      active: false,
			morn: 0,
			eve: 0,
			windSpeed: 0,
			dewPoint: 0,
			humidity: 0
    };
  },
	render: function(props){
		var week = this.props.daily
			.slice(0, this.props.location.query.daily)
			.map(day =>
			<div
				className="dayCard"
				onClick={() => {
					this.setState(state => ({
						active: true,
						morn: Math.floor(day.temp.morn),
						eve: Math.floor(day.temp.eve),
						windSpeed: (day.wind_speed),
						dewPoint: Math.floor(day.dew_point),
						humidity: day.humidity,
					}))
				}}>
				<div id="dayCardCombiner">
					<p>{days[(Math.floor((day.dt - 18000) / 86400) + 4) % 7].abb}</p>
					<img 
						id="dailyIcon"
						src={"http://openweathermap.org/img/wn/" + day.weather[0].icon + "@2x.png"} />
				</div>
				<div 
					id="spacer" 
					style={{
								minHeight: "15px", 
								height: this.props.currentTemp >= 30 ?
								this.props.currentTemp >= 100 ?
								`${(130 - day.temp.max) * 2}px` :
								`${(100 - day.temp.max) * 2}px` : 
								`${(40 - day.temp.max) * 2}px`}} />
				<div id="temps">
					<div id="high">{
							this.props.unit == "fahrenheit" ? 
							Math.round(day.temp.max) : 
							Math.round(metric(day.temp.max, "temp"))}&#176;
					</div>
					<div id="bar" style={{height: `${(day.temp.max - day.temp.min) * 3}px`}} />
					<div id="low">{
							this.props.unit == "fahrenheit" ? 
							Math.round(day.temp.min) : 
							Math.round(metric(day.temp.min, "temp"))}&#176;</div>
				</div>
			</div>
		);						
		return(
		<div>	
			<div id="weekCard">
				{week}
			</div>
			<section id="hourly" style={{visibility: this.state.active ? "visible" : "hidden"}}>
				<div className="hourlyCard">
					<div>{this.props.unit == "fahrenheit" ? 
								this.state.morn : 
								Math.round(metric(this.state.morn, "temp"))}&#176;</div>
					<div>Morning</div>
				</div>
				<div className="hourlyCard">
					<div>{this.props.unit == "fahrenheit" ? 
								this.state.eve : 
								Math.round(metric(this.state.eve, "temp"))}&#176;</div>
					<div>Evening</div>
				</div>
				<div className="hourlyCard">
					<div>{this.props.unit == "fahrenheit" ? 
								this.state.windSpeed + "Mph" : 
								metric(this.state.windSpeed, "distance") + "Km/h"}</div>
					<div>Wind Speed</div>
				</div>
				<div className="hourlyCard">
					<div>{this.props.unit == "fahrenheit" ? 
								this.state.dewPoint : 
								Math.round(metric(this.state.dewPoint, "temp"))}&#176;</div>
					<div>Dew Point</div>
				</div>
				<div className="hourlyCard">
					<div>{this.state.humidity}%</div>
					<div>Humidity</div>
				</div>
			</section>
			<p id="disclaimer">*Disclaimer - Openweathermap's API data uses UNIX time. Current data may be slightly off*</p>
		</div>
		);
	}
});

const Root = () => (
		<Router>
		  <Route path="/" component={CitySearch} />
			  <Route path="/application" component={Application}>
				  <Route path="/week" component={WeekCard} />
			  </Route>
		</Router>
);

ReactDOM.render(<Root />, document.getElementById("app"));
