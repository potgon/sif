package dev.potgon.sif.service.impl;

import dev.potgon.sif.dto.request.AssetCreateDTO;
import dev.potgon.sif.dto.request.AssetValueUpdateDTO;
import dev.potgon.sif.dto.request.InvestmentCreateDTO;
import dev.potgon.sif.dto.response.AssetDTO;
import dev.potgon.sif.dto.response.AssetValueDTO;
import dev.potgon.sif.dto.response.InvestmentDTO;
import dev.potgon.sif.dto.response.InvestmentSummaryDTO;
import dev.potgon.sif.entity.Asset;
import dev.potgon.sif.entity.AssetValue;
import dev.potgon.sif.entity.Investment;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.exception.BusinessException;
import dev.potgon.sif.mapper.AssetMapper;
import dev.potgon.sif.mapper.AssetValueMapper;
import dev.potgon.sif.mapper.InvestmentMapper;
import dev.potgon.sif.repository.AssetRepository;
import dev.potgon.sif.repository.AssetValueRepository;
import dev.potgon.sif.repository.InvestmentRepository;
import dev.potgon.sif.service.InvestmentService;
import dev.potgon.sif.utils.AuthUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvestmentServiceImpl implements InvestmentService {

    private final AssetRepository assetRepository;
    private final InvestmentRepository investmentRepository;
    private final AssetValueRepository assetValueRepository;
    private final AssetMapper assetMapper = AssetMapper.INSTANCE;
    private final AssetValueMapper assetValueMapper = AssetValueMapper.INSTANCE;
    private final InvestmentMapper investmentMapper = InvestmentMapper.INSTANCE;
    private final AuthUtils authUtils;

    @Override
    public AssetDTO createAsset(AssetCreateDTO assetCreateDTO) {
        User currentUser = authUtils.getUserEntity();

        // Check if ISIN already exists for this user
        if (assetCreateDTO.getIsin() != null && !assetCreateDTO.getIsin().isEmpty()) {
            assetRepository.findByIsinAndUser(assetCreateDTO.getIsin(), currentUser)
                    .ifPresent(asset -> {
                        throw new BusinessException("Asset with ISIN " + assetCreateDTO.getIsin() + " already exists");
                    });
        }

        Asset asset = assetMapper.toEntity(assetCreateDTO);
        asset.setUser(currentUser);
        Asset savedAsset = assetRepository.save(asset);

        return calculateAssetFields(assetMapper.toDTO(savedAsset));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetDTO> getAllAssets() {
        User currentUser = authUtils.getUserEntity();
        List<Asset> assets = assetRepository.findByUserOrderByNameAsc(currentUser);

        return assets.stream()
                .map(assetMapper::toDTO)
                .map(this::calculateAssetFields)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetDTO getAssetById(Long id) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        return calculateAssetFields(assetMapper.toDTO(asset));
    }

    @Override
    public AssetDTO updateAsset(Long id, AssetCreateDTO assetCreateDTO) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        asset.setName(assetCreateDTO.getName());
        asset.setIsin(assetCreateDTO.getIsin());
        asset.setSymbol(assetCreateDTO.getSymbol());
        asset.setAssetType(assetCreateDTO.getAssetType());
        asset.setCurrency(assetCreateDTO.getCurrency());

        Asset updatedAsset = assetRepository.save(asset);
        return calculateAssetFields(assetMapper.toDTO(updatedAsset));
    }

    @Override
    public void deleteAsset(Long id) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        // Check if there are investments for this asset
        List<Investment> investments = investmentRepository.findByAssetAndUserOrderByTransactionDateDesc(asset, currentUser);
        if (!investments.isEmpty()) {
            throw new BusinessException("Cannot delete asset with existing investments. Please delete all investments first.");
        }

        assetRepository.delete(asset);
    }

    @Override
    public InvestmentDTO createInvestment(InvestmentCreateDTO investmentCreateDTO) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(investmentCreateDTO.getAssetId(), currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        Investment investment = investmentMapper.toEntity(investmentCreateDTO);
        investment.setAsset(asset);
        investment.setUser(currentUser);

        Investment savedInvestment = investmentRepository.save(investment);
        return investmentMapper.toDTO(savedInvestment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestmentDTO> getInvestmentsByAsset(Long assetId) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(assetId, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        List<Investment> investments = investmentRepository.findByAssetAndUserOrderByTransactionDateDesc(asset, currentUser);
        return investments.stream()
                .map(investmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvestmentDTO> getAllInvestments() {
        User currentUser = authUtils.getUserEntity();
        List<Investment> investments = investmentRepository.findByUserOrderByTransactionDateDesc(currentUser);

        return investments.stream()
                .map(investmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public InvestmentDTO updateInvestment(Long id, InvestmentCreateDTO investmentCreateDTO) {
        User currentUser = authUtils.getUserEntity();
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Investment not found"));

        if (!investment.getUser().getId().equals(currentUser.getId())) {
            throw new BusinessException("Investment not found");
        }

        Asset asset = assetRepository.findByIdAndUser(investmentCreateDTO.getAssetId(), currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        investment.setAsset(asset);
        investment.setTransactionType(investmentCreateDTO.getTransactionType());
        investment.setTransactionDate(investmentCreateDTO.getTransactionDate());
        investment.setAmountInvested(investmentCreateDTO.getAmountInvested());
        investment.setSharesQuantity(investmentCreateDTO.getSharesQuantity());
        investment.setPricePerShare(investmentCreateDTO.getPricePerShare());
        investment.setCurrency(investmentCreateDTO.getCurrency());
        investment.setExchangeRate(investmentCreateDTO.getExchangeRate());
        investment.setFees(investmentCreateDTO.getFees());
        investment.setNotes(investmentCreateDTO.getNotes());

        Investment updatedInvestment = investmentRepository.save(investment);
        return investmentMapper.toDTO(updatedInvestment);
    }

    @Override
    public void deleteInvestment(Long id) {
        User currentUser = authUtils.getUserEntity();
        Investment investment = investmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Investment not found"));

        if (!investment.getUser().getId().equals(currentUser.getId())) {
            throw new BusinessException("Investment not found");
        }

        investmentRepository.delete(investment);
    }

    @Override
    @Transactional(readOnly = true)
    public InvestmentSummaryDTO getInvestmentSummary() {
        List<AssetDTO> assets = getAssetsWithCalculatedFields();

        BigDecimal totalInvested = assets.stream()
                .map(AssetDTO::getTotalInvested)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCurrentValue = assets.stream()
                .map(AssetDTO::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNetProfit = totalCurrentValue.subtract(totalInvested);

        BigDecimal totalProfitability = totalInvested.compareTo(BigDecimal.ZERO) > 0
                ? totalNetProfit.divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return InvestmentSummaryDTO.builder()
                .totalInvested(totalInvested)
                .totalCurrentValue(totalCurrentValue)
                .totalNetProfit(totalNetProfit)
                .totalProfitability(totalProfitability)
                .assets(assets)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetDTO> getAssetsWithCalculatedFields() {
        return getAllAssets();
    }

    @Override
    public AssetValueDTO updateAssetValue(AssetValueUpdateDTO assetValueUpdateDTO) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(assetValueUpdateDTO.getAssetId(), currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        // Check if there's already a value for this date
        AssetValue existingValue = assetValueRepository.findByAssetAndValueDateAndUser(
                asset, assetValueUpdateDTO.getValueDate(), currentUser).orElse(null);

        AssetValue assetValue;
        if (existingValue != null) {
            // Update existing value
            existingValue.setCurrentValue(assetValueUpdateDTO.getCurrentValue());
            existingValue.setCurrentPrice(assetValueUpdateDTO.getCurrentPrice());
            existingValue.setSource(assetValueUpdateDTO.getSource() != null ? assetValueUpdateDTO.getSource() : "MANUAL");
            existingValue.setNotes(assetValueUpdateDTO.getNotes());
            assetValue = existingValue;
        } else {
            // Create new value
            assetValue = assetValueMapper.toEntity(assetValueUpdateDTO);
            assetValue.setAsset(asset);
            assetValue.setUser(currentUser);
            assetValue.setSource(assetValueUpdateDTO.getSource() != null ? assetValueUpdateDTO.getSource() : "MANUAL");
        }

        AssetValue savedValue = assetValueRepository.save(assetValue);
        return assetValueMapper.toDTO(savedValue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetValueDTO> getAssetValueHistory(Long assetId) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(assetId, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        List<AssetValue> values = assetValueRepository.findByAssetAndUserOrderByValueDateDesc(asset, currentUser);
        return values.stream()
                .map(assetValueMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetValueDTO getCurrentAssetValue(Long assetId) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(assetId, currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        AssetValue currentValue = assetValueRepository.findFirstByAssetAndUserOrderByValueDateDesc(asset, currentUser)
                .orElse(null);

        if (currentValue == null) {
            throw new BusinessException("No value found for this asset");
        }

        return assetValueMapper.toDTO(currentValue);
    }

    private AssetDTO calculateAssetFields(AssetDTO assetDTO) {
        User currentUser = authUtils.getUserEntity();
        Asset asset = assetRepository.findByIdAndUser(assetDTO.getId(), currentUser)
                .orElseThrow(() -> new BusinessException("Asset not found"));

        // Calculate total invested
        Double totalInvested = investmentRepository.getTotalInvestedByAsset(asset, currentUser);
        assetDTO.setTotalInvested(totalInvested != null ? BigDecimal.valueOf(totalInvested) : BigDecimal.ZERO);

        // Calculate total shares
        Double totalSharesBought = investmentRepository.getTotalSharesByAsset(asset, currentUser);
        Double totalSharesSold = investmentRepository.getSoldSharesByAsset(asset, currentUser);
        double netShares = (totalSharesBought != null ? totalSharesBought : 0.0) - (totalSharesSold != null ? totalSharesSold : 0.0);
        assetDTO.setTotalShares(BigDecimal.valueOf(netShares));

        // Calculate average price
        if (totalSharesBought != null && totalSharesBought > 0) {
            List<Investment> buyTransactions = investmentRepository.findBuyTransactionsByAssetAndUser(asset, currentUser);
            BigDecimal totalCost = buyTransactions.stream()
                    .map(Investment::getAmountInvested)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            assetDTO.setAveragePrice(totalCost.divide(BigDecimal.valueOf(totalSharesBought), 4, RoundingMode.HALF_UP));
        } else {
            assetDTO.setAveragePrice(BigDecimal.ZERO);
        }

        // Get current value from AssetValue table
        AssetValue currentValue = assetValueRepository.findFirstByAssetAndUserOrderByValueDateDesc(asset, currentUser).orElse(null);
        if (currentValue != null) {
            assetDTO.setCurrentValue(currentValue.getCurrentValue());
            assetDTO.setCurrentPrice(currentValue.getCurrentPrice());
            assetDTO.setLastValueDate(currentValue.getValueDate());
        } else {
            // Fallback to total invested if no current value is set
            assetDTO.setCurrentValue(assetDTO.getTotalInvested());
            assetDTO.setCurrentPrice(BigDecimal.ZERO);
            assetDTO.setLastValueDate(null);
        }

        // Calculate net profit and profitability
        BigDecimal netProfit = assetDTO.getCurrentValue().subtract(assetDTO.getTotalInvested());
        assetDTO.setNetProfit(netProfit);

        if (assetDTO.getTotalInvested().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal profitability = netProfit.divide(assetDTO.getTotalInvested(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            assetDTO.setProfitability(profitability);
        } else {
            assetDTO.setProfitability(BigDecimal.ZERO);
        }

        return assetDTO;
    }
}
