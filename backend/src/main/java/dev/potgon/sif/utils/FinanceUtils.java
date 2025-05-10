package dev.potgon.sif.utils;

import dev.potgon.sif.dto.*;
import dev.potgon.sif.dto.response.MonthlySubcategoryExpenseDTO;
import dev.potgon.sif.entity.*;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.mapper.CategoryMapper;
import dev.potgon.sif.mapper.PeriodMapper;
import dev.potgon.sif.mapper.SubcategoryMapper;
import dev.potgon.sif.mapper.TransactionMapper;
import dev.potgon.sif.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceUtils {

    private final TransactionRepository transactionRepo;
    private final PeriodRepository periodRepo;
    private final CategoryRepository categoryRepo;
    private final BalanceSnapshotRepository balanceSnapshotRepo;
    private final ParamRepository paramRepo;
    private final SubcategoryRepository subcategoryRepo;

    private final TransactionMapper transactionMapper;
    private final PeriodMapper periodMapper;
    private final CategoryMapper categoryMapper;
    private final SubcategoryMapper subcategoryMapper;

    public Period getPeriodIfExists(int year, int month) {
        Period period = periodRepo.findByYearAndMonth(year, month);
        if (period == null) {
            throw new ResourceNotFoundException("Period", "Year | Month", String.format("%d | %d", year, month));
        }
        return period;
    }

    public Subcategory getSubcategoryIfExists(String name) {
        Subcategory subcat = subcategoryRepo.findByName(name);
        if (subcat == null) {
            throw new ResourceNotFoundException("Subcategory not found with name: " + name);
        }
        return subcat;
    }

    private Optional<BigDecimal> getPeriodExtraPayIfExists(int year, int month) {
        Period period = getPeriodIfExists(year, month);
        if (period.getExtraPay() == null) return Optional.empty();
        return Optional.of(period.getExtraPay());
    }

    private Category getCategoryIfExists(Long categoryId) {
        return categoryRepo.findById(categoryId).orElse(null);
    }

    private Subcategory getSubcategoryIfExists(Long subcategoryId) {
        return subcategoryRepo.findById(subcategoryId).orElse(null);
    }

    public TransactionDTO getTransactionByIdIfExists(Long id) {
        Optional<Transaction> tx = transactionRepo.findById(id);
        if (tx.isEmpty()) {
            log.info("Transaction with id {} not found", id);
            return null;
        }
        return transactionMapper.toDTO(tx.get());
    }

    public List<TransactionDTO> getTransactionsByPeriodAndCategory(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriodAndCategoryOrderByDateDesc(period, category)
                .stream().map(transactionMapper::toDTO).toList();
    }

    public List<TransactionDTO> getTransactionsByPeriodAndSubcategory(int year, int month, String subcategory) {
        Period period = getPeriodIfExists(year, month);
        Subcategory subcategoryEntity = subcategoryRepo.findByName(subcategory);

        return transactionRepo.findAllByPeriodAndSubcategory(period, subcategoryEntity)
                .stream().map(transactionMapper::toDTO).toList();
    }

    public BigDecimal sumAllTransactions(List<TransactionDTO> transactions) {
        return transactions.stream()
                .map(TransactionDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal computePercentageDifference(BigDecimal current, BigDecimal previous) {
        if (previous == null) return null;
        if (current == null) current = BigDecimal.ZERO;
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public BigDecimal getBigDecimalParam(String paramName) {
        BigDecimal result;
        try {
            String paramValue = paramRepo.findByName(paramName).getValue();
            result = BigDecimal.valueOf(Double.parseDouble(paramValue));
        } catch (NumberFormatException e) {
            log.error("Error while parsing parameter: {} | Not a BigDecimal", paramName);
            throw new BusinessException("Error parsing parameter: " + paramName);
        } catch (Exception ex) {
            throw new BusinessException("Error recovering parameter: " + paramName);
        }
        return result;
    }

    public BigDecimal getSummedIncomeAmount(int year, int month) {
        BigDecimal salary = getBigDecimalParam(Constants.PARAM_SALARY);
        Optional<BigDecimal> extraPay = getPeriodExtraPayIfExists(year, month);
        return extraPay.map(bigDecimal -> bigDecimal.add(salary)).orElse(salary);
    }

    public int getPreviousMonth(int month) {
        if (month == 12) return 1;
        return month - 1;
    }

    public BigDecimal computeExpenseTargetAmount(int year, int month) {
        BigDecimal income = getSummedIncomeAmount(year, month);
        BigDecimal expenseTargetPercentage = getBigDecimalParam(Constants.PARAM_EXPENSE_TARGET);

        return expenseTargetPercentage
                .divide(Constants.BIG_DECIMAL_ONE_HUNDRED, 4, RoundingMode.HALF_UP)
                .multiply(income)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal computeCurrentMonthExpenseTargetAsPercentage(int year, int month) {
        BigDecimal expenseTargetAmount = computeExpenseTargetAmount(year, month);

        if (expenseTargetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal actualExpense = sumAllTransactions(
                getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE)
        );

        return actualExpense
                .divide(expenseTargetAmount, 4, RoundingMode.HALF_UP)
                .multiply(Constants.BIG_DECIMAL_ONE_HUNDRED)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal computeCurrentMonthSurplusAmount(int year, int month) {
        BigDecimal targetAmount = computeExpenseTargetAmount(year, month);
        BigDecimal currentMonthExpenses = sumAllTransactions(getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE));
        return targetAmount.subtract(currentMonthExpenses);
    }

    public BigDecimal getCurrentSurplus() {
        BalanceSnapshot surplus = balanceSnapshotRepo.findBalanceSnapshotByType(BalanceType.SURPLUS);
        if (surplus == null) return BigDecimal.ZERO;
        return surplus.getCurrentAmount();
    }

    public MonthlySubcategoryExpenseDTO computeSubcategoryExpenses(List<TransactionDTO> transactions) {
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

    public void createTransaction(TransactionCreateDTO transactionReq) {
        PeriodDTO period = periodMapper.toDTO(getPeriodIfExists(transactionReq.getYear(), transactionReq.getMonth()));
        CategoryDTO category = categoryMapper.toDTO(categoryRepo.findByName(CategoryTypeEnum.EXPENSE));
        SubcategoryDTO subcat = subcategoryMapper.toDTO(getSubcategoryIfExists(transactionReq.getSubcategoryName()));
        TransactionDTO transactionDTO = TransactionDTO.builder()
                .period(period)
                .date(transactionReq.getDate())
                .amount(transactionReq.getAmount())
                .description(transactionReq.getDescription())
                .category(category)
                .subcategory(subcat)
                .isRecurring(transactionReq.getIsRecurring())
                .createdAt(ZonedDateTime.now())
                .build();
        transactionRepo.save(transactionMapper.toEntity(transactionDTO));
    }

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
        return transactionMapper.toDTO(tx);
    }

}
