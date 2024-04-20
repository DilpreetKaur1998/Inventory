package com.flic.inventoryManagement.entity.userentity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;

import java.sql.SQLType;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryUser {
    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private String userId;
    private String employeeId;
    private String employeeName;
    private String department;
    private String privileges;
    private String emailId;
    private String password;
    private String createdBy;
    private String createdDate;
    private String modifiedBy;
    private String modifiedDate;
    private Boolean status;
    @Lob
    @JdbcTypeCode(SqlTypes.BLOB)
    private byte[] profileImage;
}
