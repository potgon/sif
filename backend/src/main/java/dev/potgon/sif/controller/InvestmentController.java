package dev.potgon.sif.controller;

import dev.potgon.sif.dto.request.AssetCreateDTO;
import dev.potgon.sif.dto.request.AssetValueUpdateDTO;
import dev.potgon.sif.dto.request.InvestmentCreateDTO;
import dev.potgon.sif.dto.response.AssetDTO;
import dev.potgon.sif.dto.response.AssetValueDTO;
import dev.potgon.sif.dto.response.InvestmentDTO;
import dev.potgon.sif.dto.response.InvestmentSummaryDTO;
import dev.potgon.sif.service.InvestmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private final InvestmentService investmentService;

    // Asset endpoints
    @PostMapping("/assets")
    public ResponseEntity<AssetDTO> createAsset(@Valid @RequestBody AssetCreateDTO assetCreateDTO) {
        AssetDTO asset = investmentService.createAsset(assetCreateDTO);
        return ResponseEntity.ok(asset);
    }

    @GetMapping("/assets")
    public ResponseEntity<List<AssetDTO>> getAllAssets() {
        List<AssetDTO> assets = investmentService.getAllAssets();
        return ResponseEntity.ok(assets);
    }

    @GetMapping("/assets/{id}")
    public ResponseEntity<AssetDTO> getAssetById(@PathVariable Long id) {
        AssetDTO asset = investmentService.getAssetById(id);
        return ResponseEntity.ok(asset);
    }

    @PutMapping("/assets/{id}")
    public ResponseEntity<AssetDTO> updateAsset(@PathVariable Long id, @Valid @RequestBody AssetCreateDTO assetCreateDTO) {
        AssetDTO asset = investmentService.updateAsset(id, assetCreateDTO);
        return ResponseEntity.ok(asset);
    }

    @DeleteMapping("/assets/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        investmentService.deleteAsset(id);
        return ResponseEntity.ok().build();
    }

    // Investment endpoints
    @PostMapping("/transactions")
    public ResponseEntity<InvestmentDTO> createInvestment(@Valid @RequestBody InvestmentCreateDTO investmentCreateDTO) {
        InvestmentDTO investment = investmentService.createInvestment(investmentCreateDTO);
        return ResponseEntity.ok(investment);
    }

    @GetMapping("/assets/{assetId}/transactions")
    public ResponseEntity<List<InvestmentDTO>> getInvestmentsByAsset(@PathVariable Long assetId) {
        List<InvestmentDTO> investments = investmentService.getInvestmentsByAsset(assetId);
        return ResponseEntity.ok(investments);
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<InvestmentDTO>> getAllInvestments() {
        List<InvestmentDTO> investments = investmentService.getAllInvestments();
        return ResponseEntity.ok(investments);
    }

    @PutMapping("/transactions/{id}")
    public ResponseEntity<InvestmentDTO> updateInvestment(@PathVariable Long id, @Valid @RequestBody InvestmentCreateDTO investmentCreateDTO) {
        InvestmentDTO investment = investmentService.updateInvestment(id, investmentCreateDTO);
        return ResponseEntity.ok(investment);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable Long id) {
        investmentService.deleteInvestment(id);
        return ResponseEntity.ok().build();
    }

    // Asset value endpoints
    @PostMapping("/assets/{assetId}/value")
    public ResponseEntity<AssetValueDTO> updateAssetValue(@PathVariable Long assetId, @Valid @RequestBody AssetValueUpdateDTO assetValueUpdateDTO) {
        assetValueUpdateDTO.setAssetId(assetId);
        AssetValueDTO value = investmentService.updateAssetValue(assetValueUpdateDTO);
        return ResponseEntity.ok(value);
    }

    @GetMapping("/assets/{assetId}/value/history")
    public ResponseEntity<List<AssetValueDTO>> getAssetValueHistory(@PathVariable Long assetId) {
        List<AssetValueDTO> history = investmentService.getAssetValueHistory(assetId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/assets/{assetId}/value/current")
    public ResponseEntity<AssetValueDTO> getCurrentAssetValue(@PathVariable Long assetId) {
        AssetValueDTO currentValue = investmentService.getCurrentAssetValue(assetId);
        return ResponseEntity.ok(currentValue);
    }

    // Summary and analytics
    @GetMapping("/summary")
    public ResponseEntity<InvestmentSummaryDTO> getInvestmentSummary() {
        InvestmentSummaryDTO summary = investmentService.getInvestmentSummary();
        return ResponseEntity.ok(summary);
    }
}
