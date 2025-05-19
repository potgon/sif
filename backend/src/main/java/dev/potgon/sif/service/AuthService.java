package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.request.LoginDTO;
import dev.potgon.sif.dto.request.RegisterDTO;

public interface AuthService {
    boolean register(RegisterDTO dto);
    JwtResponseDTO login(LoginDTO dto);
}
