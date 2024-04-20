package com.flic.inventoryManagement.dto.usermodel;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GetUserPaginationDTO {
    private String role;
    private Boolean status;
    private String department;
}
