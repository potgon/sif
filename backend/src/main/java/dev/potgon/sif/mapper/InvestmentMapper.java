package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.request.InvestmentCreateDTO;
import dev.potgon.sif.dto.response.InvestmentDTO;
import dev.potgon.sif.entity.Investment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface InvestmentMapper {
    InvestmentMapper INSTANCE = Mappers.getMapper(InvestmentMapper.class);

    Investment toEntity(InvestmentCreateDTO dto);

    @Mapping(target = "assetName", source = "asset.name")
    InvestmentDTO toDTO(Investment entity);
}
