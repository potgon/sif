package dev.potgon.sif.utils;

import dev.potgon.sif.dto.*;
import dev.potgon.sif.dto.response.MonthlySubcategoryExpenseDTO;
import dev.potgon.sif.entity.BalanceSnapshot;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.mapper.TransactionMapper;
import dev.potgon.sif.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    public Period getPeriodIfExists(int year, int month) {
        Period period = periodRepo.findByYearAndMonth(year, month);
        if (period == null) {
            throw new ResourceNotFoundException("Period", "Year | Month", String.format("%d | %d", year, month));
        }
        return period;
    }

    private Optional<BigDecimal> getPeriodExtraPayIfExists(int year, int month) {
        Period period = getPeriodIfExists(year, month);
        if (period.getExtraPay() == null) return Optional.empty();
        return Optional.of(period.getExtraPay());
    }

    public List<TransactionDTO> getTransactionsByPeriodAndCategory(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriodAndCategoryOrderByDateDesc(period, category)
                .stream().map(transactionMapper::toDTO).toList();
    }

    public List<TransactionDTO> getTransactionsByPeriod(int year, int month) {
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriod(period)
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
                .divide(Constants.BD_ONE_HUNDRED, 4, RoundingMode.HALF_UP)
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
                .multiply(Constants.BD_ONE_HUNDRED)
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
        Map<SubcategoryDTO, BigDecimal> subcategorySums = new HashMap<>();

        for (TransactionDTO tx : transactions) {
            SubcategoryDTO subDTO = SubcategoryDTO.builder()
                    .id(tx.getId())
                    .name(tx.getSubcategory().getName())
                    .build();
            subcategorySums.merge(subDTO, tx.getAmount(), BigDecimal::add);
        }

        List<SubcategoryExpenseDTO> expenses = subcategorySums.entrySet().stream()
                .map(entry -> SubcategoryExpenseDTO.builder()
                        .subcategory(entry.getKey())
                        .amount(entry.getValue())
                        .build())
                .sorted(Comparator.comparing(dto -> dto.getSubcategory().getName()))
                .toList();
        return MonthlySubcategoryExpenseDTO.builder().subcategoryExpenses(expenses).build();
    }

}
