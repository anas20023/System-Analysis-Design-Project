package com.cseresourcesharingplatform.CSERShP.Services;

import com.cseresourcesharingplatform.CSERShP.Repository.UserRepository;
import com.cseresourcesharingplatform.CSERShP.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPwhash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }
}
