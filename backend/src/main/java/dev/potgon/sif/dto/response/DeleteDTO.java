package dev.potgon.sif.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeleteDTO {
    private long id;
    private boolean result;
    private String message;
}
