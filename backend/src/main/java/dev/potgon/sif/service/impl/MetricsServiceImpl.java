package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.service.MetricsService;
import dev.potgon.sif.utils.Constants;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsServiceImpl implements MetricsService {
    private final FinanceUtils financeUtils;

    @Override
    public MonthlyMetricsDTO getMonthlyMetrics(int year, int month) {
        BigDecimal incomeSum = financeUtils.getSummedIncomeAmount(year, month);
        BigDecimal expenseSum = financeUtils.sumAllTransactions(
                financeUtils.getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE)
        );
        BigDecimal previousMonthIncomeSum = financeUtils.getSummedIncomeAmount(year, financeUtils.getPreviousMonth(month));
        BigDecimal previousMonthExpenseSum = financeUtils.sumAllTransactions(
                financeUtils.getTransactionsByPeriodAndCategory(year, financeUtils.getPreviousMonth(month), CategoryTypeEnum.EXPENSE)
        );

        return MonthlyMetricsDTO.builder()
                .totalIncome(incomeSum)
                .totalExpenses(expenseSum)
                .prevMonthIncomeDiff(
                        financeUtils.computePercentageDifference(incomeSum, previousMonthIncomeSum))
                .prevMonthExpensesDiff(
                        financeUtils.computePercentageDifference(expenseSum, previousMonthExpenseSum))
                .build();
    }

    @Override
    public AnnualExpensesDTO getAnnualExpenses(int year) {
        BigDecimal[] transactionSumPerMonth = new BigDecimal[12];
        for (int i = 0; i <= 11; i++) {
            transactionSumPerMonth[i] = financeUtils.sumAllTransactions(financeUtils.getTransactionsByPeriodAndCategory(year, i + 1, CategoryTypeEnum.EXPENSE))
                    .setScale(0, RoundingMode.HALF_UP);
        }
        return AnnualExpensesDTO.builder()
                .totalExpenses(transactionSumPerMonth)
                .build();
    }

    @Override
    public MonthlyTargetDTO getMonthlyTarget(int year, int month) {
        return MonthlyTargetDTO.builder()
                .currentExpensePercentage(
                        financeUtils.computeCurrentMonthExpenseTargetAsPercentage(year, month)
                )
                .targetExpense(financeUtils.computeExpenseTargetAmount(year, month))
                .targetPercentage(financeUtils.getBigDecimalParam(Constants.PARAM_EXPENSE_TARGET))
                .surplus(financeUtils.computeCurrentMonthSurplusAmount(year, month))
                .accumulated(financeUtils.getCurrentSurplus())
                .build();
    }

    @Override
    public ExtraPayDTO getExtraPay(int year, int month) {
        return financeUtils.getExtraPay(year, month);
    }

    @Override
    public void updateIncome(IncomeUpdateDTO incomeUpdateDTO) {
        financeUtils.updateIncome(incomeUpdateDTO);
    }
}

