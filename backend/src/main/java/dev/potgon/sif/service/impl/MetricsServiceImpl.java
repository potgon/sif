package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.service.MetricsService;
import dev.potgon.sif.utils.Constants;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MetricsServiceImpl implements MetricsService {
    private final FinanceUtils financeUtils;

    @Override
    public MonthlyMetricsDTO getMonthlyMetrics(int year, int month) {
        BigDecimal incomeSum = financeUtils.getSummedIncomeAmount(year, month);
        BigDecimal expenseSum = financeUtils.sumAllTransactions(
                financeUtils.getTransactionsByPeriod(year, month, CategoryTypeEnum.EXPENSE)
        );
        BigDecimal previousMonthIncomeSum = financeUtils.getSummedIncomeAmount(year, financeUtils.getPreviousMonth(month));
        BigDecimal previousMonthExpenseSum = financeUtils.sumAllTransactions(
                financeUtils.getTransactionsByPeriod(year, financeUtils.getPreviousMonth(month), CategoryTypeEnum.EXPENSE)
        );

        return MonthlyMetricsDTO.builder()
                .totalIncome(BigDecimal.valueOf(1418.98))
                .totalExpenses(BigDecimal.valueOf(13.00))
                .prevMonthIncomeDiff(
                        financeUtils.computePercentageDifference(
                                BigDecimal.valueOf(1418.98), BigDecimal.valueOf(1413.00))
                )
                .prevMonthExpensesDiff(
                        financeUtils.computePercentageDifference(BigDecimal.valueOf(13.00), BigDecimal.valueOf(30.00))
                )
                .build();
    }

    @Override
    public AnnualExpensesDTO getAnnualExpenses(int year) {
        BigDecimal[] transactionSumPerMonth = new BigDecimal[12];
        for (int i = 0; i <= 11; i++) {
            transactionSumPerMonth[i] = financeUtils.sumAllTransactions(financeUtils.getTransactionsByPeriod(year, i + 1, CategoryTypeEnum.EXPENSE))
                    .setScale(0, RoundingMode.HALF_UP);
        }
        return AnnualExpensesDTO.builder()
                .totalExpenses(new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.valueOf(50), BigDecimal.valueOf(13)})
                .build();
    }

    @Override
    public MonthlyTransactionsDTO getMonthlyTransactions(int year, int month) {
        List<TransactionDTO> transactions = financeUtils.getTransactionsByPeriod(year, month, CategoryTypeEnum.EXPENSE);
        return MonthlyTransactionsDTO.builder()
                .transactions(transactions)
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
    public MonthlyTransactionRowDTO getMonthlyTransactionRow(int year, int month) {
        List<TransactionDTO> transactions = financeUtils.getTransactionsByPeriod(year, month, CategoryTypeEnum.EXPENSE);
        return MonthlyTransactionRowDTO.builder()
                .transactions(financeUtils.buildTransactionRowDTO(transactions))
                .build();
    }
}

