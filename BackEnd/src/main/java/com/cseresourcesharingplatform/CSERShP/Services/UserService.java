package com.cseresourcesharingplatform.CSERShP.Services;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.cseresourcesharingplatform.CSERShP.Repository.UserRepository;
import com.cseresourcesharingplatform.CSERShP.model.User;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> seeAllUsers(Long id) {
        return userRepository.seeAllUsers(id);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already taken!");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already taken!");
        }
        user.setPwhash(passwordEncoder.encode(user.getPwhash()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id)
                .map(existing -> {
                    existing.setFullName(updatedUser.getFullName());
                    existing.setProfileImageLink(updatedUser.getProfileImageLink());
                    return userRepository.save(existing);
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return  userRepository.existsByEmail(email);
    }
}