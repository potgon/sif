package dev.potgon.sif.utils;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.mapper.TransactionMapper;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.repository.PeriodRepository;
import dev.potgon.sif.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceUtils {

    private final TransactionRepository transactionRepo;
    private final PeriodRepository periodRepo;
    private final CategoryRepository categoryRepo;
    private final ParamRepository paramRepo;

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

    public List<TransactionDTO> getTransactionsByPeriod(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriodAndCategoryOrderByDateDesc(period, category)
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

    public BigDecimal getBigDecimalParam(String value) {
        BigDecimal result;
        try {
            result = BigDecimal.valueOf(Double.parseDouble(value));
        } catch (NumberFormatException e) {
            log.error("Error while parsing parameter: {} | Not a BigDecimal", value);
            throw new BusinessException("Error parsing parameter: " + value);
        }
        return result;
    }

    public BigDecimal getSummedIncomeAmount(int year, int month) {
        BigDecimal salary = getBigDecimalParam(Constants.PARAM_SALARY_NAME);
        Optional<BigDecimal> extraPay = getPeriodExtraPayIfExists(year, month);
        return extraPay.map(bigDecimal -> bigDecimal.add(salary)).orElse(salary);
    }

    public int getPreviousMonth(int month) {
        if (month == 12) return 1;
        return month - 1;
    }
}
