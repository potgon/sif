package dev.potgon.sif.service.impl;


import dev.potgon.sif.entity.User;
import dev.potgon.sif.repository.UserRepository;
import dev.potgon.sif.service.UserService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    
    @Value("${app.default-user.email}")
    private String defaultUserEmail;
    
    @Value("${app.default-user.name}")
    private String defaultUserName;
    
    @PostConstruct
    public void init() {
        ensureDefaultUserExists();
    }
    
    @Override
    @Transactional(readOnly = true)
    public User getDefaultUser() {
        return userRepository.findByEmail(defaultUserEmail)
                .orElseThrow(() -> new RuntimeException("Default user not found"));
    }
    
    @Override
    @Transactional
    public void ensureDefaultUserExists() {
        if (!userRepository.existsByEmail(defaultUserEmail)) {
            User defaultUser = new User();
            defaultUser.setEmail(defaultUserEmail);
            defaultUser.setName(defaultUserName);
            userRepository.save(defaultUser);
        }
    }
}
