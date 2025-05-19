package dev.potgon.sif.utils;

import dev.potgon.sif.dto.CategoryTypeEnum;
import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.entity.Category;
import dev.potgon.sif.entity.Period;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.mapper.*;
import dev.potgon.sif.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceUtils {

    private final AuthUtils authUtils;
    private final TransactionRepository transactionRepo;
    private final PeriodRepository periodRepo;
    private final CategoryRepository categoryRepo;
    private final TransactionMapper transactionMapper;

    public Period getPeriodIfExists(int year, int month) {
        Period period = periodRepo.findByYearAndMonthAndUser(year, month, authUtils.getUserEntity());
        if (period == null) {
            throw new ResourceNotFoundException("Period", "Year | Month", String.format("%d | %d", year, month));
        }
        return period;
    }

    public List<TransactionDTO> getTransactionsByPeriodAndCategory(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriodAndCategoryAndUserOrderByDateDesc(period, category, authUtils.getUserEntity())
                .stream().map(transactionMapper::toDTO).toList();
    }

}
