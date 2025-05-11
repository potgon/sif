package dev.potgon.sif.dto.response;

import dev.potgon.sif.dto.PeriodDTO;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtraPayDTO {
    private PeriodDTO period;
    private BigDecimal extraPay;
}
