package com.greglturnquist.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * @author Marissa
 */
// tag::code[]
@Component
public class DatabaseLoader implements CommandLineRunner{

	private final EmployeeRepository repository;
	private final TaskRepository taskRepository;

	@Autowired
	public DatabaseLoader(EmployeeRepository repository, TaskRepository taskRepository) {
		this.repository = repository;
		this.taskRepository = taskRepository;
	}
	
	public void run(String... strings) throws Exception {

		Employee employee1 = this.repository.save(new Employee("marissa", "tester",
							"functional testing"));
		
		Employee employee2 = this.repository.save(new Employee("mark stuard", "developer",
				"develop new module"));

		this.taskRepository.save(new Task("FTD Registration Module", "Done", employee1));
		this.taskRepository.save(new Task("Execute FTD Registration SC_1", "In Progress", employee1));
		this.taskRepository.save(new Task("Test Defect Id #65123", "To Do", employee1));
		
		this.taskRepository.save(new Task("Develop Create Appointment screen", "Done", employee2));
		this.taskRepository.save(new Task("Develop Transfer Appointment", "In Progress", employee2));
	}

}
// end::code[]