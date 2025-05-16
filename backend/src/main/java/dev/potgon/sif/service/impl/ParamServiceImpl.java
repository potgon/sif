package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.ParamDTO;
import dev.potgon.sif.mapper.ParamMapper;
import dev.potgon.sif.mapper.UserMapper;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.service.ParamService;
import dev.potgon.sif.utils.Constants;
import dev.potgon.sif.utils.FinanceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParamServiceImpl implements ParamService {

    private final ParamRepository paramRepository;
    private final ParamMapper paramMapper;
    private final FinanceUtils financeUtils;
    private final UserMapper userMapper;

    @Override
    public ParamDTO getParam(String name) {
        return paramMapper.toDTO(paramRepository.findByNameAndUser(name, financeUtils.getUserEntity()));
    }

    @Override
    public ParamDTO updateParam(String value) {
        return paramMapper.toDTO(
                paramRepository.save(
                        paramMapper.toEntity(
                                ParamDTO.builder()
                                        .name(Constants.PARAM_EXPENSE_TARGET)
                                        .value(value)
                                        .createdAt(LocalDateTime.now())
                                        .user(
                                                userMapper.toDTO(
                                                        financeUtils.getUserEntity()))
                                        .build())
                ));
    }
}
