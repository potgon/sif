package dev.potgon.sif.service;

import dev.potgon.sif.dto.request.AssetCreateDTO;
import dev.potgon.sif.dto.request.AssetValueUpdateDTO;
import dev.potgon.sif.dto.request.InvestmentCreateDTO;
import dev.potgon.sif.dto.response.AssetDTO;
import dev.potgon.sif.dto.response.AssetValueDTO;
import dev.potgon.sif.dto.response.InvestmentDTO;
import dev.potgon.sif.dto.response.InvestmentSummaryDTO;

import java.util.List;

public interface InvestmentService {
    // Asset operations
    AssetDTO createAsset(AssetCreateDTO assetCreateDTO);
    List<AssetDTO> getAllAssets();
    AssetDTO getAssetById(Long id);
    AssetDTO updateAsset(Long id, AssetCreateDTO assetCreateDTO);
    void deleteAsset(Long id);
    
    // Investment operations
    InvestmentDTO createInvestment(InvestmentCreateDTO investmentCreateDTO);
    List<InvestmentDTO> getInvestmentsByAsset(Long assetId);
    List<InvestmentDTO> getAllInvestments();
    InvestmentDTO updateInvestment(Long id, InvestmentCreateDTO investmentCreateDTO);
    void deleteInvestment(Long id);
    
    // Asset value operations
    AssetValueDTO updateAssetValue(AssetValueUpdateDTO assetValueUpdateDTO);
    List<AssetValueDTO> getAssetValueHistory(Long assetId);
    AssetValueDTO getCurrentAssetValue(Long assetId);
    
    // Summary and analytics
    InvestmentSummaryDTO getInvestmentSummary();
    List<AssetDTO> getAssetsWithCalculatedFields();
}
