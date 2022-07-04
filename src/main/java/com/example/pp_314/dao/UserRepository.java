package com.example.pp_314.dao;

import com.example.pp_314.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
