package dev.potgon.sif.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParamDTO {

    private Long id;
    private String name;
    private String value;
    private LocalDateTime createdAt;
    private UserDTO user;
}
