package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.service.TransactionsService;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionsService {

    private final FinanceUtils financeUtils;

    @Override
    public MonthlyTransactionsDTO getMonthlyTransactions(int year, int month) {
        List<TransactionDTO> transactions = financeUtils.getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE);
        return MonthlyTransactionsDTO.builder()
                .transactions(transactions)
                .build();
    }

    @Override
    public MonthlySubcategoryExpenseDTO getMonthlyTransactionSubcategorySum(int year, int month) {
        List<TransactionDTO> transactions = financeUtils.getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE);
        return financeUtils.computeSubcategoryExpenses(transactions);
    }

    @Override
    public MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory) {
        List<TransactionDTO> transactions = financeUtils.getTransactionsByPeriodAndSubcategory(year, month, subcategory);
        return MonthlyTransactionsDTO.builder()
                .transactions(transactions)
                .build();
    }

    @Override
    public TransactionDTO createTransaction(TransactionCreateDTO transactionCreateDTO) {
        return financeUtils.createTransaction(transactionCreateDTO);
    }

    @Override
    public DeleteDTO deleteTransaction(Long id) {
        return financeUtils.deleteTransaction(id);
    }

    @Override
    public TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO) {
        return financeUtils.updateTransaction(updateDTO);
    }
}
