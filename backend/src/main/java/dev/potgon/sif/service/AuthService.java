package dev.potgon.sif.service;

import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.request.LoginDTO;
import dev.potgon.sif.dto.request.RegisterDTO;
import dev.potgon.sif.dto.response.RegisterResponseDTO;

public interface AuthService {
    RegisterResponseDTO register(RegisterDTO dto);
    JwtResponseDTO login(LoginDTO dto);
}
