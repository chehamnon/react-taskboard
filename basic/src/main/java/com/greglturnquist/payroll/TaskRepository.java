package com.greglturnquist.payroll;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author Marissa
 */
// tag::code[]
public interface TaskRepository extends JpaRepository<Task, Long> {

}
// end::code[]
