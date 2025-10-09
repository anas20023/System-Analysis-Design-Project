package com.cseresourcesharingplatform.CSERShP.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class StarController {
    @GetMapping("/")
   public String Hello(){
        return "Hello from Spring Boot Server";
    }
    
}
