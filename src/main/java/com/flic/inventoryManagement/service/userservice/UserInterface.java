package com.flic.inventoryManagement.service.userservice;

import com.flic.inventoryManagement.dto.usermodel.*;
import com.flic.inventoryManagement.entity.userentity.InventoryUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserInterface {
    void saveUser(CreateUserModel inventoryUserModel);

    GetAllUsersDTO getDataById(String userId);

    List<GetAllUsersDTO> getAllUsers();

    void updateUser(UpdateUserModel model);

    void deleteUserById(String userId);

    byte[] getImage(String userId);
    void uploadPhoto(MultipartFile file, String userId);

    void updateUserStatus(String userId, String status);
    void savePrivileges(UsersPrivilegesDTO model);
    void updatePrivileges(UsersPrivilegesDTO model);

    UsersPrivilegesDTO getPrivileges(String userId);

    Page<PaginationResponseDTO> search(GetUserPaginationDTO userModel, Pageable pageable);
}
