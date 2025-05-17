package dev.potgon.sif.service;

import dev.potgon.sif.dto.ParamDTO;

import java.util.Map;

public interface ParamService {
    ParamDTO getParam(String name);
    ParamDTO updateParam(Map<String, String> paramMap);
}
