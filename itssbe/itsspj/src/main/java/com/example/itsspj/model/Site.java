package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Site {
    @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int site_code;
    private String siteName;
    private int byShip;
    private int byAir;
    private String otherInfo;

    public Site(int site_code, String otherInfo, String siteName, int byShip, int byAir) {
        this.site_code = site_code;
        this.otherInfo = otherInfo;
        this.siteName = siteName;
        this.byShip = byShip;
        this.byAir = byAir;
    }

    public Site() {

    }

    public int getSite_code() {
        return site_code;
    }

    public void setSite_code(int site_code) {
        this.site_code = site_code;
    }

    public String getOtherInfo() {
        return otherInfo;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }

    public int getByAir() {
        return byAir;
    }

    public void setByAir(int byAir) {
        this.byAir = byAir;
    }

    public int getByShip() {
        return byShip;
    }

    public void setByShip(int byShip) {
        this.byShip = byShip;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }
}
