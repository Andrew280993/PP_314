package com.example.pp_314.service;

import com.example.pp_314.dao.UserRepository;
import com.example.pp_314.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserServiceRepository {

    private final UserRepository userRepository;

    public UserServiceRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void save(User user) {
        userRepository.save(user);
    }
}
