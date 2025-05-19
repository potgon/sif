package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.enums.CategoryTypeEnum;
import dev.potgon.sif.dto.enums.Operation;
import dev.potgon.sif.dto.request.TransactionCreateDTO;
import dev.potgon.sif.dto.request.TransactionUpdateDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.dto.shared.*;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.Transaction;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.mapper.*;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.TransactionsService;
import dev.potgon.sif.utils.AuthUtils;
import dev.potgon.sif.utils.Constants;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionServiceImpl implements TransactionsService {

    private final FinanceUtils financeUtils;
    private final AuthUtils authUtils;

    private final TransactionRepository transactionRepo;
    private final CategoryRepository categoryRepo;
    private final ParamRepository paramRepo;
    private final SubcategoryRepository subcategoryRepo;

    private final TransactionMapper transactionMapper;
    private final CategoryMapper categoryMapper;
    private final PeriodMapper periodMapper;
    private final SubcategoryMapper subcategoryMapper;
    private final ParamMapper paramMapper;

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
        return computeSubcategoryExpenses(transactions);
    }

    @Override
    public MonthlyTransactionsDTO getMonthlyTransactionBySubcategory(int year, int month, String subcategory) {
        List<TransactionDTO> transactions = getTransactionsByPeriodAndSubcategory(year, month, subcategory);
        return MonthlyTransactionsDTO.builder()
                .transactions(transactions)
                .build();
    }

    @Override
    public TransactionDTO createTransaction(TransactionCreateDTO transactionCreateDTO) {
        PeriodDTO period = periodMapper.toDTO(financeUtils.getPeriodIfExists(transactionCreateDTO.getYear(), transactionCreateDTO.getMonth()));
        CategoryDTO category = categoryMapper.toDTO(categoryRepo.findByName(CategoryTypeEnum.EXPENSE));
        TransactionDTO transactionDTO = TransactionDTO.builder()
                .period(period)
                .date(transactionCreateDTO.getDate())
                .amount(transactionCreateDTO.getAmount())
                .description(transactionCreateDTO.getDescription())
                .category(category)
                .subcategory(transactionCreateDTO.getSubcategory())
                .isRecurring(transactionCreateDTO.getIsRecurring())
                .createdAt(ZonedDateTime.now())
                .build();
        Transaction savedEntity = transactionRepo.save(transactionMapper.toEntity(transactionDTO));
        updateAccumulated(transactionDTO.getAmount(), Operation.SUBTRACT);
        return transactionMapper.toDTO(savedEntity);
    }

    @Override
    public DeleteDTO deleteTransaction(Long id) {
        Optional<Transaction> transaction = transactionRepo.findById(id);
        DeleteDTO response = DeleteDTO.builder().build();
        if (transaction.isPresent()) {
            transactionRepo.deleteById(id);
            response.setId(id);
            response.setResult(true);
            response.setMessage("Transacción borrada");
            updateAccumulated(transaction.get().getAmount(), Operation.ADD);
            return response;
        }
        response.setId(id);
        response.setResult(false);
        response.setMessage("No se ha podido borrar la transacción");
        return response;
    }

    @Override
    public TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO) {
        Transaction tx = transactionMapper.toEntity(getTransactionByIdIfExists(updateDTO.getId()));
        if (updateDTO.getDate() != null) {
            tx.setDate(updateDTO.getDate());
        }
        if (updateDTO.getAmount() != null) {
            tx.setAmount(updateDTO.getAmount());
        }
        if (updateDTO.getDescription() != null) {
            tx.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getSubcategory() != null) {
            tx.setSubcategory(subcategoryMapper.toEntity(updateDTO.getSubcategory()));
        }
        if (updateDTO.getIsRecurring() != null) {
            tx.setIsRecurring(updateDTO.getIsRecurring());
        }
        if (updateDTO.getNotes() != null) {
            tx.setNotes(updateDTO.getNotes());
        }
        transactionRepo.save(tx);
        if (!tx.getAmount().equals(updateDTO.getAmount())) {
            BigDecimal difference = updateDTO.getAmount().subtract(tx.getAmount());
            updateAccumulated(difference, Operation.ADD);
        }
        return transactionMapper.toDTO(tx);
    }

    /* HELPER METHODS */

    private void updateAccumulated(BigDecimal amount, Operation op) {
        ParamDTO surplusParam = paramMapper.toDTO(paramRepo.findByNameAndUser(Constants.PARAM_ACCUMULATED, authUtils.getUserEntity()));
        BigDecimal surplusVal = new BigDecimal(surplusParam.getValue());
        BigDecimal newValue = (op == Operation.ADD)
                ? surplusVal.add(amount)
                : surplusVal.subtract(amount);

        surplusParam.setValue(newValue.toString());
        paramRepo.save(paramMapper.toEntity(surplusParam));
    }

    public TransactionDTO getTransactionByIdIfExists(Long id) {
        Optional<Transaction> tx = transactionRepo.findById(id);
        if (tx.isEmpty()) {
            log.info("Transaction with id {} not found", id);
            return null;
        }
        return transactionMapper.toDTO(tx.get());
    }

    private List<TransactionDTO> getTransactionsByPeriodAndSubcategory(int year, int month, String subcategory) {
        Period period = financeUtils.getPeriodIfExists(year, month);
        Optional<Subcategory> subcategoryEntity = subcategoryRepo.findByNameAndUser(subcategory, authUtils.getUserEntity());
        User user = authUtils.getUserEntity();
        return transactionRepo.findAllByPeriodAndSubcategoryAndUser(period, subcategoryEntity.orElse(null), user)
                .stream().map(transactionMapper::toDTO).toList();
    }


    private MonthlySubcategoryExpenseDTO computeSubcategoryExpenses(List<TransactionDTO> transactions) {
        Map<SubcategoryDTO, SubcategoryExpenseDTO> expenseMap = new HashMap<>();

        for (TransactionDTO tx : transactions) {
            SubcategoryDTO subDTO = tx.getSubcategory();
            SubcategoryExpenseDTO existing = expenseMap.get(subDTO);

            if (existing == null) {
                expenseMap.put(subDTO, SubcategoryExpenseDTO.builder()
                        .subcategory(subDTO)
                        .amount(tx.getAmount())
                        .isRecurrent(tx.getIsRecurring())
                        .build());
            } else {
                BigDecimal newAmount = existing.getAmount().add(tx.getAmount());
                expenseMap.put(subDTO, SubcategoryExpenseDTO.builder()
                        .subcategory(subDTO)
                        .amount(newAmount)
                        .isRecurrent(existing.isRecurrent())
                        .build());
            }
        }

        List<SubcategoryExpenseDTO> expenses = expenseMap.values().stream()
                .sorted(Comparator.comparing(dto -> dto.getSubcategory().getName()))
                .toList();

        return MonthlySubcategoryExpenseDTO.builder().subcategoryExpenses(expenses).build();
    }
}
