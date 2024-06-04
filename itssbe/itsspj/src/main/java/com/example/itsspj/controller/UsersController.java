package com.example.itsspj.controller;

import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.model.Users;
import com.example.itsspj.repositories.UsersRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Users")
public class UsersController {
    private static final Logger log = LoggerFactory.getLogger(UsersController.class);
    @Value("${salt_string}")
    private String saltString;

    @Autowired private UsersRepository repository;
//    get all users
    @GetMapping("")
    List<Users> getAllUsers(){
        return repository.findAll();
    }
//    get users by id
    @GetMapping("/{id}")
    ResponseEntity<ResponseObject> getUsersById(@PathVariable int id){
        Optional<Users> users = repository.findById(id);
        return users.map(value -> ResponseEntity.status(200).body(new ResponseObject("Users found", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Users not found with id = " + id, "error", null)));
    }
//get user by name
    @GetMapping("/name/{name}")
    ResponseEntity<ResponseObject> getUsersByName(@PathVariable String name) {
        List<Users> users = repository.findByUsername(name.trim());
        if(users != null){
            return ResponseEntity.status(200).body(new ResponseObject("Users found", "success", users));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Users not found with name = " + name, "error", null));
        }
    }
//    add user
    @PostMapping("")
    ResponseEntity<ResponseObject> addUsers(@RequestBody Users users){
        List<Users> listUsers = repository.findByUsername(users.getUsername().trim());
        if(listUsers.size() > 0){
            return ResponseEntity.status(501).body(new ResponseObject("Users already exists", "error", null));
        }
        String hashedPassword = BCrypt.hashpw(users.getPassword(), saltString);
        users.setPassword(hashedPassword);
        Users newUsers = repository.save(users);
        return ResponseEntity.status(201).body(new ResponseObject("Users added", "success", newUsers));
    }
//    update users
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateUsers(@PathVariable int id, @RequestBody Users users){
        log.warn("salt"+BCrypt.gensalt());
        Optional<Users> usersData = Optional.of(repository.findById(id)
                .map(users1 -> {
                    users1.setUsername(users.getUsername());
                    String hashedPassword = BCrypt.hashpw(users.getPassword(), saltString);

                    users1.setPassword( hashedPassword);
                    users1.setRole(users.getRole());
                    return repository.save(users1);
                }).orElseGet(()->
                        {
                            users.setUser_id(id);
                            return repository.save(users);
                        }));
        return usersData.map(value -> ResponseEntity.status(200).body(new ResponseObject("Users updated", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Users not found with id = " + id, "error", null)));
    }
//    delete users
    @DeleteMapping("/{id}")
    ResponseEntity<ResponseObject> deleteUsers(@PathVariable int id){
        Optional<Users> users = repository.findById(id);
        if(users.isPresent()){
            repository.deleteById(id);
            return ResponseEntity.status(200).body(new ResponseObject("Users deleted", "success", null));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Users not found with id = " + id, "error", null));
        }
    }
}
