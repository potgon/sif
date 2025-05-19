package dev.potgon.sif.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncomeUpdateDTO {
    private int year;
    private int month;
    private BigDecimal extraPay;
    private String salary;
}
