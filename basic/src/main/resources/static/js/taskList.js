const React = require('react');
const when = require('../node_modules/when');
const client = require('./client');
const follow = require('./follow');
const root = '/api';

// tag::skill-list[]
class TaskList extends React.Component{

    constructor(props) {
    	super(props);
    	this.state = {memberId:0, tasks:[], clone:0, newSkill:[]};
    	this.clone = this.clone.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.onCreate = this.onCreate.bind(this);
    }

    componentDidMount() {
        this.loadTaskFromServer();
    }

    // tag::load-skills-from-server[]
    loadTaskFromServer() {
    	var href = this.props.employee.entity._links.self.href;
        var memberId = href.substring(href.lastIndexOf('/') + 1);
        client({method: 'GET', path: root+'/employees/'+memberId+'/task'
        }).then(skillCollection => {
            return skillCollection.entity._embedded.tasks.map(task =>
                client({
                    method: 'GET',
                    path: task._links.self.href
                })
            );
        }).then(skillPromises => {
            return when.all(skillPromises);
        }).done(tasks => {console.log('loadTaskFromServer['+memberId+']');console.log(tasks);
            this.setState({
                memberId: memberId,
                tasks: tasks
            });
        });
    }
    // end::load-skills-from-server[]

    // tag::clone[]
    clone(){
        var memberId = this.state.memberId;
        var clone = this.state.clone;
        var task = this.state.newSkill;
        clone++;
        task.push("addNewTask-"+memberId+"-"+clone);
        this.setState({
            clone: clone,
            newSkill: task
        });
    }
    // end::clone[]

    handleSubmit(e) {
        e.preventDefault();
        this.state.newSkill.forEach(task => { console.log(task);
            var newSkill = {};
            newSkill['task_name'] = React.findDOMNode(this.refs["taskName"+task]).value.trim();
            newSkill['status'] = React.findDOMNode(this.refs["status"+task]).value.trim();
            newSkill['memberId'] = this.state.memberId;
            this.onCreate(newSkill); console.log(newSkill);
        });
        //console.log(this.state);
    }

    // tag::create[]
    onCreate(newSkill) {
        var self = this;
        follow(client, root, ['tasks']).then(response => {console.log('1');console.log(response);
            return client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: newSkill,
                headers: {'Content-Type': 'application/json'}
            })
        }).then(response => {console.log('2');console.log(response);
            return follow(client, root, [{rel: 'tasks', params: {'size': self.props.pageSize}}]);
        });
    }
    // end::create[]

    render(){
        var existingSkills = this.state.tasks.map(task =>
            <Task key={task.entity._links.self.href} task={task}/>
        );
        var newSkills = this.state.newSkill.map((task) =>
           <p key={task} className="input-group">
               <span className="input-group-addon"><span className="glyphicon glyphicon-tag"></span></span>
               <input type="text" placeholder="taskName" ref={"taskName"+task} className="form-control"/>
               <input type="text" placeholder="status" ref={"status"+task} className="form-control"/>
           </p>
        );

        return(
            <div>
                {existingSkills}
                {newSkills}
                <button onClick={this.clone} className="btn btn-success">
                    Add Task
                </button>
                <button onClick={this.handleSubmit} className="btn btn-success">
                	Post Task
                </button>
            </div>
        )
    }
}
// end::skill-list[]

// tag::skill[]
class Task extends React.Component{

    constructor(props) {
    	super(props);
    }

    render(){
        return(
            <p className="input-group">
                <span className="input-group-addon"><span className="glyphicon glyphicon-tag"></span></span>
                <input type = "text" placeholder = "taskName"
                    defaultValue = {this.props.task.entity.taskName} className="form-control"/>
                <input type = "text" placeholder = "status"
                    defaultValue = {this.props.task.entity.status} className="form-control"/>
                <span className="input-group-btn">
                    <button type="button" className="close" data-dismiss="modal">&nbsp;&nbsp;&times;</button>
                </span>
            </p>
        )
    }
}
// end::skill[]

export default TaskList;