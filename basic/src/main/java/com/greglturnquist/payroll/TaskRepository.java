package com.greglturnquist.payroll;

import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * @author Marissa
 */
// tag::code[]
public interface TaskRepository extends PagingAndSortingRepository<Task, Long> {

}
// end::code[]
