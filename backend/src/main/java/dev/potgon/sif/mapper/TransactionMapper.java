package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.shared.TransactionDTO;
import dev.potgon.sif.entity.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, SubcategoryMapper.class, PeriodMapper.class, UserMapper.class})
public interface TransactionMapper {

    @Mapping(source = "category", target = "category")
    @Mapping(source = "subcategory", target = "subcategory")
    @Mapping(source = "period", target = "period")
    @Mapping(source = "user", target = "user")
    Transaction toEntity(TransactionDTO transactionDTO);
    
    @Mapping(source = "category", target = "category")
    @Mapping(source = "subcategory", target = "subcategory")
    @Mapping(source = "period", target = "period")
    @Mapping(source = "user", target = "user")
    TransactionDTO toDTO(Transaction transaction);
}
