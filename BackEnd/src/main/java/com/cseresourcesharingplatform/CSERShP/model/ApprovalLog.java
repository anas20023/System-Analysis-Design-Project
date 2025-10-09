package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "approval_log")
public class ApprovalLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "admin_id")
    private User admin;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status;

    @Lob
    private String reason;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime actionAt;
}
