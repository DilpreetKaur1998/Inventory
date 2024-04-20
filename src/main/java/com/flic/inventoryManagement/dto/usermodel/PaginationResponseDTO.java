package com.flic.inventoryManagement.dto.usermodel;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaginationResponseDTO {
    private String userId;
    private String employeeId;
    private String employeeName;
    private String department;
    private String privileges;
    private String emailId;
    private String createdBy;
    private String createdDate;
    private String status;
}
