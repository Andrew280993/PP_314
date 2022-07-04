package com.example.pp_314.service;

import com.example.pp_314.model.Role;

import java.util.List;

public interface RoleService {
    Role findByName(String role);
    List<Role> getAllRoles();
    void saveRole(Role role);
}