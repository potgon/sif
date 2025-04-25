package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.response.AnnualExpensesDTO;
import dev.potgon.sif.dto.response.MonthlyMetricsDTO;
import dev.potgon.sif.dto.response.MonthlyTargetDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsDTO;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.mapper.TransactionMapper;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.PeriodRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MetricsServiceImpl implements MetricsService {
    private final TransactionRepository transactionRepo;
    private final PeriodRepository periodRepo;
    private final CategoryRepository categoryRepo;

    private final TransactionMapper transactionMapper;

    @Override
    public MonthlyMetricsDTO getMonthlyMetrics(int year, int month) {

        Period period = periodRepo.findByYearAndMonth(year, month);

        BigDecimal incomeSum = sumAllTransactions(
                getTransactionsByPeriod(year, month, CategoryTypeEnum.INCOME)
        );
        BigDecimal expenseSum = sumAllTransactions(
                getTransactionsByPeriod(year, month, CategoryTypeEnum.EXPENSE)
        );
        BigDecimal previousMonthIncomeSum = sumAllTransactions(
                getPreviousMonthTransactions(year, month, CategoryTypeEnum.INCOME)
        );
        BigDecimal previousMonthExpenseSum = sumAllTransactions(
                getPreviousMonthTransactions(year, month, CategoryTypeEnum.EXPENSE)
        );

        return MonthlyMetricsDTO.builder()
                .periodId(period.getId())
                .year(year)
                .month(month)
                .totalIncome(BigDecimal.valueOf(1418.98))
                .totalExpenses(BigDecimal.valueOf(13.00))
                .expenseTarget(period.getExpenseTarget())
                .prevMonthIncomeDiff(
                        computePercentageDifference(
                                BigDecimal.valueOf(1418.98), BigDecimal.valueOf(1413.00))
                )
                .prevMonthExpensesDiff(
                        computePercentageDifference(BigDecimal.valueOf(13.00), BigDecimal.valueOf(30.00))
                )
                .build();
    }

    @Override
    public AnnualExpensesDTO getAnnualExpenses(int year) {
        BigDecimal[] transactionSumPerMonth = new BigDecimal[12];
        for (int i = 0; i<=11; i++) {
            transactionSumPerMonth[i] = sumAllTransactions(getTransactionsByPeriod(year, i + 1, CategoryTypeEnum.EXPENSE))
                    .setScale(0, RoundingMode.HALF_UP);
        }
        return AnnualExpensesDTO.builder()
                .year(year)
                .totalExpenses(new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.valueOf(50), BigDecimal.valueOf(13)})
                .build();
    }

    @Override
    public MonthlyTransactionsDTO getMonthlyTransactions(int year, int month) {
        List<TransactionDTO> transactions = getTransactionsByPeriod(year, month, CategoryTypeEnum.EXPENSE);
        return MonthlyTransactionsDTO.builder()
                .year(year)
                .month(month)
                .transactions(transactions)
                .build();
    }

    @Override
    public MonthlyTargetDTO getMonthlyTarget(int year, int month) {
        Period period = periodRepo.findByYearAndMonth(year, month);
        return MonthlyTargetDTO.builder()

                .build();
    }

    private List<TransactionDTO> getTransactionsByPeriod(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = periodRepo.findByYearAndMonth(year, month);

        return transactionRepo.findAllByPeriodAndCategoryOrderByDateDesc(period, category)
                .stream().map(transactionMapper::toDTO).toList();
    }

    private List<TransactionDTO> getPreviousMonthTransactions(int year, int month, CategoryTypeEnum category) {
        if (month == 12) return getTransactionsByPeriod(year, 1, category);
        return getTransactionsByPeriod(year, (month - 1), category);
    }

    private BigDecimal sumAllTransactions(List<TransactionDTO> transactions) {
        return transactions.stream()
                .map(TransactionDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal computePercentageDifference(BigDecimal current, BigDecimal previous) {
        if (previous == null) return null;
        if (current == null) current = BigDecimal.ZERO;
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}

