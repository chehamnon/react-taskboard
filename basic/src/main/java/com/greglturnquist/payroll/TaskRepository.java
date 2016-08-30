package com.greglturnquist.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Marissa
 */
// tag::code[]
public interface TaskRepository extends JpaRepository<Task, Long> {

	  @Transactional
	  Long deleteByMemberId(@Param("memberId") Long memberId);
}
// end::code[]
