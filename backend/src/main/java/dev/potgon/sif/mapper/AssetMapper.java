package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.request.AssetCreateDTO;
import dev.potgon.sif.dto.response.AssetDTO;
import dev.potgon.sif.entity.Asset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AssetMapper {
    AssetMapper INSTANCE = Mappers.getMapper(AssetMapper.class);

    Asset toEntity(AssetCreateDTO dto);

    @Mapping(target = "totalInvested", ignore = true)
    @Mapping(target = "currentValue", ignore = true)
    @Mapping(target = "netProfit", ignore = true)
    @Mapping(target = "profitability", ignore = true)
    @Mapping(target = "totalShares", ignore = true)
    @Mapping(target = "averagePrice", ignore = true)
    AssetDTO toDTO(Asset entity);
}
