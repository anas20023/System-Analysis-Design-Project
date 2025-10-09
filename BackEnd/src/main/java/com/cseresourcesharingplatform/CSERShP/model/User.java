package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @Column(name="ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    private String profileImageLink;
    @Column(nullable = false, length = 255)
    private String pwhash;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Relations
    @OneToMany(mappedBy = "user")
    private List<UserRole> userRoles;

    @OneToMany(mappedBy = "uploader")
    private List<Resource> resources;

    @OneToMany(mappedBy = "user")
    private List<Rating> ratings;

    @OneToMany(mappedBy = "user")
    private List<DownloadLog> downloads;

    @OneToMany(mappedBy = "admin")
    private List<ApprovalLog> approvals;

    @OneToMany(mappedBy = "user")
    private List<Subscription> subscriptions;

    @OneToMany(mappedBy = "user")
    private List<Payment> payments;
}

