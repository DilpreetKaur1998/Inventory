package com.flic.inventoryManagement.entity.userentity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersPrivileges {
    @Id
    private String userId;
    private Boolean bomRead;
    private Boolean bomWrite;
    private Boolean inventoryRead;
    private Boolean inventoryWrite;
    private Boolean issueRead;
    private Boolean issueWrite;
    private Boolean returnRead;
    private Boolean returnWrite;
    private Boolean stockRead;
    private Boolean stockWrite;
}
