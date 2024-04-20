package com.flic.inventoryManagement.entity.userentity;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<InventoryUser, String> {
    boolean existsByEmailId(String emailId);
    Optional<InventoryUser> findByUserId(String id);

    Page<InventoryUser> findAll(Specification<InventoryUser> inventoryUserSpecification, Pageable pageable);
}
