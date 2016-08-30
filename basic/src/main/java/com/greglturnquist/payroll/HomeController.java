
package com.greglturnquist.payroll;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Greg Turnquist
 */
// tag::code[]
@Controller
public class HomeController {

	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}
	
    @RequestMapping(value = "/Home", method = RequestMethod.GET)
    public String Home(){
        return "index";
    }
    
    @RequestMapping(value = "/About", method = RequestMethod.GET)
    public String About(){
        return "index";
    }
    
    @RequestMapping(value = "/Project", method = RequestMethod.GET)
    public String Project(){
        return "index";
    }
    
    @RequestMapping(value = "/Task", method = RequestMethod.GET)
    public String Task(){
        return "index";
    }
    
    @RequestMapping(value = "/Board", method = RequestMethod.GET)
    public String Board(){
        return "index";
    }

}
// end::code[]