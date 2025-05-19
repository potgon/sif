package dev.potgon.sif.dto.shared;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SubcategoryDTO {
    @EqualsAndHashCode.Include
    private Long id;
    private String name;
    private UserDTO user;
}
