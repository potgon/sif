package dev.potgon.sif.utils;

import dev.potgon.sif.dto.*;
import dev.potgon.sif.dto.response.*;
import dev.potgon.sif.entity.*;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.mapper.*;
import dev.potgon.sif.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Year;
import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceUtils {

    private final TransactionRepository transactionRepo;
    private final PeriodRepository periodRepo;
    private final CategoryRepository categoryRepo;
    private final ParamRepository paramRepo;
    private final SubcategoryRepository subcategoryRepo;
    private final UserRepository userRepo;

    private final TransactionMapper transactionMapper;
    private final PeriodMapper periodMapper;
    private final CategoryMapper categoryMapper;
    private final SubcategoryMapper subcategoryMapper;
    private final ParamMapper paramMapper;

    public Period getPeriodIfExists(int year, int month) {
        Period period = periodRepo.findByYearAndMonthAndUser(year, month, getUserEntity());
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

    public TransactionDTO getTransactionByIdIfExists(Long id) {
        Optional<Transaction> tx = transactionRepo.findById(id);
        if (tx.isEmpty()) {
            log.info("Transaction with id {} not found", id);
            return null;
        }
        return transactionMapper.toDTO(tx.get());
    }

    public List<TransactionDTO> getTransactionsByPeriodAndCategory(int year, int month, CategoryTypeEnum categoryType) {
        Category category = categoryRepo.findByName(categoryType);
        Period period = getPeriodIfExists(year, month);

        return transactionRepo.findAllByPeriodAndCategoryAndUserOrderByDateDesc(period, category, getUserEntity())
                .stream().map(transactionMapper::toDTO).toList();
    }

    public List<TransactionDTO> getTransactionsByPeriodAndSubcategory(int year, int month, String subcategory) {
        Period period = getPeriodIfExists(year, month);
        Subcategory subcategoryEntity = subcategoryRepo.findByNameAndUser(subcategory, getUserEntity());
        User user = getUserEntity();
        return transactionRepo.findAllByPeriodAndSubcategoryAndUser(period, subcategoryEntity, user)
                .stream().map(transactionMapper::toDTO).toList();
    }

    public BigDecimal sumAllTransactions(List<TransactionDTO> transactions) {
        return transactions.stream()
                .map(TransactionDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal computePercentageDifference(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.equals(BigDecimal.ZERO)) return null;
        if (current == null) current = BigDecimal.ZERO;
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public BigDecimal getBigDecimalParam(String paramName) {
        BigDecimal result;
        try {
            String paramValue = paramRepo.findByNameAndUser(paramName, getUserEntity()).getValue();
            result = new BigDecimal(paramValue);
        } catch (NumberFormatException e) {
            log.error("Error while parsing parameter: {} | Not a BigDecimal", paramName);
            throw new BusinessException("Error parsing parameter: " + paramName);
        } catch (Exception ex) {
            throw new BusinessException("Error recovering parameter: " + paramName);
        }
        return result;
    }

    public BigDecimal getSummedIncomeAmount(int year, int month) {
        BigDecimal salary = getBigDecimalParam(Constants.PARAM_SALARY);
        Optional<BigDecimal> extraPay = getPeriodExtraPayIfExists(year, month);
        return extraPay.map(bigDecimal -> bigDecimal.add(salary)).orElse(salary);
    }

    public int getPreviousMonth(int month) {
        if (month == 12) return 1;
        return month - 1;
    }

    public BigDecimal computeExpenseTargetAmount(int year, int month) {
        BigDecimal income = getSummedIncomeAmount(year, month);
        BigDecimal expenseTargetPercentage = getBigDecimalParam(Constants.PARAM_EXPENSE_TARGET);

        return expenseTargetPercentage
                .divide(Constants.BIG_DECIMAL_ONE_HUNDRED, 4, RoundingMode.HALF_UP)
                .multiply(income)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal computeCurrentMonthExpenseTargetAsPercentage(int year, int month) {
        BigDecimal expenseTargetAmount = computeExpenseTargetAmount(year, month);

        if (expenseTargetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal actualExpense = sumAllTransactions(
                getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE)
        );

        return actualExpense
                .divide(expenseTargetAmount, 4, RoundingMode.HALF_UP)
                .multiply(Constants.BIG_DECIMAL_ONE_HUNDRED)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal computeCurrentMonthSurplusAmount(int year, int month) {
        BigDecimal targetAmount = computeExpenseTargetAmount(year, month);
        BigDecimal currentMonthExpenses = sumAllTransactions(getTransactionsByPeriodAndCategory(year, month, CategoryTypeEnum.EXPENSE));
        return targetAmount.subtract(currentMonthExpenses);
    }

    public BigDecimal getCurrentAccumulated() {
        Param accumulated = paramRepo.findByNameAndUser(Constants.PARAM_ACCUMULATED, getUserEntity());
        if (accumulated == null) return BigDecimal.ZERO;
        return new BigDecimal(accumulated.getValue());
    }

    public MonthlySubcategoryExpenseDTO computeSubcategoryExpenses(List<TransactionDTO> transactions) {
        Map<SubcategoryDTO, SubcategoryExpenseDTO> expenseMap = new HashMap<>();

        for (TransactionDTO tx : transactions) {
            SubcategoryDTO subDTO = tx.getSubcategory();
            SubcategoryExpenseDTO existing = expenseMap.get(subDTO);

            if (existing == null) {
                expenseMap.put(subDTO, SubcategoryExpenseDTO.builder()
                        .subcategory(subDTO)
                        .amount(tx.getAmount())
                        .isRecurrent(tx.getIsRecurring())
                        .build());
            } else {
                BigDecimal newAmount = existing.getAmount().add(tx.getAmount());
                expenseMap.put(subDTO, SubcategoryExpenseDTO.builder()
                        .subcategory(subDTO)
                        .amount(newAmount)
                        .isRecurrent(existing.isRecurrent())
                        .build());
            }
        }

        List<SubcategoryExpenseDTO> expenses = expenseMap.values().stream()
                .sorted(Comparator.comparing(dto -> dto.getSubcategory().getName()))
                .toList();

        return MonthlySubcategoryExpenseDTO.builder().subcategoryExpenses(expenses).build();
    }

    public TransactionDTO createTransaction(TransactionCreateDTO transactionReq) {
        PeriodDTO period = periodMapper.toDTO(getPeriodIfExists(transactionReq.getYear(), transactionReq.getMonth()));
        CategoryDTO category = categoryMapper.toDTO(categoryRepo.findByName(CategoryTypeEnum.EXPENSE));
        TransactionDTO transactionDTO = TransactionDTO.builder()
                .period(period)
                .date(transactionReq.getDate())
                .amount(transactionReq.getAmount())
                .description(transactionReq.getDescription())
                .category(category)
                .subcategory(transactionReq.getSubcategory())
                .isRecurring(transactionReq.getIsRecurring())
                .createdAt(ZonedDateTime.now())
                .build();
        Transaction savedEntity = transactionRepo.save(transactionMapper.toEntity(transactionDTO));
        updateAccumulated(transactionDTO.getAmount(), Operation.SUBTRACT);
        return transactionMapper.toDTO(savedEntity);
    }

    public TransactionDTO updateTransaction(TransactionUpdateDTO updateDTO) {
        Transaction tx = transactionMapper.toEntity(getTransactionByIdIfExists(updateDTO.getId()));
        if (updateDTO.getDate() != null) {
            tx.setDate(updateDTO.getDate());
        }
        if (updateDTO.getAmount() != null) {
            tx.setAmount(updateDTO.getAmount());
        }
        if (updateDTO.getDescription() != null) {
            tx.setDescription(updateDTO.getDescription());
        }
        if (updateDTO.getSubcategory() != null) {
            tx.setSubcategory(subcategoryMapper.toEntity(updateDTO.getSubcategory()));
        }
        if (updateDTO.getIsRecurring() != null) {
            tx.setIsRecurring(updateDTO.getIsRecurring());
        }
        if (updateDTO.getNotes() != null) {
            tx.setNotes(updateDTO.getNotes());
        }
        transactionRepo.save(tx);
        if (!tx.getAmount().equals(updateDTO.getAmount())) {
            BigDecimal difference = updateDTO.getAmount().subtract(tx.getAmount());
            updateAccumulated(difference, Operation.ADD);
        }
        return transactionMapper.toDTO(tx);
    }

    public TransactionDeleteDTO deleteTransaction(Long id) {
        Optional<Transaction> transaction = transactionRepo.findById(id);
        TransactionDeleteDTO response = TransactionDeleteDTO.builder().build();
        if (transaction.isPresent()) {
            transactionRepo.deleteById(id);
            response.setId(id);
            response.setResult(true);
            response.setMessage("Transacción borrada");
            updateAccumulated(transaction.get().getAmount(), Operation.ADD);
            return response;
        }
        response.setId(id);
        response.setResult(false);
        response.setMessage("No se ha podido borrar la transacción");
        return response;
    }

    public ExtraPayDTO getExtraPay(int year, int month) {
        PeriodDTO period = periodMapper.toDTO(periodRepo.findByYearAndMonthAndUser(year, month, getUserEntity()));
        return ExtraPayDTO.builder()
                .period(period)
                .extraPay(period.getExtraPay())
                .build();
    }

    public void updateIncome(IncomeUpdateDTO incomeUpdateDTO) {
        PeriodDTO period = periodMapper.toDTO(periodRepo.findByYearAndMonthAndUser(incomeUpdateDTO.getYear(), incomeUpdateDTO.getMonth(), getUserEntity()));
        ParamDTO salaryParam = paramMapper.toDTO(paramRepo.findByNameAndUser(Constants.PARAM_SALARY, getUserEntity()));
        BigDecimal salaryDTO = new BigDecimal(incomeUpdateDTO.getSalary());
        if (!salaryDTO.equals(BigDecimal.ZERO)) {
            salaryParam.setValue(incomeUpdateDTO.getSalary());
            salaryParam.setCreatedAt(LocalDateTime.now());
            paramRepo.save(paramMapper.toEntity(salaryParam));
        }
        if (incomeUpdateDTO.getExtraPay() != null && !incomeUpdateDTO.getExtraPay().equals(BigDecimal.ZERO)) {
            period.setExtraPay(incomeUpdateDTO.getExtraPay());
            periodRepo.save(periodMapper.toEntity(period));
        }
    }

    private void updateAccumulated(BigDecimal amount, Operation op) {
        ParamDTO surplusParam = paramMapper.toDTO(paramRepo.findByNameAndUser(Constants.PARAM_ACCUMULATED, getUserEntity()));
        BigDecimal surplusVal = new BigDecimal(surplusParam.getValue());
        BigDecimal newValue = (op == Operation.ADD)
                ? surplusVal.add(amount)
                : surplusVal.subtract(amount);

        surplusParam.setValue(newValue.toString());
        paramRepo.save(paramMapper.toEntity(surplusParam));
    }

    public User getUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    }

    public void createExpenseTarget(UserDTO user) {
        ParamDTO expenseTarget = ParamDTO.builder()
                .id(null)
                .name(Constants.PARAM_EXPENSE_TARGET)
                .value("0.0")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        paramRepo.save(paramMapper.toEntity(expenseTarget));
    }

    public void createSalary(UserDTO user) {
        ParamDTO salary = ParamDTO.builder()
                .id(null)
                .name(Constants.PARAM_SALARY)
                .value("0.0")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        paramRepo.save(paramMapper.toEntity(salary));
    }

    public void createAccumulated(UserDTO user) {
        ParamDTO salary = ParamDTO.builder()
                .id(null)
                .name(Constants.PARAM_ACCUMULATED)
                .value("0.0")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        paramRepo.save(paramMapper.toEntity(salary));
    }

    public void createPeriods(UserDTO user) {
        int currentYear = Year.now().getValue();

        for (int month = 1; month <= 12; month++) {
            PeriodDTO period = new PeriodDTO();
            period.setYear(currentYear);
            period.setMonth(month);
            period.setExtraPay(BigDecimal.ZERO);
            period.setUser(user);
            periodRepo.save(periodMapper.toEntity(period));
        }
    }
}
