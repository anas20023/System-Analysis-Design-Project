package com.cseresourcesharingplatform.CSERShP.Services;

import org.springframework.stereotype.Service;

import com.cseresourcesharingplatform.CSERShP.Repository.RoleRepository;
import com.cseresourcesharingplatform.CSERShP.model.Role;

import java.util.List;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }
}