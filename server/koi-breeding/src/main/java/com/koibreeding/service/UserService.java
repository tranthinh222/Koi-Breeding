package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.User;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
    }

    public User handleUpdateUser(User user) {
        User currentUser = this.handleFetchUserById(user.getId());
        if (currentUser != null) {
            currentUser.setUsername(user.getUsername() != null ? user.getUsername() : currentUser.getUsername());
            currentUser.setEmail(user.getEmail() != null ? user.getEmail() : currentUser.getEmail());
            currentUser.setPassword(user.getPassword() != null ? user.getPassword() : currentUser.getPassword());
            currentUser.setBirthday(user.getBirthday() != null ? user.getBirthday() : currentUser.getBirthday());
            currentUser.setGender(user.getGender() != null ? user.getGender() : currentUser.getGender());
            currentUser.setStatus(user.getStatus() != null ? user.getStatus() : currentUser.getStatus());
            currentUser.setRole(user.getRole() != null ? user.getRole() : currentUser.getRole());
            currentUser.setIsBanned(user.getIsBanned() != null ? user.getIsBanned() : currentUser.getIsBanned());
            currentUser.setExp(user.getExp() != null ? user.getExp() : currentUser.getExp());
            currentUser.setAvatarUrl(user.getAvatarUrl() != null ? user.getAvatarUrl() : currentUser.getAvatarUrl());

            currentUser = this.userRepository.save(currentUser);
        }

        return currentUser;
    }

    public User handleFetchUserById(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllUsers(Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageUser.getTotalPages());
        meta.setTotalElements(pageUser.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<User> userList = pageUser.getContent();

        resultPaginationDTO.setResult(userList);

        return resultPaginationDTO;
    }

    public void handleDeleteUser(Integer id) {
        this.userRepository.deleteById(id);
    }

    public boolean isUserExistById(Integer id) {
        return this.userRepository.existsById(id);
    }
}
