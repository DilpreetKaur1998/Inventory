package com.flic.inventoryManagement.dto.usermodel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsersPrivilegesDTO {
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
