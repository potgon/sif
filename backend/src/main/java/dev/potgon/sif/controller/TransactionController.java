package dev.potgon.sif.controller;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.service.TransactionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("/{id}")
    public ResponseEntity<TransactionDeleteDTO> deleteTransaction(
            @PathVariable Long id
    ) {
        TransactionDeleteDTO result = transactionsService.deleteTransaction(id);
        if (result.isResult()) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
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

    @GetMapping("/subcategories")
    public ResponseEntity<List<SubcategoryDTO>> fetchAllSubcategories() {
        return ResponseEntity.ok(transactionsService.fetchAllSubcategories());
    }
}
