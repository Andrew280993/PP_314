package com.example.pp_314.service;

import com.example.pp_314.dao.RoleDao;
import com.example.pp_314.dao.RoleDaoImpl;
import com.example.pp_314.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleServiceImpl implements RoleService {

    private RoleDao roleDao = new RoleDaoImpl();

    @Autowired
    public RoleServiceImpl(RoleDao roleDao) {
        this.roleDao = roleDao;
    }

    @Override
    public Role findByName(String role) {
        return roleDao.findByName(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleDao.getAllRoles();
    }

    @Override
    public void saveRole(Role role) {
        roleDao.saveRole(role);
    }
}
