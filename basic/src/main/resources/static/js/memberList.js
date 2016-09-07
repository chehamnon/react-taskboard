const React = require('react');
const ReactDOM = require('react-dom');
const when = require('../node_modules/when');
const client = require('./client');
const follow = require('./follow');

const root = '/api';

import TaskList from './taskList';
class EmployeeList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {employees: [], attributes: [], pageSize: 10, links: {}};
		this.loadMemberFromServer = this.loadMemberFromServer.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
	}

	componentDidMount() {
		debugger;
		this.loadMemberFromServer();
	}
	
	// tag::load member from server
	loadMemberFromServer() {
		follow(client, root, [
			{rel: 'employees', params: {size: this.state.pageSize}}]
		).then(employeeCollection => {
			return client({
				method: 'GET',
				path: employeeCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				this.schema = schema.entity;
				this.links = employeeCollection.entity._links;
				return employeeCollection;
			});
		}).then(employeeCollection => {
			return employeeCollection.entity._embedded.employees.map(employee =>
					client({
						method: 'GET',
						path: employee._links.self.href
					})
			);
		}).then(employeePromises => {
			return when.all(employeePromises);
		}).done(employees => { 
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	// end::load member from server
	
	// tag::navigate[]
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(employeeCollection => {
			this.links = employeeCollection.entity._links;

			return employeeCollection.entity._embedded.employees.map(employee =>
					client({
						method: 'GET',
						path: employee._links.self.href
					})
			);
		}).then(employeePromises => {
			return when.all(employeePromises);
		}).done(employees => {
			this.setState({
				employees: employees,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	// end::navigate[]

	// tag::handle-nav[]
	handleNavFirst(e){
		e.preventDefault();
		this.onNavigate(this.state.links.first.href);
	}
	handleNavPrev(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.prev.href);
	}
	handleNavNext(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.next.href);
	}
	handleNavLast(e) {
		e.preventDefault();
		this.onNavigate(this.state.links.last.href);
	}
	// end::handle-nav[]
	
	// tag::employee-list-render[]
	render() {
		var employees = this.state.employees.map(employee =>
				<Employee key={employee.entity._links.self.href}
						  employee={employee}
						  attributes={this.state.attributes}
						  onDelete={this.state.onDelete}
						  loadMemberFromServer = {this.loadMemberFromServer}/>
		);

		var navLinks = [];
		if ("first" in this.state.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.state.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.state.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.state.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div id="employeeView" className="container-fluid">
		      <div className="row">
		        <div className="col-xs-12">
		          <h1 className="text-info">Team Member</h1>
		        </div>
		      </div>
		      <div className="row">
		        <div className="col-xs-12">
			        <table className="table table-striped table-hover">
			        	<tbody>
			        		<tr>
								<th className="text-info">Member Name</th>
								<th className="text-info">Role</th>
								<th className="text-info">Description</th>
								<th></th>
								<th></th>
								<th></th>
			        		</tr>
			        		{employees}
			        	</tbody>
			        </table>		        			
		        </div>
		      </div>
		      <div className="row">
              	<CreateDialog attributes={this.state.attributes}
              		loadMemberFromServer={this.loadMemberFromServer}/>
		      </div>
			</div>

		)
	}
	// end::employee-list-render[]
}

// tag::employee[]
class Employee extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}
	
	handleDelete() {
		this.onDelete(this.props.employee);
	}

	// tag::delete[]
	onDelete(employee) {
    	var href = this.props.employee.entity._links.self.href;
        var memberId = href.substring(href.lastIndexOf('/') + 1);
		client({
			method: 'GET', 
			path: root+'/tasks/search/deleteByMemberId?memberId='+memberId
        }).then(response => {
                client({
                    method: 'DELETE',
                    path: employee.entity._links.self.href
                })
		}).done(response => {
			this.props.loadMemberFromServer();
		});
	}
	// end::delete[]
	
	render() {
	    var href = this.props.employee.entity._links.self.href;
        var employeeId = href.substring(href.lastIndexOf('/') + 1);
        var dialogId = "updateEmployee-"+employeeId;
        var taskId = "taskHistory-"+employeeId;
		return (
			<tr>
				<td>{this.props.employee.entity.member_name}</td>
				<td>{this.props.employee.entity.member_role}</td>
				<td>{this.props.employee.entity.description}</td>
				<td>
					<button type="button" className="btn btn-success" data-toggle="modal" data-target={'#'+dialogId}>Update</button>
					<UpdateDialog employee={this.props.employee}
					  attributes={this.props.attributes}
					  loadMemberFromServer = {this.props.loadMemberFromServer}/>
				</td>
				<td>
					<button type="button" className="btn btn-info" data-toggle="modal" data-target={'#'+taskId}>Task History</button>
					<TaskDialog employee={this.props.employee}
					  attributes={this.props.attributes}
					  loadMemberFromServer = {this.props.loadMemberFromServer}/>
				</td>
				<td>
					<button onClick={this.handleDelete} type="button" className="btn btn-primary">Delete</button>
				</td>
			</tr>
		)
	}
}
// end::employee[]

//tag::create-dialog[]
class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.onCreate = this.onCreate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	// tag::create[]
	onCreate(newEmployee) {
		var self = this;
		follow(client, root, ['employees']).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newEmployee,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [{rel: 'employees', params: {'size': self.props.pageSize}}]);
		}).done(response => {
			this.props.loadMemberFromServer();
		});
	}
	// end::create[]

	handleSubmit(e) {
		e.preventDefault();
		var newEmployee = {};
		this.props.attributes.forEach(attribute => {
			newEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.onCreate(newEmployee);
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
		});
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute} ref={attribute} className="form-control" />
			</p>
		);
		return (
			<div>
				<div id="createEmployee" className="modal fade">
                	<div className="modal-dialog">
                		<div className="modal-content">
                			<div className="modal-header">
                				<button type="button" className="close" data-dismiss="modal">&times;</button>
                				<h4 className="modal-title">Create Member</h4>
                			</div>
                			<div className = "modal-body">
                				{inputs}
                			</div>
                			<div className = "modal-footer">
            					<button onClick={this.handleSubmit} type="button" className="btn btn-info" data-dismiss="modal" >Create</button>
                			</div>
                		</div>
                	</div>
                </div>
	           	<div className="row">
	           		<div className="col-xs-12">
			       		<button type="button" className="btn btn btn-info" data-toggle="modal" data-target="#createEmployee">
			       		Create New Member
			       		</button>
		       		</div>
	        	</div>
			</div>
		)
	}
};
// end::create-dialog[]

//tag::update-dialog[]
class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.onUpdate = this.onUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// tag::update[]
	onUpdate(employee, updatedEmployee) {
		client({
			method: 'PUT',
			path: employee.entity._links.self.href,
			entity: updatedEmployee,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': employee.headers.Etag
			}
		}).done(response => {
			this.props.loadMemberFromServer();
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					employee.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	// end::update[]
	
	handleSubmit(e) {
		e.preventDefault();
		var updatedEmployee = {};
		this.props.attributes.forEach(attribute => {
			updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.onUpdate(this.props.employee, updatedEmployee);
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="text" placeholder={attribute}
					   defaultValue={this.props.employee.entity[attribute]}
					   ref={attribute} className="form-control" />
			</p>
		);
		
	    var href = this.props.employee.entity._links.self.href;
        var employeeId = href.substring(href.lastIndexOf('/') + 1);
        var dialogId = "updateEmployee-"+employeeId;
		return (
			<div key={this.props.employee.entity._links.self.href}>
				<div id={dialogId} className="modal fade">
                	<div className="modal-dialog">
                		<div className="modal-content">
                			<div className="modal-header">
                				<button type="button" className="close" data-dismiss="modal">&times;</button>
                				<h4 className="modal-title">Update Employee</h4>
                			</div>
                			<div className = "modal-body">
                				{inputs}
                			</div>
                			<div className = "modal-footer">
            					<button onClick={this.handleSubmit} type="button" className="btn btn-info" data-dismiss="modal" >Save</button>
                			</div>
                		</div>
                	</div>
                </div>
			</div>
		)
	}
};
// end::update-dialog[]


//tag::task-dialog[]
class TaskDialog extends React.Component {

	constructor(props) {
		super(props);
		this.onCreateTask = this.onCreateTask.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	// tag::update[]
	onCreateTask(employee,updatedEmployee) {
		client({
			method: 'PUT',
			path: employee.entity._links.self.href,
			entity: updatedEmployee,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': employee.headers.Etag
			}
		}).done(response => {
			this.props.loadMemberFromServer();
		}, response => {
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' +
					employee.entity._links.self.href + '. Your copy is stale.');
			}
		});
	}
	// end::update[]
	
	handleSubmit(e) {
		e.preventDefault();
		var updatedEmployee = {};
		this.props.attributes.forEach(attribute => {
			updatedEmployee[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.onCreateTask(this.props.employee, updatedEmployee);
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
			<p key={attribute}>
				<input type="hidden" placeholder={attribute}
					   defaultValue={this.props.employee.entity[attribute]}
					   ref={attribute} className="form-control" />
			</p>
		);
	    var href = this.props.employee.entity._links.self.href;
        var employeeId = href.substring(href.lastIndexOf('/') + 1);
        var dialogId = "taskHistory-"+employeeId;
		return (
			<div key={this.props.employee.entity._links.self.href}>
				<div id={dialogId} className="modal fade">
                	<div className="modal-dialog">
                		<div className="modal-content">
                            <div className="modal-header">
                            	<button type="button" className="close" data-dismiss="modal">&times;</button>
                            	<h4 className="modal-title">Task History</h4>
                           	</div>
                           	<div className="modal-body">
                           		{inputs}
                           		<TaskList employee={this.props.employee}/>
                           	</div>
                			<div className = "modal-footer">
            					<button onClick={this.handleSubmit} type="button" className="btn btn-info" data-dismiss="modal" >Save</button>
                			</div>
                		</div>
                	</div>
                </div>
			</div>
		)
	}
};
// end::update-dialog[]


export default EmployeeList;
