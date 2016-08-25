package com.greglturnquist.payroll;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author Marissa
 */
// tag::code[]
@Component
public class DatabaseLoader{

	private final EmployeeRepository repository;
	private final TaskRepository taskRepository;

	@Autowired
	public DatabaseLoader(EmployeeRepository repository, TaskRepository taskRepository) {
		this.repository = repository;
		this.taskRepository = taskRepository;
	}

}
// end::code[]