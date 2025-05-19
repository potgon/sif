package dev.potgon.sif.dto.shared;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeriodDTO {
    private Long id;
    private Integer year;
    private Integer month;
    private BigDecimal extraPay;
    private UserDTO user;
}
