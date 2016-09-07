'use strict';

const React = require('react');
import NavLink from './js/navLink'
import Home from './js/Home';
import About from './js/About';
import Task from './js/Task';
import Project from './js/Project';
import Board from './js/Board';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import { Link } from 'react-router';

class App extends React.Component {

	constructor(props) {
		super(props);
		console.log('----- INIT App1 -----');
	}
	render() {
		return (
			<div>
				<nav className="navbar navbar-default">
				  <div className="container-fluid">
				    <div className="navbar-header">
				    	<ul className="nav navbar-nav navbar-right">
				    		<li><NavLink to="/Home">Team Member</NavLink></li>
				    		<li><NavLink to="/Task">Task</NavLink></li>
				    		<li><NavLink to="/Project">Project</NavLink></li>
				    		<li><NavLink to="/Board">Board</NavLink></li>
				    		<li><NavLink to="/About">About</NavLink></li>
				    	</ul>
				    </div>
				   </div>
				</nav>
		    	{this.props.children}
			</div>
		)
	}
}

render((
	<Router history={browserHistory}>
		    <Route path="react/" component={App}>
			    <Route path="/react/About" component={About}/>
			    <Route path="/react/Home" component={Home}/>
			    <Route path="/react/Task" component={Task}/>
			    <Route path="/react/Project" component={Project}/>
			    <Route path="/react/Board" component={Board}/>
			 </Route>
	</Router>),
	document.getElementById('react')
)