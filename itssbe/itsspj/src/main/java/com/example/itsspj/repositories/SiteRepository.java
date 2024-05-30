package com.example.itsspj.repositories;

import com.example.itsspj.model.Site;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteRepository extends JpaRepository<Site, Integer> {



    List<Site> findBySiteName(String trim);

    Site findBySiteNameContainingIgnoreCase(String trim);
}
