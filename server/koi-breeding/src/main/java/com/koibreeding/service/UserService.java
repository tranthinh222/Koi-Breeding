package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User handleFetchUser(Integer userId){
        return userRepository.findById(userId).orElse(null);
    }
}
