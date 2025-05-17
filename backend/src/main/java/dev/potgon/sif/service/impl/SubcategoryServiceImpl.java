package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.mapper.SubcategoryMapper;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.service.SubcategoryService;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubcategoryServiceImpl implements SubcategoryService {

    private final FinanceUtils financeUtils;
    private final SubcategoryRepository subcategoryRepo;
    private final SubcategoryMapper subcategoryMapper;

    @Override
    public List<SubcategoryDTO> fetchAllSubcategoriesByUser() {
        User user = financeUtils.getUserEntity();
        return subcategoryRepo.findAllByUser(user).stream().map(subcategoryMapper::toDTO).collect(Collectors.toList());
    }
}
