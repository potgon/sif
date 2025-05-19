package dev.potgon.sif.dto.shared;

import lombok.*;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UserDTO {

    @EqualsAndHashCode.Include
    private Long id;
    private String name;
    private String surname;
    private String password;
    private String email;
    private ZonedDateTime createdAt;
}
