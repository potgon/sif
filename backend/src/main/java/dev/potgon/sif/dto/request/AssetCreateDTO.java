package dev.potgon.sif.dto.request;

import dev.potgon.sif.entity.Asset;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetCreateDTO {
    @NotBlank(message = "Asset name is required")
    private String name;

    private String isin;

    private String symbol;

    @NotNull(message = "Asset type is required")
    private Asset.AssetType assetType;

    @NotBlank(message = "Currency is required")
    private String currency;
}
