package dev.potgon.sif.service.impl;

import dev.potgon.sif.entity.AppState;
import dev.potgon.sif.repository.AppStateRepository;
import dev.potgon.sif.service.AppStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AppStateServiceImpl implements AppStateService {
    private final AppStateRepository appStateRepo;

    @Override
    public boolean checkAndTriggerMonthRollover() {
        LocalDate now = LocalDate.now();
        AppState state = appStateRepo.findAppStateById(1L);

        if (state.getLastLoadedYear() == null ||
                state.getLastLoadedYear() != now.getYear() ||
                state.getLastLoadedMonth() != now.getMonthValue()) {

            state.setLastLoadedYear(now.getYear());
            state.setLastLoadedMonth(now.getMonthValue());
            appStateRepo.save(state);

            return true;
        }

        return false;
    }
}
