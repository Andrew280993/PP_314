package com.example.pp_314.dao;

import com.example.pp_314.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoleDao {
    Role findByName(String role);
    List<Role> getAllRoles();
    void saveRole(Role role);
}
