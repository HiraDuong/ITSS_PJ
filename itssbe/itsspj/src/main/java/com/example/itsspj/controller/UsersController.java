package com.example.itsspj.controller;

import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.model.Users;
import com.example.itsspj.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Users")
public class UsersController {
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
        List<Users> userss = repository.findByUsername(users.getUsername().trim());
        if(userss.size() > 0){
            return ResponseEntity.status(501).body(new ResponseObject("Users already exists", "error", null));
        }
        Users newUsers = repository.save(users);
        return ResponseEntity.status(201).body(new ResponseObject("Users added", "success", newUsers));
    }
//    update users
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateUsers(@PathVariable int id, @RequestBody Users users){
        Optional<Users> usersData = Optional.of(repository.findById(id)
                .map(users1 -> {
                    users1.setUsername(users.getUsername());
                    users1.setPassword(users.getPassword());
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
