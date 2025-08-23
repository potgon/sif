package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.enums.CategoryTypeEnum;
import dev.potgon.sif.dto.shared.ParamDTO;
import dev.potgon.sif.dto.shared.PeriodDTO;
import dev.potgon.sif.dto.shared.TransactionDTO;
import dev.potgon.sif.dto.shared.UserDTO;
import dev.potgon.sif.dto.request.IncomeUpdateDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.entity.Param;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.mapper.ParamMapper;
import dev.potgon.sif.mapper.PeriodMapper;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.repository.PeriodRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.service.MetricsService;
import dev.potgon.sif.utils.AuthUtils;
import dev.potgon.sif.utils.Constants;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsServiceImpl implements MetricsService {
    private final FinanceUtils financeUtils;
    private final AuthUtils authUtils;

    private final PeriodRepository periodRepo;
    private final ParamRepository paramRepo;
    private final TransactionRepository transactionRepo;
    private final CategoryRepository categoryRepo;

    private final PeriodMapper periodMapper;
    private final ParamMapper paramMapper;

    @Override
    public MonthlyMetricsDTO getMonthlyMetrics(int year, int month) {
        BigDecimal incomeSum = getSummedIncomeAmount(year, month);
        BigDecimal expenseSum = getExpenseSumForPeriod(year, month);
        BigDecimal previousMonthIncomeSum = getSummedIncomeAmount(year, getPreviousMonth(month));
        BigDecimal previousMonthExpenseSum = getExpenseSumForPeriod(year, getPreviousMonth(month));

        return MonthlyMetricsDTO.builder()
                .totalIncome(incomeSum)
                .totalExpenses(expenseSum)
                .prevMonthIncomeDiff(
                        computePercentageDifference(incomeSum, previousMonthIncomeSum))
                .prevMonthExpensesDiff(
                        computePercentageDifference(expenseSum, previousMonthExpenseSum))
                .build();
    }

    @Override
    public AnnualExpensesDTO getAnnualExpenses(int year) {
        BigDecimal[] transactionSumPerMonth = new BigDecimal[12];
        for (int i = 0; i <= 11; i++) {
            transactionSumPerMonth[i] = getExpenseSumForPeriod(year, i + 1)
                    .setScale(0, RoundingMode.HALF_UP);
        }
        return AnnualExpensesDTO.builder()
                .totalExpenses(transactionSumPerMonth)
                .build();
    }

    @Override
    public MonthlyTargetDTO getMonthlyTarget(int year, int month) {
        AccumulatedDTO accumulatedData = getCurrentAccumulated();
        
        return MonthlyTargetDTO.builder()
                .currentExpensePercentage(computeCurrentMonthExpenseTargetAsPercentage(year, month))
                .targetExpense(computeExpenseTargetAmount(year, month))
                .targetPercentage(getExpenseTargetPercentage())
                .surplus(computeCurrentMonthSurplusAmount(year, month))
                .accumulated(accumulatedData.getAccumulatedValue())
                .build();
    }

    @Override
    public ExtraPayDTO getExtraPay(int year, int month) {
        PeriodDTO period = periodMapper.toDTO(periodRepo.findByYearAndMonthAndUser(year, month, authUtils.getUserEntity()));
        return ExtraPayDTO.builder()
                .period(period)
                .extraPay(period.getExtraPay())
                .build();
    }

    @Override
    public void updateIncome(IncomeUpdateDTO incomeUpdateDTO) {
        Period period = financeUtils.getPeriodIfExists(incomeUpdateDTO.getYear(), incomeUpdateDTO.getMonth());
        
        if (incomeUpdateDTO.getSalary() != null && !incomeUpdateDTO.getSalary().equals(BigDecimal.ZERO)) {
            period.setSalary(incomeUpdateDTO.getSalary());
            periodRepo.save(period);
        }
        if (incomeUpdateDTO.getExtraPay() != null && !incomeUpdateDTO.getExtraPay().equals(BigDecimal.ZERO)) {
            period.setExtraPay(incomeUpdateDTO.getExtraPay());
            periodRepo.save(period);
        }
    }

    /**
     * Gets the current accumulated value
     */
    public AccumulatedDTO getCurrentAccumulated() {
        try {
            ParamDTO accumulatedParam = paramMapper.toDTO(
                paramRepo.findByNameAndUser(Constants.PARAM_ACCUMULATED, authUtils.getUserEntity())
            );
            
            BigDecimal accumulatedValue = BigDecimal.ZERO;
            if (accumulatedParam != null) {
                accumulatedValue = new BigDecimal(accumulatedParam.getValue());
            }
            
            String message = accumulatedValue.compareTo(BigDecimal.ZERO) >= 0 
                ? "Ahorros acumulados" 
                : "Deuda acumulada";
            
            return AccumulatedDTO.builder()
                .accumulatedValue(accumulatedValue)
                .message(message)
                .build();
                
        } catch (Exception e) {
            log.error("Error getting current accumulated value: {}", e.getMessage(), e);
            return AccumulatedDTO.builder()
                .accumulatedValue(BigDecimal.ZERO)
                .message("Error al obtener valor acumulado")
                .build();
        }
    }

    /* HELPER METHODS */

    private BigDecimal computePercentageDifference(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.equals(BigDecimal.ZERO)) return null;
        if (current == null) current = BigDecimal.ZERO;
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private BigDecimal getSummedIncomeAmount(int year, int month) {
        Period period = financeUtils.getPeriodIfExists(year, month);
        BigDecimal salary = period.getSalary() != null ? period.getSalary() : BigDecimal.ZERO;
        BigDecimal extraPay = period.getExtraPay() != null ? period.getExtraPay() : BigDecimal.ZERO;
        return salary.add(extraPay);
    }

    private BigDecimal getExpenseTargetPercentage() {
        BigDecimal result;
        try {
            String paramValue = paramRepo.findByNameAndUser(Constants.PARAM_EXPENSE_TARGET, authUtils.getUserEntity()).getValue();
            result = new BigDecimal(paramValue);
        } catch (NumberFormatException e) {
            log.error("Error while parsing expense target parameter: Not a BigDecimal");
            throw new BusinessException("Error parsing expense target parameter");
        } catch (Exception ex) {
            throw new BusinessException("Error recovering expense target parameter");
        }
        return result;
    }

    private BigDecimal computeExpenseTargetAmount(int year, int month) {
        BigDecimal income = getSummedIncomeAmount(year, month);
        BigDecimal expenseTargetPercentage = getExpenseTargetPercentage();

        return expenseTargetPercentage
                .divide(Constants.BIG_DECIMAL_ONE_HUNDRED, 4, RoundingMode.HALF_UP)
                .multiply(income)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal computeCurrentMonthExpenseTargetAsPercentage(int year, int month) {
        BigDecimal expenseTargetAmount = computeExpenseTargetAmount(year, month);

        if (expenseTargetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal actualExpense = getExpenseSumForPeriod(year, month);

        return actualExpense
                .divide(expenseTargetAmount, 4, RoundingMode.HALF_UP)
                .multiply(Constants.BIG_DECIMAL_ONE_HUNDRED)
                .setScale(2, RoundingMode.HALF_UP);
    }



    private BigDecimal computeCurrentMonthSurplusAmount(int year, int month) {
        BigDecimal targetAmount = computeExpenseTargetAmount(year, month);
        BigDecimal currentMonthExpenses = getExpenseSumForPeriod(year, month);
        BigDecimal surplus = targetAmount.subtract(currentMonthExpenses);
        
        log.debug("Surplus calculation for {}/{}: targetAmount={}, currentMonthExpenses={}, surplus={}", 
                  year, month, targetAmount, currentMonthExpenses, surplus);
        
        return surplus;
    }

    private int getPreviousMonth(int month) {
        if (month == 12) return 1;
        return month - 1;
    }
    
    private BigDecimal getExpenseSumForPeriod(int year, int month) {
        Period period = periodRepo.findByYearAndMonthAndUser(year, month, authUtils.getUserEntity());
        Category expenseCategory = categoryRepo.findByName(CategoryTypeEnum.EXPENSE);
        User user = authUtils.getUserEntity();
        
        BigDecimal sum = transactionRepo.sumAmountByPeriodAndCategoryAndUser(period, expenseCategory, user);
        return sum != null ? sum : BigDecimal.ZERO;
    }
}

