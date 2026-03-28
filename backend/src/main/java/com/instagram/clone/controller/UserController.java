package com.instagram.clone.controller;

import com.instagram.clone.model.User;
import com.instagram.clone.service.UserService;
import org.springframework.web.bind.annotation.*;


import java.util.List;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return userService.create(user);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.update(id, updatedUser);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.delete(id);
        return "User deleted successfully";
    }
}
