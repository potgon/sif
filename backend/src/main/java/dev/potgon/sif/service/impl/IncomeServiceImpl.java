package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.IncomeDTO;
import dev.potgon.sif.entity.Income;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.repository.IncomeRepository;
import dev.potgon.sif.service.IncomeService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final UserService userService;
    
    @Override
    @Transactional(readOnly = true)
    public List<IncomeDTO> getAllIncomes() {
        User user = userService.getDefaultUser();
        return incomeRepository.findByUserOrderByDateDesc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public IncomeDTO getIncomeById(Long id) {
        User user = userService.getDefaultUser();
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Income not found"));
        return mapToDTO(income);
    }
    
    @Override
    @Transactional
    public IncomeDTO createIncome(IncomeDTO incomeDTO) {
        User user = userService.getDefaultUser();
        Income income = mapToEntity(incomeDTO);
        income.setUser(user);
        Income savedIncome = incomeRepository.save(income);
        return mapToDTO(savedIncome);
    }
    
    @Override
    @Transactional
    public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
        User user = userService.getDefaultUser();
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Income not found"));
        
        income.setAmount(incomeDTO.getAmount());
        income.setCurrency(incomeDTO.getCurrency());
        income.setDate(incomeDTO.getDate());
        income.setSource(incomeDTO.getSource());
        income.setDescription(incomeDTO.getDescription());
        
        Income updatedIncome = incomeRepository.save(income);
        return mapToDTO(updatedIncome);
    }
    
    @Override
    @Transactional
    public void deleteIncome(Long id) {
        User user = userService.getDefaultUser();
        Income income = incomeRepository.findById(id)
                .filter(i -> i.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new RuntimeException("Income not found"));
        
        incomeRepository.delete(income);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getMonthlyIncomes(Integer year, Integer month) {
        User user = userService.getDefaultUser();
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<Income> incomes = incomeRepository.findByUserAndDateBetweenOrderByDateDesc(user, startDate, endDate);
        
        BigDecimal totalIncome = incomes.stream()
                .map(Income::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> result = new HashMap<>();
        result.put("incomes", incomes.stream().map(this::mapToDTO).collect(Collectors.toList()));
        result.put("totalIncome", totalIncome);
        result.put("month", month);
        result.put("year", year);
        
        return result;
    }
    
    private IncomeDTO mapToDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setCurrency(income.getCurrency());
        dto.setDate(income.getDate());
        dto.setSource(income.getSource());
        dto.setDescription(income.getDescription());
        return dto;
    }
    
    private Income mapToEntity(IncomeDTO dto) {
        Income income = new Income();
        income.setAmount(dto.getAmount());
        income.setCurrency(dto.getCurrency());
        income.setDate(dto.getDate());
        income.setSource(dto.getSource());
        income.setDescription(dto.getDescription());
        return income;
    }
}
