package com.greglturnquist.payroll;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marissa
 */
// tag::code[]
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {

}
// end::code[]
