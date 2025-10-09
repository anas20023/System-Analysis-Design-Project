package com.cseresourcesharingplatform.CSERShP.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        // default strength = 10. Increase to 12 if you want more cost (slower).
        return new BCryptPasswordEncoder();
    }
}
