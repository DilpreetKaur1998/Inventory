package com.flic.inventoryManagement.dto.usermodel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateUserModel {
    private String userId;
    private String employeeId;
    private String employeeName;
    private String department;
    private String privileges;
    private String emailId;
    private String password;
    private String createdBy;
}
