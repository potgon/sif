package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.ParamDTO;
import dev.potgon.sif.entity.Param;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ParamMapper {
    Param toEntity(ParamDTO paramDTO);

    ParamDTO toDTO(Param param);
}
