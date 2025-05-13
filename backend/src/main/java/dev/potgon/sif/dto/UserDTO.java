package dev.potgon.sif.dto;

import lombok.*;

import java.time.ZonedDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String username;
    private String name;
    private String surname;
    private String password;
    private String email;
    private ZonedDateTime createdAt;
}
