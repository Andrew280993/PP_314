package com.example.pp_314.service;

import com.example.pp_314.dao.RoleDao;
import com.example.pp_314.dao.RoleDaoImpl;
import com.example.pp_314.dao.UserDao;
import com.example.pp_314.dao.UserDaoImpl;
import com.example.pp_314.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.PostPersist;
import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional
public class UserServiceImpl implements UserService {

    BCryptPasswordEncoder passwordEncoder;

    RoleDao roleDao = new RoleDaoImpl();
    private UserDao userDao = new UserDaoImpl();


    @Autowired
    public UserServiceImpl(BCryptPasswordEncoder passwordEncoder, UserDao userDao, RoleDao roleDao) {
        this.passwordEncoder = passwordEncoder;
        this.userDao = userDao;
        this.roleDao = roleDao;
    }

    @Override
    public List<User> getAllUsers() {
        return userDao.getAllUsers();
    }

    @Override
    public User getUserById(long id) {
        return userDao.getUserById(id);
    }

    @Override
    @PostPersist
    public void saveUser(User user) {
        if (user.getRoles().size() == 0) {
            user.addRole(roleDao.findByName("USER"));
        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userDao.saveUser(user);
    }

    @Override
    public void deleteUserById(long id) {
        userDao.deleteUserById(id);
    }

    @Override
    public void updateUser(User user) {
        if (user.getRoles().size() == 0) {
            user.addRole(roleDao.findByName("USER"));
        }
        if(user.getPassword() == "") {
            user.setPassword(getUserById(user.getId()).getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userDao.updateUser(user);
    }
}

