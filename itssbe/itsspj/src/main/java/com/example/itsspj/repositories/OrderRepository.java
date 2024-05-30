package com.example.itsspj.repositories;

import com.example.itsspj.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository  extends JpaRepository<Orders, Integer> {
}
