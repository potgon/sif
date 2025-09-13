package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.request.AssetValueUpdateDTO;
import dev.potgon.sif.dto.response.AssetValueDTO;
import dev.potgon.sif.entity.AssetValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AssetValueMapper {
    AssetValueMapper INSTANCE = Mappers.getMapper(AssetValueMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "asset", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AssetValue toEntity(AssetValueUpdateDTO dto);

    @Mapping(target = "assetName", source = "asset.name")
    AssetValueDTO toDTO(AssetValue entity);
}
