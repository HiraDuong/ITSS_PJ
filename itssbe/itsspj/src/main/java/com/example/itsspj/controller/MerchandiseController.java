package com.example.itsspj.controller;

import com.example.itsspj.model.Merchandise;
import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.repositories.MerchandiseRepository;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Merchandise")
public class MerchandiseController {

@Autowired
    private MerchandiseRepository repository;
//    get all merchandise
    @GetMapping("")
    List<Merchandise> getAllMerchandise(){
        return repository.findAll();
    }
//    get merchandise by id
    @GetMapping("/{id}")
    ResponseEntity<ResponseObject> getMerchandiseById(@PathVariable int id){
        Optional<Merchandise> merchandise = repository.findById(id);
        return merchandise.map(value -> ResponseEntity.status(200).body(new ResponseObject("Merchandise found", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Merchandise not found with id = " + id, "error", null)));
    }
//    get merchandise by name
    @GetMapping("/name/{name}")
    ResponseEntity<ResponseObject> getMerchandiseByName(@PathVariable String name) {
    List<Merchandise> merchandise = (List<Merchandise>) repository.findByNameContainingIgnoreCase(name.trim());
            if(merchandise != null){
                return ResponseEntity.status(200).body(new ResponseObject("Merchandise found", "success", merchandise));
            }else{
                return ResponseEntity.status(404).body(new ResponseObject("Merchandise not found with name = " + name, "error", null));
            }
    }
//    add merchandise
    @PostMapping("")
    ResponseEntity<ResponseObject> addMerchandise(@RequestBody Merchandise  merchandise){
        List<Merchandise> merchandises = repository.findByName(merchandise.getName().trim());
        if(merchandises.size() > 0){
            return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(new ResponseObject("Merchandise already exists", "error", null));
        }
        Merchandise newMerchandise = repository.save(merchandise);
        return ResponseEntity.status(201).body(new ResponseObject("Merchandise added", "success", newMerchandise));
    }
//    update merchandise
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateMerchandise(@PathVariable int id, @RequestBody Merchandise merchandise){
        Optional<Merchandise> merchandiseData = Optional.of(repository.findById(id)
                .map(merchandise1 -> {
                            merchandise1.setName(merchandise.getName());
                            merchandise1.setUnit(merchandise.getUnit());
                            return repository.save(merchandise1);
                        }
                ).orElseGet(() -> {
                    merchandise.setMerchandise_code(id);
                    return repository.save(merchandise);
                }));
        return ResponseEntity.status(200).body(new ResponseObject("Merchandise updated", "success", merchandiseData));

    }
//    delete merchandise
    @DeleteMapping("/{id}")
    ResponseEntity<ResponseObject> deleteMerchandise(@PathVariable int id){
        Optional<Merchandise> merchandise = repository.findById(id);
        if(merchandise.isPresent()){
            repository.deleteById(id);
            return ResponseEntity.status(200).body(new ResponseObject("Merchandise deleted", "success", null));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Merchandise not found with id = " + id, "error", null));
        }
    }
}
