package com.example.itsspj.repositories;

import com.example.itsspj.model.Inventory;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    List<Inventory> findBySiteCode(Integer siteCode);

    List<Inventory> findByMerchandiseCode(Integer merchandiseCode);

    List<Inventory> findBySiteCodeAndMerchandiseCode(int siteCode, int merchandiseCode);
}
