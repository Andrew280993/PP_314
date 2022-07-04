package com.example.pp_314.service;

import com.example.pp_314.dao.UserDao;
import com.example.pp_314.model.User;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Transactional
@Service
public class UserDetails implements UserDetailsService {

    private final UserDao userDao;

    @Autowired
    public UserDetails(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userDao.findByUsername(email);
        if(user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        Hibernate.initialize(user.getAuthorities());
        return user;
    }
}
