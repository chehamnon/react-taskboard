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
import javax.persistence.Version;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author Marissa
 */
// tag::code[]
@Data
@Entity
public class Employee {

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY) Long memberId;
	 	
    	@Column
	    private String member_name;

	    @Column
	    private String member_role;

	    @Column
	    private String description;

	    @Version
	    @JsonIgnore
	    private Long version;

	    Employee() {}

	    public Employee(String member_name, String member_role, String description) {
	        this.member_name = member_name;
	        this.member_role = member_role;
	        this.description = description;
	}

		public Long getMemberId() {
			return memberId;
		}

		public void setMemberId(Long memberId) {
			this.memberId = memberId;
		}

		public String getMember_name() {
			return member_name;
		}

		public void setMember_name(String member_name) {
			this.member_name = member_name;
		}

		public String getMember_role() {
			return member_role;
		}

		public void setMember_role(String member_role) {
			this.member_role = member_role;
		}

		public String getDescription() {
			return description;
		}

		public void setDescription(String description) {
			this.description = description;
		}

		public Long getVersion() {
			return version;
		}

		public void setVersion(Long version) {
			this.version = version;
		}
	    
}
// end::code[]