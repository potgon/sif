package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.MonthlySummaryDTO;
import dev.potgon.sif.entity.*;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.repository.IncomeRepository;
import dev.potgon.sif.repository.MonthlySummaryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.MonthlySummaryService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonthlySummaryServiceImpl implements MonthlySummaryService {

    private final MonthlySummaryRepository monthlySummaryRepository;
    private final IncomeRepository incomeRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<MonthlySummaryDTO> getAllMonthlySummaries() {
        User user = userService.getDefaultUser();
        return monthlySummaryRepository.findByUserOrderByYearDescMonthDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlySummaryDTO getMonthlySummaryByMonth(Integer year, Integer month) {
        User user = userService.getDefaultUser();
        
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        MonthlySummary summary = monthlySummaryRepository.findByUserAndYearAndMonth(user, year, month)
                .orElseThrow(() -> new ResourceNotFoundException("Monthly summary", "year/month", year + "/" + month));
        
        return mapToDTO(summary);
    }

    @Override
    @Transactional
    public MonthlySummaryDTO createMonthlySummary(MonthlySummaryDTO monthlySummaryDTO) {
        User user = userService.getDefaultUser();
        
        if (monthlySummaryDTO.getMonth() < 1 ||monthlySummaryDTO.getMonth() > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        // Check if summary for this month already exists
        if (monthlySummaryRepository.findByUserAndYearAndMonth(user, monthlySummaryDTO.getYear(), monthlySummaryDTO.getMonth()).isPresent()) {
            throw new IllegalArgumentException("Monthly summary for this month already exists");
        }

        MonthlySummary summary = getMonthlySummary(monthlySummaryDTO, user);

        MonthlySummary savedSummary = monthlySummaryRepository.save(summary);
        return mapToDTO(savedSummary);
    }

    private static MonthlySummary getMonthlySummary(MonthlySummaryDTO monthlySummaryDTO, User user) {
        MonthlySummary summary = new MonthlySummary();
        summary.setUser(user);
        summary.setMonth(monthlySummaryDTO.getMonth());
        summary.setYear(monthlySummaryDTO.getYear());
        summary.setTotalIncome(monthlySummaryDTO.getTotalIncome());
        summary.setTotalExpense(monthlySummaryDTO.getTotalExpense());
        summary.setTotalInversion(monthlySummaryDTO.getTotalInversion());
        summary.setExpensePercentage(monthlySummaryDTO.getExpensePercentage());
        summary.setInversionPercentage(monthlySummaryDTO.getInversionPercentage());
        summary.setSurplus(monthlySummaryDTO.getSurplus());
        summary.setAccumulated(monthlySummaryDTO.getAccumulated());
        summary.setLastRevision(monthlySummaryDTO.getLastRevision());
        return summary;
    }

    @Override
    @Transactional
    public MonthlySummaryDTO updateMonthlySummary(Integer year, Integer month, MonthlySummaryDTO monthlySummaryDTO) {
        User user = userService.getDefaultUser();
        
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        MonthlySummary summary = monthlySummaryRepository.findByUserAndYearAndMonth(user, year, month)
                .orElseThrow(() -> new ResourceNotFoundException("Monthly summary", "year/month", year + "/" + month));
        
        // If month or year is changing, check for conflicts
        if (!summary.getMonth().equals(monthlySummaryDTO.getMonth()) || !summary.getYear().equals(monthlySummaryDTO.getYear())) {
            if (monthlySummaryRepository.findByUserAndYearAndMonth(user, monthlySummaryDTO.getYear(), monthlySummaryDTO.getMonth()).isPresent()) {
                throw new IllegalArgumentException("Monthly summary for the target month already exists");
            }
        }
        
        summary.setMonth(monthlySummaryDTO.getMonth());
        summary.setYear(monthlySummaryDTO.getYear());
        summary.setTotalIncome(monthlySummaryDTO.getTotalIncome());
        summary.setTotalExpense(monthlySummaryDTO.getTotalExpense());
        summary.setTotalInversion(monthlySummaryDTO.getTotalInversion());
        summary.setExpensePercentage(monthlySummaryDTO.getExpensePercentage());
        summary.setInversionPercentage(monthlySummaryDTO.getInversionPercentage());
        summary.setSurplus(monthlySummaryDTO.getSurplus());
        summary.setAccumulated(monthlySummaryDTO.getAccumulated());
        summary.setLastRevision(monthlySummaryDTO.getLastRevision());
        
        MonthlySummary updatedSummary = monthlySummaryRepository.save(summary);
        return mapToDTO(updatedSummary);
    }

    @Override
    @Transactional
    public MonthlySummaryDTO calculateMonthlySummary(Integer year, Integer month) {
        User user = userService.getDefaultUser();
        
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        // Calculate start and end dates for the month
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        // Get all incomes for the month
        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Get all transactions for the month
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        // Calculate totals
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
        
        // Calculate percentages
        BigDecimal expensePercentage = BigDecimal.ZERO;
        BigDecimal inversionPercentage = BigDecimal.ZERO;
        
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            expensePercentage = totalExpense.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
            
            inversionPercentage = totalInversion.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 2, RoundingMode.HALF_UP);
        }
        
        // Calculate surplus
        BigDecimal surplus = totalIncome.subtract(totalExpense).subtract(totalInversion);
        
        // Get previous month's summary to calculate accumulated
        BigDecimal accumulated = surplus;
        
        // If it's January, look for December of previous year
        int prevMonth = month == 1 ? 12 : month - 1;
        int prevYear = month == 1 ? year - 1 : year;
        
        Optional<MonthlySummary> prevSummary = monthlySummaryRepository.findByUserAndYearAndMonth(user, prevYear, prevMonth);
        
        if (prevSummary.isPresent()) {
            accumulated = accumulated.add(prevSummary.get().getAccumulated());
        }
        
        // Check if summary for this month already exists
        MonthlySummary summary;
        Optional<MonthlySummary> existingSummary = monthlySummaryRepository.findByUserAndYearAndMonth(user, year, month);
        
        if (existingSummary.isPresent()) {
            summary = existingSummary.get();
        } else {
            summary = new MonthlySummary();
            summary.setUser(user);
            summary.setMonth(month);
            summary.setYear(year);
        }
        summary.setTotalIncome(totalIncome);
        summary.setTotalExpense(totalExpense);
        summary.setTotalInversion(totalInversion);
        summary.setExpensePercentage(expensePercentage);
        summary.setInversionPercentage(inversionPercentage);
        summary.setSurplus(surplus);
        summary.setAccumulated(accumulated);
        summary.setLastRevision(LocalDateTime.now());

        MonthlySummary savedSummary = monthlySummaryRepository.save(summary);
        return mapToDTO(savedSummary);
    }
    
    private MonthlySummaryDTO mapToDTO(MonthlySummary summary) {
        MonthlySummaryDTO dto = new MonthlySummaryDTO();
        dto.setId(summary.getId());
        dto.setMonth(summary.getMonth());
        dto.setYear(summary.getYear());
        dto.setTotalIncome(summary.getTotalIncome());
        dto.setTotalExpense(summary.getTotalExpense());
        dto.setTotalInversion(summary.getTotalInversion());
        dto.setExpensePercentage(summary.getExpensePercentage());
        dto.setInversionPercentage(summary.getInversionPercentage());
        dto.setSurplus(summary.getSurplus());
        dto.setAccumulated(summary.getAccumulated());
        dto.setLastRevision(summary.getLastRevision());
        return dto;
    }
}
