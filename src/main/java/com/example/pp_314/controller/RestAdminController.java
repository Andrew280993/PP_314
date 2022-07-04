package com.example.pp_314.controller;

import com.example.pp_314.exeptionHandling.NoSuchUserException;
import com.example.pp_314.model.Role;
import com.example.pp_314.model.User;
import com.example.pp_314.service.RoleService;
import com.example.pp_314.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RestAdminController {
    private final UserService userService;
    private final RoleService roleService;


    @GetMapping
    public List<User> findAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/roles")
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();
    }

    @GetMapping("/principal")
    public User showMainUser(@AuthenticationPrincipal User mainUser) {
        return mainUser;
    }


    @PostMapping
    public User addNewUser(@RequestBody User user) {
        userService.updateUser(user);
        return user;
    }

    @GetMapping("{id}")
    public User findUser(@PathVariable long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            throw new NoSuchUserException("There is no user with ID =  " + id + " in Database");
        }
        return user;
    }

    @PutMapping
    public User updateUser(@RequestBody User user){
        userService.updateUser(user);
        return user;
    }

    @DeleteMapping("{id}")
    public String deleteUser(@PathVariable long id) {
    User user = userService.getUserById(id);
        if (user == null) {
            throw new NoSuchUserException("There is no user with ID = " + id + " in Database");
        }
        userService.deleteUserById(id);
        return "User with ID " + id + " was delete";
    }

}