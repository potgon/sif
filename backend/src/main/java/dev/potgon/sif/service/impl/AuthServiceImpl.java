package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.UserDTO;
import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.response.LoginDTO;
import dev.potgon.sif.dto.response.RegisterDTO;
import dev.potgon.sif.mapper.UserMapper;
import dev.potgon.sif.repository.UserRepository;
import dev.potgon.sif.service.AuthService;
import dev.potgon.sif.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public boolean register(RegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            return false;
        }

        UserDTO user = new UserDTO();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());

        userRepository.save(userMapper.toEntity(user));
        return true;
    }

    @Override
    public JwtResponseDTO login(LoginDTO dto) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );

        UserDetails user = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateToken(user.getUsername());

        return JwtResponseDTO.builder()
                .token(jwt)
                .build();
    }
}
