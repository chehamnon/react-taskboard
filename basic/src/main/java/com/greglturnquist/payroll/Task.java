package com.greglturnquist.payroll;
// * Copyright 2015 the original author or authors.
// *
// * Licensed under the Apache License, Version 2.0 (the "License");
// * you may not use this file except in compliance with the License.
// * You may obtain a copy of the License at
// *
// *      http://www.apache.org/licenses/LICENSE-2.0
// *
// * Unless required by applicable law or agreed to in writing, software
// * distributed under the License is distributed on an "AS IS" BASIS,
// * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// * See the License for the specific language governing permissions and
// * limitations under the License.

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;
import javax.persistence.Version;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * @author Marissa
 */
// tag::code[]
@Data
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
public class Task {

	@Id @GeneratedValue(strategy=GenerationType.AUTO) Long taskId;
	 	@Column
	    private String task_name;

	    @Column
	    private String status;

	    @Column
	    private Long memberId;

	    @Transient
	    private Employee employee;
	    
	    @Version
	    @JsonIgnore
	    private Long version;

	    private Task() {}

	    public Task(String task_name, String status) {
	        this.task_name = task_name;
	        this.status = status;
	}

		public Long getTaskId() {
			return taskId;
		}

		public void setTaskId(Long taskId) {
			this.taskId = taskId;
		}

		public String getTask_name() {
			return task_name;
		}

		public void setTask_name(String task_name) {
			this.task_name = task_name;
		}

		public String getStatus() {
			return status;
		}

		public void setStatus(String status) {
			this.status = status;
		}

		public Long getMemberId() {
			return memberId;
		}

		public void setMemberId(Long memberId) {
			this.memberId = memberId;
		}

		public Employee getEmployee() {
			return employee;
		}

		public void setEmployee(Employee employee) {
			this.employee = employee;
		}

		public Long getVersion() {
			return version;
		}

		public void setVersion(Long version) {
			this.version = version;
		}
	    
	    
}
// end::code[]