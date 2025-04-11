package dev.potgon.sif.service;

import dev.potgon.sif.entity.User;

public interface UserService {
    User getDefaultUser();
    void ensureDefaultUserExists();
}
