package com.cseresourcesharingplatform.CSERShP.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {
    public EnvConfig() {
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry ->

        {
            System.out.println(entry.getKey() + ": " + entry.getValue());
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
