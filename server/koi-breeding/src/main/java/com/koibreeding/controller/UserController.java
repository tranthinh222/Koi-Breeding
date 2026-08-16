package com.koibreeding.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createNewUser(@RequestBody User user) {
        User newUser = this.userService.handleCreateUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateAUser(@RequestBody User user) throws Exception {
        if (!this.userService.isUserExistById(user.getId())) {
            throw new Exception("User with id '" + user.getId() + "' is not exist.");
        }

        User updatedUser = this.userService.handleUpdateUser(user);

        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) throws Exception {
        User fetchedUser = userService.handleFetchUserById(id);
        if (fetchedUser == null) {
            throw new Exception("User with id '" + id + "' is not exist.");
        }

        return ResponseEntity.ok(fetchedUser);
    }

    @GetMapping("/users")
    public ResponseEntity<ResultPaginationDTO> getAllUsers(Pageable pageable) {
        ResultPaginationDTO userList = userService.handleFetchAllUsers(pageable);

        return ResponseEntity.ok(userList);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) throws Exception {
        if (!userService.isUserExistById(id)) {
            throw new Exception("User with id '" + id + "' is not exist.");
        }

        this.userService.handleDeleteUser(id);

        return ResponseEntity.ok().build();
    }
}
