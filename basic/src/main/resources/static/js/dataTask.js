const React = require('react');
const ReactDOM = require('react-dom');
const when = require('../node_modules/when');
const client = require('./client');
const follow = require('./follow');

const root = '/api';

class DataTaskList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {tasks: [], attributes: [], pageSize: 10, links: {}};
		this.loadDataTaskFromServer = this.loadDataTaskFromServer.bind(this);
	}

	componentDidMount() {
		this.loadDataTaskFromServer();
	}
	
	loadDataTaskFromServer(){
		follow(client, root, [
		      				{rel: 'tasks', params: {size: this.state.pageSize}}]
		      		).then(taskCollection => {
		      			return client({
		      				method: 'GET',
		      				path: taskCollection.entity._links.profile.href,
		      				headers: {'Accept': 'application/schema+json'}
		      			}).then(schema => {
		      				// tag::json-schema-filter[]
		      				/**
		      				 * Filter unneeded JSON Schema properties, like uri references and
		      				 * subtypes ($ref).
		      				 */
		      				Object.keys(schema.entity.properties).forEach(function (property) {
		      					if (schema.entity.properties[property].hasOwnProperty('format') &&
		      						schema.entity.properties[property].format === 'uri') {
		      						delete schema.entity.properties[property];
		      					}
		      				});

		      				this.schema = schema.entity;
		      				this.links = taskCollection.entity._links;
		      				return taskCollection;
		      				// end::json-schema-filter[]
		      			});
		      		}).then(taskCollection => {
		      			this.page = taskCollection.entity.page;
		      			return taskCollection.entity._embedded.tasks.map(task =>
		      					client({
		      						method: 'GET',
		      						path: task._links.self.href
		      					})
		      			);
		      		}).then(taskPromises => {
		      			return when.all(taskPromises);
		      		}).done(tasks => {
		      			this.setState({
		      				page: this.page,
		      				tasks: tasks,
		      				attributes: Object.keys(this.schema.properties),
		      				pageSize: this.state.pageSize,
		      				links: this.links
		      			});
		      		});
	}
	// end::load member from server
	
	// tag::employee-list-render[]
	render() {
		var tasks = this.state.tasks.map(task =>
				<DataTask key={task.entity._links.self.href}
						  task={task}
						  attributes={this.state.attributes}
						  loadDataTaskFromServer = {this.loadDataTaskFromServer}/>
		);

		return (
			<div id="employeeView" className="container-fluid">
		      <div className="row">
		        <div className="col-xs-12">
		          <h1 className="text-info">Task</h1>
		        </div>
		      </div>
		      <div className="row">
		        <div className="col-xs-12">
			        <table className="table table-striped table-hover">
			        	<tbody>
			        		<tr>
								<th className="text-info">Task Name</th>
								<th className="text-info">Status</th>
								<th className="text-info">Member Name</th>
			        		</tr>
			        		{tasks}
			        	</tbody>
			        </table>		        			
		        </div>
		      </div>
		      <div className="row">
		      </div>
			</div>

		)
	}
	// end::employee-list-render[]
}

// tag::employee[]
class DataTask extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<tr>
				<td>{this.props.task.entity.task_name}</td>
				<td>{this.props.task.entity.status}</td>
				<td>{this.props.task.entity.employee.member_name}</td>
			</tr>
		)
	}
}
// end::employee[]

export default DataTaskList;
