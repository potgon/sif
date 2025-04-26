package dev.potgon.sif.controller;

import dev.potgon.sif.service.AppStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/state")
@RequiredArgsConstructor
public class AppStateController {
    private final AppStateService appStateService;

    @GetMapping("/monthly")
    public ResponseEntity<Boolean> getMonthlyMetrics() {
        return ResponseEntity.ok(appStateService.checkAndTriggerMonthRollover());
    }
}
