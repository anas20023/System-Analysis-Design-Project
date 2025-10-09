package com.cseresourcesharingplatform.CSERShP.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.cseresourcesharingplatform.CSERShP.model.UserRole;

public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
}
