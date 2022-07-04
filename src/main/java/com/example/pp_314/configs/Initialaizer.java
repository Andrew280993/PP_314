package com.example.pp_314.configs;


import com.example.pp_314.model.Role;
import com.example.pp_314.model.User;
import com.example.pp_314.service.RoleService;
import com.example.pp_314.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;


@Component
public class Initialaizer {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public Initialaizer(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostConstruct
    private void NewUsers() {

        Role role1 = new Role("ADMIN");
        Role role2 = new Role("USER");
        roleService.saveRole(role1);
        roleService.saveRole(role2);

        User user = new User();
        user.setUsername("George");
        user.setLastName("Michael");
        user.setAge((byte) 22);
        user.setEmail("user1@mail.ru");
        user.setPassword("100");
        user.addRole(role1);


        User user2 = new User();
        user2.setUsername("Lady");
        user2.setLastName("Gaga");
        user2.setAge((byte) 32);
        user2.setEmail("user2@mail.ru");
        user2.setPassword("100");
        user2.addRole(role2);

        User user3 = new User();
        user3.setUsername("Marty");
        user3.setLastName("McFly");
        user3.setAge((byte) 21);
        user3.setEmail("user3@mail.ru");
        user3.setPassword("100");
        user3.addRole(role2);
        user3.addRole(role1);


        userService.saveUser(user);
        userService.saveUser(user2);
        userService.saveUser(user3);

    }
}
