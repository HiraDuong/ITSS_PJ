package com.example.itsspj.controller;

import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.model.Users;
import com.example.itsspj.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/auth")
public class AuthController {
    @Autowired private UsersRepository repository;
    @PostMapping("/login")
    ResponseEntity<ResponseObject> login(@RequestBody Users user){ {
        List<Users> users = repository.findByUsername(user.getUsername().trim());
        if (users.size() > 0) {
            if (users.get(0).getPassword().equals(user.getPassword())) {
                return ResponseEntity.status(200).body(new ResponseObject("Login success", "success", users.get(0)));
            } else {
                return ResponseEntity.status(401).body(new ResponseObject("Password is incorrect", "error", null));
            }
        }
        return ResponseEntity.status(404).body(new ResponseObject("User not found", "error", null));
        }
    }
//    register
    @PostMapping("/register")
    ResponseEntity<ResponseObject> register(@RequestBody Users user){
        List<Users> users = repository.findByUsername(user.getUsername().trim());
        if(!users.isEmpty()){
            return ResponseEntity.status(501).body(new ResponseObject("User already exists", "error", null));
        }
        Users newUser = repository.save(user);
        return ResponseEntity.status(201).body(new ResponseObject("User added", "success", newUser));
    }
}
