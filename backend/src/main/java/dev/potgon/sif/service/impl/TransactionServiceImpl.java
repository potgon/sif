package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.dto.TransactionFilterDTO;
import dev.potgon.sif.dto.response.MonthlyTransactionsResponseDTO;
import dev.potgon.sif.dto.response.TransactionResponseDTO;
import dev.potgon.sif.entity.*;
import dev.potgon.sif.exception.ResourceNotFoundException;
import dev.potgon.sif.repository.CategoryRepository;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.repository.TransactionRepository;
import dev.potgon.sif.service.TransactionService;
import dev.potgon.sif.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final UserService userService;

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getAllTransactions() {
        User user = userService.getDefaultUser();
        return transactionRepository.findByUserOrderByDateDesc(user).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionResponseDTO getTransactionById(Long id) {
        User user = userService.getDefaultUser();
        Transaction transaction = transactionRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));
        return mapToResponseDTO(transaction);
    }

    @Override
    @Transactional
    public TransactionResponseDTO createTransaction(TransactionDTO transactionDTO) {
        User user = userService.getDefaultUser();
        
        Category category = categoryRepository.findByUserAndId(user, transactionDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", transactionDTO.getCategoryId()));
        
        Subcategory subcategory = null;
        if (transactionDTO.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findByUserAndId(user, transactionDTO.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory", "id", transactionDTO.getSubcategoryId()));
            
            // Verify subcategory belongs to the selected category
            if (!subcategory.getCategory().getId().equals(category.getId())) {
                throw new IllegalArgumentException("Subcategory does not belong to the selected category");
            }
        }
        
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setSubcategory(subcategory);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCurrency(transactionDTO.getCurrency());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());
        
        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToResponseDTO(savedTransaction);
    }

    @Override
    @Transactional
    public TransactionResponseDTO updateTransaction(Long id, TransactionDTO transactionDTO) {
        User user = userService.getDefaultUser();
        
        Transaction transaction = transactionRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));
        
        Category category = categoryRepository.findByUserAndId(user, transactionDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", transactionDTO.getCategoryId()));
        
        Subcategory subcategory = null;
        if (transactionDTO.getSubcategoryId() != null) {
            subcategory = subcategoryRepository.findByUserAndId(user, transactionDTO.getSubcategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subcategory", "id", transactionDTO.getSubcategoryId()));
            
            // Verify subcategory belongs to the selected category
            if (!subcategory.getCategory().getId().equals(category.getId())) {
                throw new IllegalArgumentException("Subcategory does not belong to the selected category");
            }
        }
        
        transaction.setCategory(category);
        transaction.setSubcategory(subcategory);
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setCurrency(transactionDTO.getCurrency());
        transaction.setDate(transactionDTO.getDate());
        transaction.setDescription(transactionDTO.getDescription());
        
        Transaction updatedTransaction = transactionRepository.save(transaction);
        return mapToResponseDTO(updatedTransaction);
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        User user = userService.getDefaultUser();
        
        Transaction transaction = transactionRepository.findByUserAndId(user, id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "id", id));
        
        transactionRepository.delete(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponseDTO> getFilteredTransactions(TransactionFilterDTO filterDTO) {
        User user = userService.getDefaultUser();
        
        List<Transaction> transactions = transactionRepository.findByFilters(
                user,
                filterDTO.getStartDate(),
                filterDTO.getEndDate(),
                filterDTO.getCategoryId(),
                filterDTO.getSubcategoryId(),
                filterDTO.getMinAmount(),
                filterDTO.getMaxAmount(),
                filterDTO.getDescription()
        );
        
        return transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MonthlyTransactionsResponseDTO getMonthlyTransactions(Integer year, Integer month) {
        User user = userService.getDefaultUser();
        
        if (month < 1 || month > 12) {
            throw new IllegalArgumentException("Month must be between 1 and 12");
        }
        
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);
        
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(
                user, startDate, endDate);
        
        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal totalInversion = transactions.stream()
                .filter(t -> t.getCategory().getType() == CategoryType.INVERSION)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<TransactionResponseDTO> transactionDTOs = transactions.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        
        return new MonthlyTransactionsResponseDTO(
                transactionDTOs,
                totalExpense,
                totalInversion,
                month,
                year
        );
    }
    
    private TransactionResponseDTO mapToResponseDTO(Transaction transaction) {
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
