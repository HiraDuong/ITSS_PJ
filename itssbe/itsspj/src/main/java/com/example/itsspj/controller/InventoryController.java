package com.example.itsspj.controller;

import com.example.itsspj.model.Inventory;
import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.model.Site;
import com.example.itsspj.repositories.InventoryRepository;
import com.example.itsspj.repositories.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Inventory")
public class InventoryController {
    @Autowired
    private InventoryRepository repository;
    @Autowired
    private SiteRepository siteRepository;
//    get all inventory
    @GetMapping("")
    ResponseEntity<ResponseObject> getAllInventory(){
        return ResponseEntity.status(200).body(new ResponseObject("Inventory found", "success", repository.findAll()));
    }
    @GetMapping("/{id}")
//    get inventory by id
    ResponseEntity<ResponseObject> getInventoryById(@PathVariable Integer id){
        return repository.findById(id).map(value -> ResponseEntity.status(200).body(new ResponseObject("Inventory found", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Inventory not found with id = " + id, "error", null)));
    }



    @GetMapping("/siteCode/{siteCode}")
//    get inventory by Sitecode
    ResponseEntity<ResponseObject> getInventoryBySiteCode(@PathVariable Integer siteCode){
        List<Inventory> inventories = repository.findBySiteCode(siteCode);

        if (!inventories.isEmpty()) {
            return ResponseEntity.status(200).body(new ResponseObject("Inventory found", "success", inventories));
        } else {
            return ResponseEntity.status(404).body(new ResponseObject("Inventory not found with siteCode = " + siteCode, "error", null));
        }
    }
//    get inventory by merchandiseCode
    @GetMapping("/merchandiseCode/{merchandiseCode}")
    ResponseEntity<ResponseObject> getInventoryByMerchandiseCode(@PathVariable Integer merchandiseCode){
        List<Inventory> inventories = repository.findByMerchandiseCode(merchandiseCode);
        if(!inventories.isEmpty() ){
            return ResponseEntity.status(200).body(new ResponseObject("Inventory found", "success", inventories));
        } else {
            return ResponseEntity.status(404).body(new ResponseObject("Inventory not found with merchandiseCode = " + merchandiseCode, "error", null));
        }
    }
//    get inventories and sites by merchandiseCode
@GetMapping("/merchandiseCode/sites/{merchandiseCode}")
ResponseEntity<ResponseObject> getInventoryAndSitesByMerchandiseCode(@PathVariable Integer merchandiseCode) {
    List<Inventory> inventories = repository.findByMerchandiseCode(merchandiseCode);
    List<Map<String, Object>> inventoryWithSites = new ArrayList<>();

    if (!inventories.isEmpty()) {
        for (Inventory inventory : inventories) {
            Optional<Site> site = siteRepository.findById(inventory.getSiteCode());
            site.ifPresent(s -> {
                Map<String, Object> inventoryWithSite = new HashMap<>();
                inventoryWithSite.put("inventory", inventory);
                inventoryWithSite.put("site", s);
                inventoryWithSites.add(inventoryWithSite);
            });
        }
        return ResponseEntity.status(200).body(new ResponseObject("Inventory found", "success", inventoryWithSites));
    } else {
        return ResponseEntity.status(404).body(new ResponseObject("Inventory not found with merchandiseCode = " + merchandiseCode, "error", null));
    }
}


    //    add inventory
  @PostMapping("")
    ResponseEntity<ResponseObject> addInventory(@RequestBody Inventory inventory){
        List<Inventory> inventories = repository.findBySiteCodeAndMerchandiseCode(inventory.getSiteCode(), inventory.getMerchandiseCode());
        if(inventories.size() > 0){
            return ResponseEntity.status(501).body(new ResponseObject("Inventory already exists", "error", null));
        }
        Inventory newInventory = repository.save(inventory);
        return ResponseEntity.status(201).body(new ResponseObject("Inventory added", "success", newInventory));
    }
//    update inventory
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateInventory(@PathVariable Integer id, @RequestBody Inventory inventory){
        Optional<Inventory> inventoryData = Optional.of(repository.findById(id)
                .map(inventory1 -> {
                    inventory1.setSiteCode(inventory.getSiteCode());
                    inventory1.setMerchandiseCode(inventory.getMerchandiseCode());
                    inventory1.setInStockQuantity(inventory.getInStockQuantity());
                    return repository.save(inventory1);
                }).orElseGet(()->
                        {
                            inventory.setInventory_id(id);
                            return repository.save(inventory);
                        }));
        return inventoryData.map(value -> ResponseEntity.status(200)
                .body(new ResponseObject("Inventory updated", "success", value)))
                .orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Inventory not found with id = " + id, "error", null)));

    }
//delete inventory
    @DeleteMapping("/{id}")
    ResponseEntity<ResponseObject> deleteInventory(@PathVariable Integer id){
        Optional<Inventory> inventory = repository.findById(id);
        if(inventory.isPresent()){
            repository.deleteById(id);
            return ResponseEntity.status(200).body(new ResponseObject("Inventory deleted", "success", null));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Inventory not found with id = " + id, "error", null));
        }
    }
}
