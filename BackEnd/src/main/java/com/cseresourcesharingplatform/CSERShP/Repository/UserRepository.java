package com.cseresourcesharingplatform.CSERShP.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.cseresourcesharingplatform.CSERShP.model.User;

import java.util.Optional;



public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "select u from User u where u.id=:id")
    Optional<User> seeAllUsers(@Param("id") Long id);

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
