package com.example.itsspj.controller;

import com.example.itsspj.model.OrderList;
import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.repositories.OrderListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.hibernate.internal.util.collections.ArrayHelper.forEach;

@RestController
@RequestMapping("api/v1/OrderList")
@CrossOrigin(origins = "http://localhost:3000")

public class OrderListController {
    @Autowired
    OrderListRepository repository;

//    get all orderlist
    @GetMapping("")
    List<OrderList> getAllOrderList(){
        return repository.findAll();
    }
//get orderlist by site_code
    @GetMapping("/siteCode/{siteCode}")
    ResponseEntity<ResponseObject> getOrderListBySiteCode(@PathVariable Integer siteCode){
        List<OrderList> orderLists = repository.findBySiteCode(siteCode);
        if (!orderLists.isEmpty()) {
            return ResponseEntity.status(200).body(new ResponseObject("OrderList found", "success", orderLists));
        } else {
            return ResponseEntity.status(404).body(new ResponseObject("OrderList not found with siteCode = " + siteCode, "error", null));
        }
    }
//    get orderlist by site_code where status = 0
    @GetMapping("/siteCode/status/{siteCode}")
    ResponseEntity<ResponseObject> getOrderListBySiteCodeAndStatus(@PathVariable Integer siteCode){
        List<OrderList> orderLists = repository.findBySiteCodeAndStatus(siteCode, 0);
        if (!orderLists.isEmpty()) {
//         
            return ResponseEntity.status(200).body(new ResponseObject("OrderList found", "success", orderLists));
        } else {
            return ResponseEntity.status(200).body(new ResponseObject("Không có đơn nào chưa kiểm " + siteCode, "success", null));
        }
    }

//    add orderlist
    @PostMapping("/siteCode/{siteCode}")
    ResponseEntity<ResponseObject> addOrderList(@PathVariable Integer siteCode, @RequestBody OrderList orderList) {

            orderList.setSiteCode(siteCode);
            repository.save(orderList);

        return ResponseEntity.status(201).body(new ResponseObject("OrderList added", "success", orderList));
    }
//    update orderlist status
@PutMapping("updateStatus/orderListId/{orderListId}")
ResponseEntity<ResponseObject> updateOrderListStatus(@PathVariable Integer orderListId) {
    OrderList orderListData = repository.findById(orderListId).orElse(null);
    if (orderListData == null) {
        return ResponseEntity.status(404).body(new ResponseObject("OrderList not found with id = " + orderListId, "error", null));
    }
    orderListData.setStatus(1);
    repository.save(orderListData);  // Lưu cập nhật vào cơ sở dữ liệu
    return ResponseEntity.status(200).body(new ResponseObject("OrderList status updated", "success", orderListData));
}


}
