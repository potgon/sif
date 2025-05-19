package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.response.RegisterResponseDTO;
import dev.potgon.sif.dto.shared.UserDTO;
import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.request.LoginDTO;
import dev.potgon.sif.dto.request.RegisterDTO;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.mapper.UserMapper;
import dev.potgon.sif.repository.UserRepository;
import dev.potgon.sif.service.AuthService;
import dev.potgon.sif.utils.AuthUtils;
import dev.potgon.sif.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthUtils authUtils;

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Override
    public RegisterResponseDTO register(RegisterDTO dto) {
        RegisterResponseDTO response = RegisterResponseDTO.builder().build();
        if (userRepository.existsByEmail(dto.getEmail())) {
            response.setResult(false);
            response.setMessage("Existe otro usuario con este email");
            return response;
        }

        UserDTO user = new UserDTO();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setName(dto.getName());
        user.setSurname(dto.getSurname());
        user.setCreatedAt(ZonedDateTime.now());

        User savedUser = userRepository.save(userMapper.toEntity(user));
        authUtils.createExpenseTarget(userMapper.toDTO(savedUser));
        authUtils.createSalary(userMapper.toDTO(savedUser));
        authUtils.createAccumulated(userMapper.toDTO(savedUser));
        authUtils.createPeriods(userMapper.toDTO(savedUser));
        response.setResult(true);
        return response;
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
