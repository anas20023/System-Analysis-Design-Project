package com.cseresourcesharingplatform.CSERShP.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "subscription_id")
    private Subscription subscription;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.COMPLETED;

    @Column(nullable = false, updatable = false, insertable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime paidAt;
}

