package dev.potgon.sif.controller;

import dev.potgon.sif.dto.TransactionCreateDTO;
import dev.potgon.sif.dto.TransactionUpdateDTO;
import dev.potgon.sif.dto.response.MonthlySubcategoryExpenseDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsDTO;
import dev.potgon.sif.service.TransactionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Void> createTransaction(
            @RequestBody TransactionCreateDTO transactionCreateDTO
    ) {
        transactionsService.createTransaction(transactionCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteTransaction(
            @RequestParam Long id
    ) {
        transactionsService.deleteTransaction(id);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }

    @PatchMapping
    public ResponseEntity<TransactionUpdateDTO> updateTransaction(
            @RequestBody TransactionUpdateDTO transactionUpdateDTO
    ) {
        transactionsService.updateTransaction(transactionUpdateDTO);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
