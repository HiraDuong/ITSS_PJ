package com.example.itsspj.repositories;

import com.example.itsspj.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsersRepository extends JpaRepository<Users, Integer> {
    List<Users> findByUsername(String trim);
}
