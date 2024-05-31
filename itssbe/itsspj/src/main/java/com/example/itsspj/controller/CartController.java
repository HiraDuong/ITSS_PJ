package com.example.itsspj.controller;

import com.example.itsspj.model.OrderList;
import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.repositories.OrderListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("api/v1/Cart")
public class CartController {
    @Autowired
    private OrderListRepository repository;
//    get all Cart
    @GetMapping("")
    List<OrderList> getAllCart(){
        List<OrderList> orderLists = repository.findAll();
//        sort by delivery date and status
        orderLists.sort(Comparator.comparing(OrderList::getDeliveryDate).thenComparing(OrderList::getStatus));
        return orderLists;
    }
//    get all Cart with status value
    @GetMapping("/status/{status}")
    ResponseEntity<ResponseObject> getCartByStatus(@PathVariable Integer status){
        List<OrderList> orderLists = repository.findByStatus(status);
        if (!orderLists.isEmpty()) {
            return ResponseEntity.status(200).body(new ResponseObject("Cart found", "success", orderLists));
        } else {
            return ResponseEntity.status(404).body(new ResponseObject("Cart not found with status = " + status, "error", null));
        }
    }
//    update hủy hàng orderedListId
    @PutMapping("/updateStatus/{orderedListId}")
    ResponseEntity<ResponseObject> updateCartStatus(@PathVariable Integer orderedListId) {
        OrderList orderListData = repository.findById(orderedListId).orElse(null);
        if (orderListData != null) {
            orderListData.setStatus(3);
            repository.save(orderListData);
            return ResponseEntity.status(200).body(new ResponseObject("Cart updated", "success", orderListData));
        } else {
            return ResponseEntity.status(404).body(new ResponseObject("Cart not found with id = " + orderedListId, "error", null));
        }
    }
}
