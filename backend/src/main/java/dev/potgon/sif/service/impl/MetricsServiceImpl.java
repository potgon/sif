package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.TransactionTypeEnum;
import dev.potgon.sif.dto.response.MonthlyMetricsDTO;
import dev.potgon.sif.entity.Month;
import dev.potgon.sif.repository.MonthRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.MetricsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MetricsServiceImpl implements MetricsService {
    private final TransactionRepository transactionRepo;
    private final MonthRepository monthRepo;

    @Override
    public MonthlyMetricsDTO getMonthlyMetrics(int year, int month) {
        BigDecimal income = transactionRepo.sumByTypeAndMonth(TransactionTypeEnum.INCOME, year, month);
        BigDecimal expense = transactionRepo.sumByTypeAndMonth(TransactionTypeEnum.EXPENSE, year, month);

        // Previous month logic
        LocalDate selected = LocalDate.of(year, month, 1);
        LocalDate prev = selected.minusMonths(1);

        BigDecimal prevIncome = transactionRepo.sumByTypeAndMonth(TransactionTypeEnum.INCOME, prev.getYear(), prev.getMonthValue());
        BigDecimal prevExpense = transactionRepo.sumByTypeAndMonth(TransactionTypeEnum.EXPENSE, prev.getYear(), prev.getMonthValue());

        Month monthEntity = monthRepo.findByYearAndMonth(year, month).orElse(null);

        return MonthlyMetricsDTO.builder()
                .year(year)
                .month(month)
                .totalIncome(income)
                .totalExpenses(expense)
                .expenseTarget(monthEntity != null ? monthEntity.getExpenseTarget() : null)
                .prevMonthIncome(prevIncome)
                .prevMonthExpenses(prevExpense)
                .build();
    }
}

