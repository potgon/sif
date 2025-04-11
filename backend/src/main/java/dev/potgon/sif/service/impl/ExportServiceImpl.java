package dev.potgon.sif.service.impl;

import dev.potgon.sif.entity.*;
import dev.potgon.sif.repository.*;
import dev.potgon.sif.service.ExportService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final UserService userService;
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final TransactionRepository transactionRepository;
    private final MonthlySummaryRepository monthlySummaryRepository;
    private final DebtRepository debtRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> exportMonth(Integer year, Integer month) {
        User user = userService.getDefaultUser();
        
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        // Calculate start and end dates for the month
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        // Get monthly summary
        Optional<MonthlySummary> summary = monthlySummaryRepository.findByUserAndYearAndMonth(user, year, month);
        
        // Get incomes for the month
        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Get transactions for the month
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Get debts
        List<Debt> debts = debtRepository.findByUserOrderByIsPaidAscDueDateAsc(user);
        
        // Format the data for export
        Map<String, Object> exportData = new HashMap<>();
        exportData.put("month", month);
        exportData.put("year", year);
        exportData.put("summary", summary.orElse(null));
        exportData.put("incomes", incomes);
        exportData.put("transactions", transactions);
        exportData.put("debts", debts);
        exportData.put("exportDate", LocalDateTime.now());
        
        return exportData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> exportYear(Integer year) {
        User user = userService.getDefaultUser();
        
        // Get all monthly summaries for the year
        List<MonthlySummary> summaries = monthlySummaryRepository.findByUserAndYearOrderByMonthAsc(user, year);
        
        // Get all incomes for the year
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        
        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Get all transactions for the year
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Calculate yearly totals
        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalInversion = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.INVERSION)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Format the data for export
        Map<String, Object> exportData = new HashMap<>();
        exportData.put("year", year);
        exportData.put("summaries", summaries);
        exportData.put("totalIncome", totalIncome);
        exportData.put("totalExpense", totalExpense);
        exportData.put("totalInversion", totalInversion);
        exportData.put("incomes", incomes);
        exportData.put("transactions", transactions);
        exportData.put("exportDate", LocalDateTime.now());
        
        return exportData;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> exportAll() {
        User user = userService.getDefaultUser();
        
        // Get all data for the user
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("name", user.getName());
        userData.put("createdAt", user.getCreatedAt());
        userData.put("updatedAt", user.getUpdatedAt());
        
        List<Category> categories = categoryRepository.findByUserOrderByNameAsc(user);
        List<Subcategory> subcategories = subcategoryRepository.findByUserOrderByNameAsc(user);
        List<Income> incomes = incomeRepository.findByUserOrderByDateDesc(user);
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        List<MonthlySummary> monthlySummaries = monthlySummaryRepository.findByUserOrderByYearDescMonthDesc(user);
        List<Debt> debts = debtRepository.findByUserOrderByIsPaidAscDueDateAsc(user);
        
        // Format the data for export
        Map<String, Object> exportData = new HashMap<>();
        exportData.put("user", userData);
        exportData.put("categories", categories);
        exportData.put("subcategories", subcategories);
        exportData.put("incomes", incomes);
        exportData.put("transactions", transactions);
        exportData.put("monthlySummaries", monthlySummaries);
        exportData.put("debts", debts);
        exportData.put("exportDate", LocalDateTime.now());
        
        return exportData;
    }
}
