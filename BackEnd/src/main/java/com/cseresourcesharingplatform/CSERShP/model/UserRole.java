package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_roles", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "role_id"})
})
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}
