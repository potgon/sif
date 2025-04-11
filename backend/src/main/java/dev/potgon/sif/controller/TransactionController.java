package dev.potgon.sif.controller;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.TransactionFilterDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsResponseDTO;
import dev.potgon.sif.dto.response.TransactionResponseDTO;
import dev.potgon.sif.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<TransactionResponseDTO>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
    
    @PostMapping
    public ResponseEntity<TransactionResponseDTO> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        return new ResponseEntity<>(transactionService.createTransaction(transactionDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long id, @Valid @RequestBody TransactionDTO transactionDTO) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, transactionDTO));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/filter")
    public ResponseEntity<List<TransactionResponseDTO>> getFilteredTransactions(@RequestBody TransactionFilterDTO filterDTO) {
        return ResponseEntity.ok(transactionService.getFilteredTransactions(filterDTO));
    }
    
    @GetMapping("/monthly/{year}/{month}")
    public ResponseEntity<MonthlyTransactionsResponseDTO> getMonthlyTransactions(
            @PathVariable Integer year, 
            @PathVariable Integer month) {
        return ResponseEntity.ok(transactionService.getMonthlyTransactions(year, month));
    }
}
