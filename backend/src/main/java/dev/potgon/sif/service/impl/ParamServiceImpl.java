package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.ParamDTO;
import dev.potgon.sif.mapper.ParamMapper;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.service.ParamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParamServiceImpl implements ParamService {

    private final ParamRepository paramRepository;
    private final ParamMapper paramMapper;

    @Override
    public ParamDTO getParam(String name) {
        return paramMapper.toDTO(paramRepository.findByName(name));
    }
}
