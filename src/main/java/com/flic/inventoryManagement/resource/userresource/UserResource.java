package com.flic.inventoryManagement.resource.userresource;

import com.flic.inventoryManagement.dto.usermodel.*;
import com.flic.inventoryManagement.entity.userentity.InventoryUser;
import com.flic.inventoryManagement.service.userservice.UserInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/user")
public class UserResource {

    private final UserInterface userInterface;

    @Autowired
    public UserResource(UserInterface userInterface) {
        this.userInterface = userInterface;
    }

    @PostMapping("/create")
    public ResponseEntity<InventoryResponse> createUser(@RequestBody CreateUserModel createUserModel) {
        userInterface.saveUser(createUserModel);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("User created successfully").build());
    }

    @GetMapping("/getUserById")
    public GetAllUsersDTO getUser(@RequestParam String userId) {
        return userInterface.getDataById(userId);
    }

    @GetMapping("/getAllUsers")
    public List<GetAllUsersDTO> getAllUsers() {
        return userInterface.getAllUsers();
    }

    @PutMapping("/update")
    public ResponseEntity<InventoryResponse> updateUser(@RequestBody UpdateUserModel model) {
        userInterface.updateUser(model);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("User Updated Successfully").build());
    }

    @DeleteMapping("/deleteUserById")
    public ResponseEntity<InventoryResponse> deleteUser(@RequestParam String userId) {
        userInterface.deleteUserById(userId);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("User deleted").build());
    }

//	@PostMapping("uploadImage")
//	public ResponseEntity<InventoryResponse> uploadImage(@RequestParam MultipartFile file, @RequestParam String userId){
//		userInterface.uploadImage(file, userId);
//		return ResponseEntity.ok(InventoryResponse.builder().status(200).message("Image uploaded Successfully").build());
//	}

    @PutMapping("/uploadImage")
    public ResponseEntity<InventoryResponse> uploadImage(@RequestParam("image") MultipartFile file, @RequestParam String userId) {
        userInterface.uploadPhoto(file, userId);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("Image Uploaded!").build());
    }

    @GetMapping("showPhoto")
    public ResponseEntity<?> getImage(@RequestParam String userId) {
        byte[] imageData = userInterface.getImage(userId);
        return ResponseEntity.status(200)
                .contentType(MediaType.valueOf(IMAGE_PNG_VALUE))
                .body(imageData);
    }

    @PutMapping("updateStatus")
    public ResponseEntity<InventoryResponse> updateStatus(@RequestParam String userId, @RequestParam String status) {
        userInterface.updateUserStatus(userId, status);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("Status Updated!").build());
    }

    @PostMapping("savePrivileges")
    public ResponseEntity<InventoryResponse> savePrivileges(@RequestBody UsersPrivilegesDTO model) {
        userInterface.savePrivileges(model);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("Assigned Privilege!").build());
    }

    @PutMapping("updatePrivileges")
    public ResponseEntity<InventoryResponse> updatePrivileges(@RequestBody UsersPrivilegesDTO model) {
        userInterface.updatePrivileges(model);
        return ResponseEntity.ok(InventoryResponse.builder().status(200).message("Updated Privileges").build());
    }


    @GetMapping("getPrivileges")
    public UsersPrivilegesDTO getPrivileges(@RequestParam String userId) {
        return userInterface.getPrivileges(userId);
    }

    @PostMapping("/search")
    public Page<PaginationResponseDTO> search(@RequestBody GetUserPaginationDTO userModel,
                                      @PageableDefault(size = 10, page = 0, sort = {"userId"}, direction = Sort.Direction.ASC) Pageable pageable) {
        return userInterface.search(userModel,pageable);
    }


}
