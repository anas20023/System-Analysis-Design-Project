package com.cseresourcesharingplatform.CSERShP;


import com.cseresourcesharingplatform.CSERShP.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class CserShPApplication {

    public static void main(String[] args) {
        EnvConfig e= new EnvConfig();
        SpringApplication.run(CserShPApplication.class, args);
    }
}
