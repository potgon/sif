package dev.potgon.sif.utils;

import dev.potgon.sif.dto.shared.ParamDTO;
import dev.potgon.sif.dto.shared.PeriodDTO;
import dev.potgon.sif.dto.shared.UserDTO;
import dev.potgon.sif.entity.User;
import dev.potgon.sif.mapper.ParamMapper;
import dev.potgon.sif.mapper.PeriodMapper;
import dev.potgon.sif.repository.ParamRepository;
import dev.potgon.sif.repository.PeriodRepository;
import dev.potgon.sif.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.Year;

@Service
@RequiredArgsConstructor
public class AuthUtils {

    private final UserRepository userRepo;
    private final ParamRepository paramRepo;
    private final PeriodRepository periodRepo;
    private final ParamMapper paramMapper;
    private final PeriodMapper periodMapper;

    public User getUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));
    }

    public UserDTO getUserDTO() {
        User user = getUserEntity();
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .password(user.getPassword())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public void createExpenseTarget(UserDTO user) {
        ParamDTO expenseTarget = ParamDTO.builder()
                .id(null)
                .name(Constants.PARAM_EXPENSE_TARGET)
                .value("0.0")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        paramRepo.save(paramMapper.toEntity(expenseTarget));
    }

    public void createAccumulated(UserDTO user) {
        ParamDTO accumulated = ParamDTO.builder()
                .id(null)
                .name(Constants.PARAM_ACCUMULATED)
                .value("0.0")
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        paramRepo.save(paramMapper.toEntity(accumulated));
    }

    public void createPeriods(UserDTO user) {
        int currentYear = Year.now().getValue();

        for (int month = 1; month <= 12; month++) {
            PeriodDTO period = new PeriodDTO();
            period.setYear(currentYear);
            period.setMonth(month);
            period.setSalary(BigDecimal.ZERO);
            period.setExtraPay(BigDecimal.ZERO);
            period.setUser(user);
            periodRepo.save(periodMapper.toEntity(period));
        }
    }
}
