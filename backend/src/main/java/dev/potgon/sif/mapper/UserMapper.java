package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.shared.UserDTO;
import dev.potgon.sif.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    User toEntity(UserDTO dto);
    UserDTO toDTO(User user);
}
