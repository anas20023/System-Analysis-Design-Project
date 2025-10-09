package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "resources")
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "uploader_id")
    private User uploader;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    private String description;

    @Column(nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    private ResourceStatus status = ResourceStatus.PENDING;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    // Relations
    @OneToMany(mappedBy = "resource")
    private List<Rating> ratings;

    @OneToMany(mappedBy = "resource")
    private List<DownloadLog> downloads;

    @OneToMany(mappedBy = "resource")
    private List<ApprovalLog> approvals;

    public void setStatus(ResourceStatus pending) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setStatus'");
    }

    public void setApprovedAt(Date date) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setApprovedAt'");
    }
}
