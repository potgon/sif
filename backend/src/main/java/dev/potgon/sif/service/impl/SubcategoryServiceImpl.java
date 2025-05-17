package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.SubcategoryDTO;
import dev.potgon.sif.dto.UserDTO;
import dev.potgon.sif.dto.response.DeleteDTO;
import dev.potgon.sif.entity.Subcategory;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.mapper.SubcategoryMapper;
import dev.potgon.sif.mapper.UserMapper;
import dev.potgon.sif.repository.SubcategoryRepository;
import dev.potgon.sif.service.SubcategoryService;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubcategoryServiceImpl implements SubcategoryService {

    private final FinanceUtils financeUtils;
    private final SubcategoryRepository subcategoryRepo;
    private final SubcategoryMapper subcategoryMapper;
    private final UserMapper userMapper;

    @Override
    public List<SubcategoryDTO> fetchAllSubcategoriesByUser() {
        User user = financeUtils.getUserEntity();
        return subcategoryRepo.findAllByUser(user).stream().map(subcategoryMapper::toDTO).collect(Collectors.toList());
    }

    @Override
    public SubcategoryDTO createSubcategory(String name) {
        Optional<Subcategory> subcategory = subcategoryRepo.findByNameAndUser(name, financeUtils.getUserEntity());
        if (subcategory.isPresent()) {
            return null;
        }
        UserDTO userDTO = userMapper.toDTO(financeUtils.getUserEntity());
        return subcategoryMapper.toDTO(
                subcategoryRepo.save(
                        subcategoryMapper.toEntity(
                                SubcategoryDTO.builder()
                                        .name(name)
                                        .user(userDTO)
                                        .build())
                )
        );
    }

    @Override
    public SubcategoryDTO updateSubcategory(SubcategoryDTO dto) {
        return subcategoryMapper.toDTO(
                subcategoryRepo.save(
                        subcategoryMapper.toEntity(dto)
                )
        );
    }

    @Override
    public DeleteDTO deleteSubcategory(Long id) {
        Optional<Subcategory> subcategory = subcategoryRepo.findById(id);
        DeleteDTO response = DeleteDTO.builder().build();
        if (subcategory.isPresent()) {
            subcategoryRepo.deleteById(id);
            response.setId(id);
            response.setResult(true);
            response.setMessage("Subcategoría borrada");
            return response;
        }
        response.setId(id);
        response.setResult(false);
        response.setMessage("No se ha podido borrar la subcategoría");
        return response;
    }
}
