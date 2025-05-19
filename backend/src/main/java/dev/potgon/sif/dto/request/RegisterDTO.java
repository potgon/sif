package dev.potgon.sif.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDTO {
    private String name;
    private String surname;
    private String email;
    private String password;
}
