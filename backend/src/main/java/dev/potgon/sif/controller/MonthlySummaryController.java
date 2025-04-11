package dev.potgon.sif.controller;

import dev.potgon.sif.dto.MonthlySummaryDTO;
import dev.potgon.sif.service.MonthlySummaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/monthly-summaries")
@RequiredArgsConstructor
public class MonthlySummaryController {

    private final MonthlySummaryService monthlySummaryService;
    
    @GetMapping
    public ResponseEntity<List<MonthlySummaryDTO>> getAllMonthlySummaries() {
        return ResponseEntity.ok(monthlySummaryService.getAllMonthlySummaries());
    }
    
    @GetMapping("/{year}/{month}")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummaryByMonth(
            @PathVariable Integer year, 
            @PathVariable Integer month) {
        return ResponseEntity.ok(monthlySummaryService.getMonthlySummaryByMonth(year, month));
    }
    
    @PostMapping
    public ResponseEntity<MonthlySummaryDTO> createMonthlySummary(@Valid @RequestBody MonthlySummaryDTO monthlySummaryDTO) {
        return new ResponseEntity<>(monthlySummaryService.createMonthlySummary(monthlySummaryDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{year}/{month}")
    public ResponseEntity<MonthlySummaryDTO> updateMonthlySummary(
            @PathVariable Integer year, 
            @PathVariable Integer month, 
            @Valid @RequestBody MonthlySummaryDTO monthlySummaryDTO) {
        return ResponseEntity.ok(monthlySummaryService.updateMonthlySummary(year, month, monthlySummaryDTO));
    }
    
    @PostMapping("/calculate/{year}/{month}")
    public ResponseEntity<MonthlySummaryDTO> calculateMonthlySummary(
            @PathVariable Integer year, 
            @PathVariable Integer month) {
        return ResponseEntity.ok(monthlySummaryService.calculateMonthlySummary(year, month));
    }
}
