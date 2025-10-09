package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "download_log")
public class DownloadLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime downloadedAt;
}
