package dev.potgon.sif.controller;

import dev.potgon.sif.dto.response.JwtResponseDTO;
import dev.potgon.sif.dto.request.LoginDTO;
import dev.potgon.sif.dto.request.RegisterDTO;
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
    public ResponseEntity<Void> register(@RequestBody RegisterDTO dto) {
        return authService.register(dto)
                ? ResponseEntity.ok().build()
                : ResponseEntity.badRequest().build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> login(@RequestBody LoginDTO dto) {
        return ResponseEntity.ok(authService.login(dto));
    }

}
