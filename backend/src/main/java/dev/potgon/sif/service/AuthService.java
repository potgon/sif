package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.response.LoginDTO;
import dev.potgon.sif.dto.response.RegisterDTO;

public interface AuthService {
    boolean register(RegisterDTO dto);
    JwtResponseDTO login(LoginDTO dto);
}
