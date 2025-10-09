package com.cseresourcesharingplatform.CSERShP.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cseresourcesharingplatform.CSERShP.model.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
