package com.example.itsspj.repositories;

import com.example.itsspj.model.OrderList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderListRepository extends JpaRepository<OrderList, Integer> {
    List<OrderList> findBySiteCode(Integer siteCode);

    List<OrderList> findBySiteCodeAndStatus(Integer siteCode, int i);
}
