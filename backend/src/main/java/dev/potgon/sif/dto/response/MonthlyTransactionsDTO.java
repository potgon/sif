package dev.potgon.sif.dto.response;

import dev.potgon.sif.dto.TransactionDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTransactionsDTO {
    int year;
    int month;
    List<TransactionDTO> transactions;
}
