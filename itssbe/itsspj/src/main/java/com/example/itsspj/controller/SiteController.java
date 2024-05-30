package com.example.itsspj.controller;

import com.example.itsspj.model.ResponseObject;
import com.example.itsspj.model.Site;
import com.example.itsspj.repositories.SiteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/Site")
public class SiteController {
    @Autowired
    private SiteRepository repository;
//    get all site
    @GetMapping("")
    List<Site> getAllSite(){
        return repository.findAll();
    }
//    get site by id
    @GetMapping("/{id}")
    ResponseEntity<ResponseObject> getSiteById(@PathVariable int id){
        Optional<Site> site = repository.findById(id);
        return site.map(value -> ResponseEntity.status(200).body(new ResponseObject("Site found", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Site not found with id = " + id, "error", null)));
    }
//    get site by name
    @GetMapping("/name/{name}")
    ResponseEntity<ResponseObject> getSiteByName(@PathVariable String name) {
        Site site = repository.findBySiteNameContainingIgnoreCase(name.trim());
        if(site != null){
            return ResponseEntity.status(200).body(new ResponseObject("Site found", "success", site));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Site not found with name = " + name, "error", null));
        }
    }
//    add site
    @PostMapping("")
    ResponseEntity<ResponseObject> addSite(@RequestBody Site site){
        List<Site> sites = repository.findBySiteName(site.getSiteName().trim());
        if(sites.size() > 0){
            return ResponseEntity.status(501).body(new ResponseObject("Site already exists", "error", null));
        }
        Site newSite = repository.save(site);
        return ResponseEntity.status(201).body(new ResponseObject("Site added", "success", newSite));
    }
//    update site
    @PutMapping("/{id}")
    ResponseEntity<ResponseObject> updateSite(@PathVariable int id, @RequestBody Site site){
        Optional<Site> siteData = Optional.of(repository.findById(id)
                .map(site1 -> {
                    site1.setSiteName(site.getSiteName());
                    site1.setByShip(site.getByShip());
                    site1.setByAir(site.getByAir());
                    site1.setOtherInfo(site.getOtherInfo());
                    return repository.save(site1);
                }).orElseGet(()->
                        {
                            site.setSite_code(id);
                            return repository.save(site);
                        }
                        ));
        return siteData.map(value -> ResponseEntity.status(200).body(new ResponseObject("Site updated", "success", value))).orElseGet(() -> ResponseEntity.status(404).body(new ResponseObject("Site not found with id = " + id, "error", null)));
    }
//    delete site
    @DeleteMapping("/{id}")
    ResponseEntity<ResponseObject> deleteSite(@PathVariable int id){
        Optional<Site> site = repository.findById(id);
        if(site.isPresent()){
            repository.deleteById(id);
            return ResponseEntity.status(200).body(new ResponseObject("Site deleted", "success", null));
        }else{
            return ResponseEntity.status(404).body(new ResponseObject("Site not found with id = " + id, "error", null));
        }
    }
}
