const React = require('react');
import MemberList from './js/memberList';

class App extends React.Component {

	constructor(props) {
		super(props);
		console.log('----- INIT App1 -----');
	}
	render() {
		return (
			<div>
				<MemberList/>
			</div>
		)
	}
}

React.render(
	<App/>,
	document.getElementById('react')
)