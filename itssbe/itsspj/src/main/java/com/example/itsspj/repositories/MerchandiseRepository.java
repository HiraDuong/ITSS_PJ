package com.example.itsspj.repositories;

import com.example.itsspj.model.Merchandise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MerchandiseRepository extends JpaRepository<Merchandise, Integer> {

    List<Merchandise>  findByNameContainingIgnoreCase(String name);


    List<Merchandise> findByName(String trim);
}
