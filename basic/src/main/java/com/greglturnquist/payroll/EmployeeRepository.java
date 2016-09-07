package com.greglturnquist.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * @author Marissa
 */
// tag::code[]
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	Employee save(Employee employee);
	Employee findByMemberId(Long memberId);
}
// end::code[]
