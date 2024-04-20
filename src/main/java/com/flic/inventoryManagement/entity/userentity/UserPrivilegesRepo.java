package com.flic.inventoryManagement.entity.userentity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPrivilegesRepo extends JpaRepository<UsersPrivileges, String> {
    boolean existsByUserId(String s);
}
