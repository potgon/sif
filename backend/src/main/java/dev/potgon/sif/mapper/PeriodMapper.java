package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.shared.PeriodDTO;
import dev.potgon.sif.entity.Period;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PeriodMapper {
    Period toEntity(PeriodDTO periodDTO);
    PeriodDTO toDTO(Period period);
}
