package com.cseresourcesharingplatform.CSERShP;

import org.springframework.boot.SpringApplication;

public class TestCserShPApplication {

	public static void main(String[] args) {
		SpringApplication.from(CserShPApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
