package dev.potgon.sif.controller;

import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.request.LoginDTO;
import dev.potgon.sif.dto.request.RegisterDTO;
import dev.potgon.sif.dto.response.RegisterResponseDTO;
import dev.potgon.sif.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterDTO dto) {
        RegisterResponseDTO response = authService.register(dto);
        return response.isResult()
                ? ResponseEntity.ok(response)
                : ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

}
