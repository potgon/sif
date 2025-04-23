package dev.potgon.sif.mapper;

import dev.potgon.sif.dto.TransactionDTO;
import dev.potgon.sif.entity.Transaction;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionMapper {

    Transaction toEntity(TransactionDTO transactionDTO);
    TransactionDTO toDTO(Transaction transaction);
}
