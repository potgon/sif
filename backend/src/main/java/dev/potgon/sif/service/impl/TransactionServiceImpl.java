package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.mapper.SubcategoryMapper;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.service.TransactionsService;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionsService {

    private final FinanceUtils financeUtils;

    private final SubcategoryRepository subcategoryRepo;

    private final SubcategoryMapper subcategoryMapper;

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
    public void createTransaction(TransactionCreateDTO transactionCreateDTO) {
        financeUtils.createTransaction(transactionCreateDTO);
    }

    @Override
    public TransactionDeleteDTO deleteTransaction(Long id) {
        return financeUtils.deleteTransaction(id);
    }

    @Override
    public TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO) {
        return financeUtils.updateTransaction(updateDTO);
    }

    @Override
    public List<SubcategoryDTO> fetchAllSubcategories() {
        return subcategoryRepo.findAll().stream().map(subcategoryMapper::toDTO).collect(Collectors.toList());
    }
}
