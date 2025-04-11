package dev.potgon.sif.service;

import dev.potgon.sif.dto.DebtDTO;

import java.util.List;

public interface DebtService {
    List<DebtDTO> getAllDebts();
    DebtDTO getDebtById(Long id);
    DebtDTO createDebt(DebtDTO debtDTO);
    DebtDTO updateDebt(Long id, DebtDTO debtDTO);
    void deleteDebt(Long id);
    DebtDTO markAsPaid(Long id);
}
