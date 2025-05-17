package dev.potgon.sif.controller;

import dev.potgon.sif.dto.ParamDTO;
import dev.potgon.sif.service.ParamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/params")
@RequiredArgsConstructor
public class ParamController {

    private final ParamService paramService;

    @GetMapping("/income/{name}")
    public ResponseEntity<ParamDTO> getParam(
            @PathVariable String name
    ) {
        return ResponseEntity.ok(paramService.getParam(name));
    }

    @PostMapping("/target")
    public ResponseEntity<ParamDTO> updateParam(
            @RequestBody Map<String, String> paramMap
    ) {
        return ResponseEntity.ok(paramService.updateParam(paramMap));
    }

}
