package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.DebtDTO;
import dev.potgon.sif.entity.Debt;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.repository.DebtRepository;
import dev.potgon.sif.service.DebtService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DebtServiceImpl implements DebtService {

    private final DebtRepository debtRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<DebtDTO> getAllDebts() {
        User user = userService.getDefaultUser();
        return debtRepository.findByUserOrderByIsPaidAscDueDateAsc(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DebtDTO getDebtById(Long id) {
        User user = userService.getDefaultUser();
        Debt debt = debtRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "id", id));
        return mapToDTO(debt);
    }

    @Override
    @Transactional
    public DebtDTO createDebt(DebtDTO debtDTO) {
        User user = userService.getDefaultUser();
        
        Debt debt = new Debt();
        debt.setUser(user);
        debt.setAmount(debtDTO.getAmount());
        debt.setCurrency(debtDTO.getCurrency());
        debt.setIsOwedByUser(debtDTO.getIsOwedByUser());
        debt.setPersonName(debtDTO.getPersonName());
        debt.setDescription(debtDTO.getDescription());
        debt.setDueDate(debtDTO.getDueDate());
        debt.setIsPaid(debtDTO.getIsPaid());
        
        Debt savedDebt = debtRepository.save(debt);
        return mapToDTO(savedDebt);
    }

    @Override
    @Transactional
    public DebtDTO updateDebt(Long id, DebtDTO debtDTO) {
        User user = userService.getDefaultUser();
        
        Debt debt = debtRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "id", id));
        
        debt.setAmount(debtDTO.getAmount());
        debt.setCurrency(debtDTO.getCurrency());
        debt.setIsOwedByUser(debtDTO.getIsOwedByUser());
        debt.setPersonName(debtDTO.getPersonName());
        debt.setDescription(debtDTO.getDescription());
        debt.setDueDate(debtDTO.getDueDate());
        debt.setIsPaid(debtDTO.getIsPaid());
        
        Debt updatedDebt = debtRepository.save(debt);
        return mapToDTO(updatedDebt);
    }

    @Override
    @Transactional
    public void deleteDebt(Long id) {
        User user = userService.getDefaultUser();
        
        Debt debt = debtRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "id", id));
        
        debtRepository.delete(debt);
    }

    @Override
    @Transactional
    public DebtDTO markAsPaid(Long id) {
        User user = userService.getDefaultUser();
        
        Debt debt = debtRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "id", id));
        
        debt.setIsPaid(true);
        
        Debt updatedDebt = debtRepository.save(debt);
        return mapToDTO(updatedDebt);
    }
    
    private DebtDTO mapToDTO(Debt debt) {
        DebtDTO dto = new DebtDTO();
        dto.setId(debt.getId());
        dto.setAmount(debt.getAmount());
        dto.setCurrency(debt.getCurrency());
        dto.setIsOwedByUser(debt.getIsOwedByUser());
        dto.setPersonName(debt.getPersonName());
        dto.setDescription(debt.getDescription());
        dto.setDueDate(debt.getDueDate());
        dto.setIsPaid(debt.getIsPaid());
        return dto;
    }
}
