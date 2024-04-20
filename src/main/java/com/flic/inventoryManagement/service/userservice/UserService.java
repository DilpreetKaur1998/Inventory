package com.flic.inventoryManagement.service.userservice;

import com.flic.inventoryManagement.dto.usermodel.*;
import com.flic.inventoryManagement.entity.userentity.InventoryUser;
import com.flic.inventoryManagement.entity.userentity.UserPrivilegesRepo;
import com.flic.inventoryManagement.entity.userentity.UserRepo;
import com.flic.inventoryManagement.entity.userentity.UsersPrivileges;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Service
@RequiredArgsConstructor
public class UserService implements UserInterface {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserPrivilegesRepo privilegesRepo;
    public static final int BITE_SIZE = 4 * 1024;

    Logger logger = LoggerFactory.getLogger(UserService.class);


    @Override
    public void saveUser(CreateUserModel model) {
        if (userRepo.existsById(model.getUserId())) {
            logger.error("User already existing with id=" + model.getUserId());
            throw new RuntimeException("User Already Exists");
        } else if (userRepo.existsByEmailId(model.getEmailId())) {
            logger.error("User already existing with email=" + model.getEmailId());
            throw new RuntimeException("Email Already Exists");
        }
        userRepo.save(
                InventoryUser
                        .builder()
                        .userId(model.getUserId())
                        .employeeId(model.getEmployeeId())
                        .employeeName(model.getEmployeeName())
                        .department(model.getDepartment())
                        .privileges(model.getPrivileges())
                        .emailId(model.getEmailId())
                        .password(passwordEncoder.encode(model.getPassword()))
                        .createdBy(model.getCreatedBy())
                        .createdDate(new Date().toString())
                        .status(false)
                        .build());
        logger.info("User Created ={}", model);
    }

    @Override
    public GetAllUsersDTO getDataById(String userId) {
        Optional<InventoryUser> userOptional = userRepo.findById(userId);
        if (userOptional.isPresent()) {
            logger.info("User found with id=" + userId);
            InventoryUser user = userOptional.get();
            return GetAllUsersDTO
                    .builder()
                    .userId(user.getUserId())
                    .employeeId(user.getEmployeeId())
                    .employeeName(user.getEmployeeName())
                    .department(user.getDepartment())
                    .privileges(user.getPrivileges())
                    .emailId(user.getEmailId())
                    .joinedOn(user.getCreatedDate())
                    .invitedBy(user.getCreatedBy())
                    .status(user.getStatus() ? "ACTIVE" : "INACTIVE")
                    .build();
        }
        logger.error("User doesn't exist with id=" + userId);
        throw new RuntimeException("User doesn't exists");

    }

    @Override
    public List<GetAllUsersDTO> getAllUsers() {
        List<InventoryUser> users = userRepo.findAll();
        List<GetAllUsersDTO> models = new ArrayList<>();
        logger.info("Numbers of Users Found= " + users.size());

        users.parallelStream().forEach(user -> models.add(
                GetAllUsersDTO
                        .builder()
                        .userId(user.getUserId())
                        .employeeId(user.getEmployeeId())
                        .employeeName(user.getEmployeeName())
                        .department(user.getDepartment())
                        .privileges(user.getPrivileges())
                        .emailId(user.getEmailId())
                        .invitedBy(user.getCreatedBy())
                        .joinedOn(user.getCreatedDate())
                        .status(user.getStatus() ? "ACTIVE" : "INACTIVE")
                        .build()));
        return models;
    }

    @Override
    public void updateUser(UpdateUserModel model) {
        Optional<InventoryUser> user = userRepo.findByUserId(model.getUserId());
        if (user.isPresent()) {
            InventoryUser user1 = user.get();
            user1.setUserId(model.getUserId());
            user1.setEmployeeId(model.getEmployeeId());
            user1.setEmployeeName(model.getEmployeeName());
            user1.setDepartment(model.getDepartment());
            user1.setPrivileges(model.getPrivileges());
            user1.setEmailId(model.getEmailId());
            user1.setModifiedBy(model.getModifiedBy());
            user1.setModifiedDate(new Date().toString());
            userRepo.save(
                    user1
            );
            logger.info("User Updated Successfully =" + model);
        } else {
            logger.error("Couldn't update user with id=" + model.getUserId());
            throw new RuntimeException("User doesn't exists! Cannot Update!");
        }
    }

    @Override
    public void deleteUserById(String userId) {
        if (!userRepo.existsById(userId)) {
            logger.error("User doesn't exists with id=" + userId);
            throw new RuntimeException("User doesn't exits");
        }
        userRepo.deleteById(userId);
        logger.info("User Deleted with id=" + userId);
    }

    @Override
    public byte[] getImage(String userId) {
        Optional<InventoryUser> user = userRepo.findByUserId(userId);
        if (user.isEmpty()) {
            logger.error("User doesn't exists with user Id=" + userId);
            throw new RuntimeException("User not found");
        }
        try {
            return decompressImage(user.get().getProfileImage());
        } catch (Exception exception) {
            logger.error(exception.getMessage());
            throw new RuntimeException(exception.getMessage());
        }
    }

    @Override
    public void uploadPhoto(MultipartFile file, String userId) {
        Optional<InventoryUser> user = userRepo.findByUserId(userId);

        if (user.isPresent()) {
            InventoryUser user1 = user.get();
            try {
                user1.setProfileImage(compressImage(file.getBytes()));
            } catch (Exception e) {
                logger.error(e.getMessage());
            }
            userRepo.save(
                    user1
            );
            logger.info("Image uploaded with User Id=" + userId);
        } else {
            logger.error("User id doesnt exists to upload Image");
            throw new RuntimeException("User id doesnt exists to upload Image");
        }

    }


    public static byte[] compressImage(byte[] data) throws IOException {
        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[BITE_SIZE];
        while (!deflater.finished()) {
            int size = deflater.deflate(tmp);
            outputStream.write(tmp, 0, size);
        }

        outputStream.close();

        return outputStream.toByteArray();
    }

    public static byte[] decompressImage(byte[] data) throws IOException, DataFormatException {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[BITE_SIZE];

        while (!inflater.finished()) {
            int count = inflater.inflate(tmp);
            outputStream.write(tmp, 0, count);
        }

        outputStream.close();

        return outputStream.toByteArray();
    }

    @Override
    public void updateUserStatus(String userId, String status) {
        Optional<InventoryUser> user = userRepo.findByUserId(userId);
        if (user.isPresent()) {
            InventoryUser user1 = user.get();
            user1.setStatus(status.equals("ACTIVE"));
            userRepo.save(
                    user1
            );
            logger.info("Status Updated to " + status + " Of User id=" + userId);
        } else {
            logger.error("User doesn't exists to update its status having User Id=" + userId);
            throw new RuntimeException("User doesn't exists to update it's status!");
        }

    }

    @Override
    public void savePrivileges(UsersPrivilegesDTO model) {
        if (privilegesRepo.existsByUserId(model.getUserId())) {
            logger.error("Privileges are already assigned to the user=" + model.getUserId());
            throw new RuntimeException("Privileges are already assigned!");
        }
        if (!userRepo.existsById(model.getUserId())) {
            logger.error("User doesn't exist to assign privileges ");
            throw new RuntimeException("User doesn't exist to assign privileges");
        }
        privilegesRepo.save(
                UsersPrivileges
                        .builder()
                        .userId(model.getUserId())
                        .bomRead(model.getBomRead())
                        .bomWrite(model.getBomWrite())
                        .inventoryRead(model.getInventoryRead())
                        .inventoryWrite(model.getInventoryWrite())
                        .issueRead(model.getIssueRead())
                        .issueWrite(model.getIssueWrite())
                        .returnRead(model.getReturnRead())
                        .returnWrite(model.getReturnWrite())
                        .stockRead(model.getStockRead())
                        .stockWrite(model.getStockWrite())
                        .build()
        );
        logger.info("Privileges Saved of User=" + model);
    }

    @Override
    public void updatePrivileges(UsersPrivilegesDTO model) {
        Optional<UsersPrivileges> user = privilegesRepo.findById(model.getUserId());

        if(user.isPresent()){
           UsersPrivileges user1 = user.get();
           user1.setBomRead(model.getBomRead());
            user1.setBomWrite(model.getBomWrite());
            user1.setInventoryRead(model.getInventoryRead());
            user1.setInventoryWrite(model.getInventoryWrite());
            user1.setIssueRead(model.getIssueRead());
            user1.setIssueWrite(model.getIssueWrite());
            user1.setReturnRead(model.getReturnRead());
            user1.setReturnWrite(model.getReturnWrite());
            user1.setStockRead(model.getStockRead());
            user1.setStockWrite(model.getStockWrite());
            privilegesRepo.save(user1);
            logger.info("Updated Privileges of UserId="+ model.getUserId());
        }
        else{
            logger.error("Privileges can't be updated as User Id- "+model.getUserId() +" doesn't exists");
            throw new RuntimeException("Privileges can't be updated as User Id- "+model.getUserId() +" doesn't exists");
        }

    }

    @Override
    public UsersPrivilegesDTO getPrivileges(String userId) {
        Optional<UsersPrivileges> user = privilegesRepo.findById(userId);
        if(user.isPresent()){
            UsersPrivileges user1 = user.get();
            logger.info("User Privileges fetched for userId= "+user1);

            return UsersPrivilegesDTO
                    .builder()
                    .userId(user1.getUserId())
                    .bomRead(user1.getBomRead())
                    .bomWrite(user1.getBomWrite())
                    .inventoryRead(user1.getInventoryRead())
                    .inventoryWrite(user1.getInventoryWrite())
                    .issueRead(user1.getIssueRead())
                    .issueWrite(user1.getIssueWrite())
                    .returnRead(user1.getReturnRead())
                    .returnWrite(user1.getReturnWrite())
                    .stockRead(user1.getStockRead())
                    .stockWrite(user1.getStockWrite())
                    .build();

        }
       else {
           logger.info("Privileges cant be fetched with UserId= "+userId);
           return new UsersPrivilegesDTO();
        }
    }

    @Override
    public Page<PaginationResponseDTO> search(GetUserPaginationDTO userModel, Pageable pageable) {
        Page<InventoryUser> userEntityList = userRepo
                .findAll((Specification<InventoryUser>) (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();
                    getPredicate(root, cb, predicates, userModel.getRole(), "privileges", true);
                    getPredicate(root, cb, predicates, userModel.getDepartment(), "department", true);
                    getPredicate(root, cb, predicates, userModel.getStatus(), "status");
                    return cb.and(predicates.toArray(new Predicate[0]));
                }, pageable);

        List<PaginationResponseDTO> responseDTO = new ArrayList<>();
        userEntityList.getContent().forEach(content->{
            responseDTO.add(
                    PaginationResponseDTO.builder()
                            .userId(content.getUserId())
                            .employeeId(content.getEmployeeId())
                            .employeeName(content.getEmployeeName())
                            .department(content.getDepartment())
                            .privileges(content.getPrivileges())
                            .emailId(content.getEmailId())
                            .createdBy(content.getCreatedBy())
                            .createdDate(content.getCreatedDate())
                            .status(content.getStatus() ? "ACTIVE" : "INACTIVE")
                            .build()
            );
        });

        return new PageImpl<>(new ArrayList<>(responseDTO), pageable, userEntityList.getTotalElements());

    }

    public void getPredicate(Root<InventoryUser> root, CriteriaBuilder cb, List<Predicate> predicates, Boolean value, String fieldName) {
        if (value != null) {
            predicates.add(cb.equal(root.get(fieldName), value));
        }
    }
    private void getPredicate(Root<InventoryUser> root, CriteriaBuilder cb, List<Predicate> predicates, String value, String fieldName, boolean exactMatch) {
        if (value != null && !value.isEmpty()) {
            if (exactMatch) {
                predicates.add(cb.equal(root.get(fieldName), value));
            } else {
                predicates.add(cb.like(root.get(fieldName), "%" + value + "%"));
            }
        }
    }
}



