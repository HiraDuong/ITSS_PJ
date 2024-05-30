package com.example.itsspj.controller;

import com.example.itsspj.model.Orders;
import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.repositories.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Order")

public class OrderController {
@Autowired
    private OrderRepository repository;
//    get all order
    @GetMapping("")
    List<Orders> getAllOrder(){
        return repository.findAll();
    }
//    get order by id
    @GetMapping("/{id}")
    ResponseEntity<ResponseObject> getOrderById(@PathVariable int id){
        Optional<Orders> order = repository.findById(id);
        return order.map(value -> ResponseEntity.status(200).body(new ResponseObject("Orders found", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Orders not found with id = " + id, "error", null)));
    }
//    add orders
    @PostMapping("")
    ResponseEntity<ResponseObject> addOrder(@RequestBody Orders orders){
        Orders newOrders = repository.save(orders);
        return ResponseEntity.status(201).body(new ResponseObject("Orders added", "success", newOrders));
    }
//    update orders
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateOrder(@PathVariable int id, @RequestBody Orders orders){
        Optional<Orders> orderData = Optional.of(repository.findById(id)
                .map(orders1 -> {
                   orders1.setMerchandise_code(orders.getMerchandise_code());
                     orders1.setUnit(orders.getUnit());
                        orders1.setQuantity(orders.getQuantity());
                        orders1.setDelivery_date(orders.getDelivery_date());
                    return repository.save(orders1);
                }).orElseGet(()->
                        {
                            orders.setOrder_id(id);
                            return repository.save(orders);
                        }));
        return orderData.map(value -> ResponseEntity.status(200).body(new ResponseObject("Orders updated", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Orders not found with id = " + id, "error", null)));

    }
//    delete order
    @DeleteMapping("/{id}")
    ResponseEntity<ResponseObject> deleteOrder(@PathVariable int id){
        Optional<Orders> order = repository.findById(id);
        if(order.isPresent()){
            repository.deleteById(id);
            return ResponseEntity.status(200).body(new ResponseObject("Orders deleted", "success", null));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Orders not found with id = " + id, "error", null));
        }
    }
 }
