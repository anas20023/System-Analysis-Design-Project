package com.cseresourcesharingplatform.CSERShP.controller;

import com.cseresourcesharingplatform.CSERShP.Services.AuthService;
import com.cseresourcesharingplatform.CSERShP.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cseresourcesharingplatform.CSERShP.Services.UserService;
import com.cseresourcesharingplatform.CSERShP.model.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

// import java.util.Optional;
@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private final UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.seeAllUsers(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create new user
    @PostMapping("/new")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    // Login User Logic
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        try {
            User user = authService.login(email, password);

            // fetch role properly if you want (currently hardcoded)
            String role = "USER";

            String jwtToken = jwtUtil.generateToken(user.getUsername(), role);

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", jwtToken,
                    "role", role,
                    "user", Map.of(
                            "username", user.getUsername(),
                            "email", user.getEmail(),
                            "fullName", user.getFullName(),
                            "profileImageLink", user.getProfileImageLink()
                    )
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("error", e.getMessage())
            );
        }
    }


    // ✅ Update user
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }


    @PostMapping("/forgot")
    public ResponseEntity<Optional> forgotUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if(userService.existsByEmail(email)){
            return (ResponseEntity<Optional>) ResponseEntity.ok();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Delete user
    @DeleteMapping("/drop/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}