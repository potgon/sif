package dev.potgon.sif.controller;

import dev.potgon.sif.dto.DebtDTO;
import dev.potgon.sif.service.DebtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/debts")
@RequiredArgsConstructor
public class DebtController {

    private final DebtService debtService;
    
    @GetMapping
    public ResponseEntity<List<DebtDTO>> getAllDebts() {
        return ResponseEntity.ok(debtService.getAllDebts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DebtDTO> getDebtById(@PathVariable Long id) {
        return ResponseEntity.ok(debtService.getDebtById(id));
    }
    
    @PostMapping
    public ResponseEntity<DebtDTO> createDebt(@Valid @RequestBody DebtDTO debtDTO) {
        return new ResponseEntity<>(debtService.createDebt(debtDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DebtDTO> updateDebt(@PathVariable Long id, @Valid @RequestBody DebtDTO debtDTO) {
        return ResponseEntity.ok(debtService.updateDebt(id, debtDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebt(@PathVariable Long id) {
        debtService.deleteDebt(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/paid")
    public ResponseEntity<DebtDTO> markAsPaid(@PathVariable Long id) {
        return ResponseEntity.ok(debtService.markAsPaid(id));
    }
}
