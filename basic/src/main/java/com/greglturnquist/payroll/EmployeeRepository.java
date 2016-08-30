package com.greglturnquist.payroll;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Marissa
 */
// tag::code[]
public interface EmployeeRepository extends PagingAndSortingRepository<Employee, Long> {
	  @Transactional
	  Employee findMemberByMemberId(@Param("memberId") Long memberId);
}
// end::code[]
