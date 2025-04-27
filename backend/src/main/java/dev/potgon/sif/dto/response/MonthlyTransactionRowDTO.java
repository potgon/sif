package dev.potgon.sif.dto.response;

import dev.potgon.sif.dto.TransactionRowDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyTransactionRowDTO {
    private List<TransactionRowDTO> transactions;
}
