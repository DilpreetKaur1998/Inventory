package com.flic.inventoryManagement.dto.usermodel;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserModel {
    private String userId;
    private String employeeId;
    private String employeeName;
    private String department;
    private String privileges;
    private String emailId;
    private String modifiedBy;
}
