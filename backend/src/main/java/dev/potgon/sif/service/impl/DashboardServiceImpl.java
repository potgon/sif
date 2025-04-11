package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.response.DashboardSummaryDTO;
import dev.potgon.sif.dto.response.MonthlyComparisonDTO;
import dev.potgon.sif.dto.response.TransactionResponseDTO;
import dev.potgon.sif.dto.response.YearlyOverviewDTO;
import dev.potgon.sif.entity.*;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.IncomeRepository;
import dev.potgon.sif.repository.MonthlySummaryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.DashboardService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserService userService;
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final MonthlySummaryRepository monthlySummaryRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardSummaryDTO getDashboardSummary() {
        User user = userService.getDefaultUser();
        
        // Get current month and year
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        
        // Calculate start and end dates for the current month
        LocalDate startDate = LocalDate.of(currentYear, currentMonth, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        // Get monthly summary if it exists
        Optional<MonthlySummary> monthlySummary = monthlySummaryRepository.findByUserAndYearAndMonth(user, currentYear, currentMonth);
        
        // Get total income for the current month
        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Get categories with their objective percentages
        List<Category> categories = categoryRepository.findByUserOrderByNameAsc(user);
        
        // Get transactions for the current month
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Get only the 5 most recent transactions
        List<Transaction> recentTransactions = transactions.stream()
                .limit(5)
                .toList();
        
        // Calculate expense and inversion totals
        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalInversion = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.INVERSION)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Calculate percentages
        BigDecimal expensePercentage = BigDecimal.ZERO;
        BigDecimal inversionPercentage = BigDecimal.ZERO;
        
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            expensePercentage = totalExpense.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
            
            inversionPercentage = totalInversion.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
        }
        
        // Get expense and inversion objectives
        BigDecimal expenseObjective = categories.stream()
                .filter(c -> c.getType() == CategoryType.EXPENSE)
                .map(Category::getObjectivePercentage)
                .findFirst()
                .orElse(BigDecimal.ZERO);
        
        BigDecimal inversionObjective = categories.stream()
                .filter(c -> c.getType() == CategoryType.INVERSION)
                .map(Category::getObjectivePercentage)
                .findFirst()
                .orElse(BigDecimal.ZERO);
        
        // Calculate surplus
        BigDecimal surplus = totalIncome.subtract(totalExpense).subtract(totalInversion);
        
        // Get accumulated from monthly summary or default to surplus
        BigDecimal accumulated = monthlySummary.map(MonthlySummary::getAccumulated).orElse(surplus);
        
        // Map recent transactions to DTOs
        List<TransactionResponseDTO> recentTransactionDTOs = recentTransactions.stream()
                .map(this::mapTransactionToDTO)
                .collect(Collectors.toList());
        
        return new DashboardSummaryDTO(
                totalIncome,
                expenseObjective,
                expensePercentage,
                inversionObjective,
                inversionPercentage,
                surplus,
                accumulated,
                recentTransactionDTOs
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<MonthlyComparisonDTO> getMonthlyComparison() {
        User user = userService.getDefaultUser();
        
        // Get the last 6 months of data
        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();
        
        List<MonthlyComparisonDTO> monthlyData = new ArrayList<>();
        
        // Loop through the last 6 months
        for (int i = 0; i < 6; i++) {
            int month = currentMonth - i;
            int year = currentYear;
            
            // Handle month rollover
            if (month <= 0) {
                month += 12;
                year -= 1;
            }
            
            // Get monthly summary
            Optional<MonthlySummary> summary = monthlySummaryRepository.findByUserAndYearAndMonth(user, year, month);
            
            // Get month name
            String monthName = LocalDate.of(year, month, 1)
                    .getMonth()
                    .getDisplayName(TextStyle.SHORT, Locale.getDefault());
            
            // If summary exists, use its data
            if (summary.isPresent()) {
                monthlyData.add(new MonthlyComparisonDTO(
                        monthName,
                        summary.get().getTotalExpense(),
                        summary.get().getTotalInversion()
                ));
            } else {
                // If no summary, calculate from transactions
                LocalDate startDate = LocalDate.of(year, month, 1);
                LocalDate endDate = startDate.plusMonths(1).minusDays(1);
                
                List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
                
                BigDecimal expenses = transactions.stream()
                        .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                BigDecimal inversions = transactions.stream()
                        .filter(t -> t.getCategory().getType() == CategoryType.INVERSION)
                        .map(Transaction::getAmount)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                
                monthlyData.add(new MonthlyComparisonDTO(
                        monthName,
                        expenses,
                        inversions
                ));
            }
        }
        
        // Reverse the list to get chronological order
        List<MonthlyComparisonDTO> result = new ArrayList<>(monthlyData);
        java.util.Collections.reverse(result);
        
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public YearlyOverviewDTO getYearlyOverview(Integer year) {
        User user = userService.getDefaultUser();
        
        // Get all monthly summaries for the year
        List<MonthlySummary> summaries = monthlySummaryRepository.findByUserAndYearOrderByMonthAsc(user, year);
        
        // If no summaries, return empty data
        if (summaries.isEmpty()) {
            return new YearlyOverviewDTO(
                    year,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    new ArrayList<>()
            );
        }
        
        // Calculate yearly totals
        BigDecimal totalIncome = summaries.stream()
                .map(MonthlySummary::getTotalIncome)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpense = summaries.stream()
                .map(MonthlySummary::getTotalExpense)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalInversion = summaries.stream()
                .map(MonthlySummary::getTotalInversion)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Format monthly data
        List<YearlyOverviewDTO.MonthlyDataDTO> monthlyData = summaries.stream()
                .map(s -> {
                    String monthName = LocalDate.of(year, s.getMonth(), 1)
                            .getMonth()
                            .getDisplayName(TextStyle.SHORT, Locale.getDefault());
                    
                    return new YearlyOverviewDTO.MonthlyDataDTO(
                            s.getMonth(),
                            monthName,
                            s.getTotalIncome(),
                            s.getTotalExpense(),
                            s.getTotalInversion(),
                            s.getSurplus(),
                            s.getAccumulated()
                    );
                })
                .collect(Collectors.toList());
        
        return new YearlyOverviewDTO(
                year,
                totalIncome,
                totalExpense,
                totalInversion,
                monthlyData
        );
    }
    
    private TransactionResponseDTO mapTransactionToDTO(Transaction transaction) {
        TransactionResponseDTO dto = new TransactionResponseDTO();
        dto.setId(transaction.getId());
        dto.setCategoryId(transaction.getCategory().getId());
        dto.setCategoryName(transaction.getCategory().getName());
        dto.setCategoryType(transaction.getCategory().getType());
        
        if (transaction.getSubcategory() != null) {
            dto.setSubcategoryId(transaction.getSubcategory().getId());
            dto.setSubcategoryName(transaction.getSubcategory().getName());
        }
        
        dto.setAmount(transaction.getAmount());
        dto.setCurrency(transaction.getCurrency());
        dto.setDate(transaction.getDate());
        dto.setDescription(transaction.getDescription());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());
        
        return dto;
    }
}
