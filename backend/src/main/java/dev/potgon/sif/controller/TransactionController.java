package dev.potgon.sif.controller;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.service.TransactionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionsService transactionsService;

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyTransactionsDTO> getMonthlyTransactions(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(transactionsService.getMonthlyTransactions(year, month));
    }

    @GetMapping("/monthly/subcategory/sum")
    public ResponseEntity<MonthlySubcategoryExpenseDTO> getMonthlyTransactionSubcategorySum(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(transactionsService.getMonthlyTransactionSubcategorySum(year, month));
    }

    @GetMapping("/monthly/subcategory")
    public ResponseEntity<MonthlyTransactionsDTO> getMonthlyTransactionRows(
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam String subcategory
    ) {
        return ResponseEntity.ok(transactionsService.getMonthlyTransactionBySubcategory(year, month, subcategory));
    }

    @PostMapping("/new")
    public ResponseEntity<TransactionDTO> createTransaction(
            @RequestBody TransactionCreateDTO transactionCreateDTO
    ) {
        return ResponseEntity.ok(transactionsService.createTransaction(transactionCreateDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteDTO> deleteTransaction(
            @PathVariable Long id
    ) {
        DeleteDTO result = transactionsService.deleteTransaction(id);
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Long id,
            @RequestBody TransactionUpdateDTO transactionUpdateDTO
    ) {
        if (!id.equals(transactionUpdateDTO.getId())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(transactionsService.updateTransaction(transactionUpdateDTO));
    }
}
