package dev.potgon.sif.controller;

import dev.potgon.sif.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExportService exportService;
    
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<Map<String, Object>> exportMonth(
            @PathVariable Integer year, 
            @PathVariable Integer month) {
        return ResponseEntity.ok(exportService.exportMonth(year, month));
    }
    
    @GetMapping("/year/{year}")
    public ResponseEntity<Map<String, Object>> exportYear(@PathVariable Integer year) {
        return ResponseEntity.ok(exportService.exportYear(year));
    }
    
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> exportAll() {
        return ResponseEntity.ok(exportService.exportAll());
    }
}
