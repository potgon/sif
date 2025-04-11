package dev.potgon.sif.service;

import java.util.Map;

public interface ExportService {
    Map<String, Object> exportMonth(Integer year, Integer month);
    Map<String, Object> exportYear(Integer year);
    Map<String, Object> exportAll();
}
