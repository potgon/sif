package dev.potgon.sif.service;

import dev.potgon.sif.dto.IncomeDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface IncomeService {
    List<IncomeDTO> getAllIncomes();
    IncomeDTO getIncomeById(Long id);
    IncomeDTO createIncome(IncomeDTO incomeDTO);
    IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO);
    void deleteIncome(Long id);
    Map<String, Object> getMonthlyIncomes(Integer year, Integer month);
}
