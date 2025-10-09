package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"resource_id", "user_id"})
})
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private int ratingValue;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}

