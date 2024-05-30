package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int inventory_id;
    private int merchandiseCode;
    private int inStockQuantity;
    private String unit;
    private int siteCode;

    public Inventory(int inventory_id, int merchandiseCode, int inStockQuantity, String unit, int siteCode) {
        this.inventory_id = inventory_id;
        this.merchandiseCode = merchandiseCode;
        this.inStockQuantity = inStockQuantity;
        this.unit = unit;
        this.siteCode = siteCode;
    }

    public Inventory() {

    }

    public int getInventory_id() {
        return inventory_id;
    }

    public void setInventory_id(int inventory_id) {
        this.inventory_id = inventory_id;
    }

    public int getMerchandiseCode() {
        return merchandiseCode;
    }

    public void setMerchandiseCode(int merchandiseCode) {
        this.merchandiseCode = merchandiseCode;
    }

    public int getInStockQuantity() {
        return inStockQuantity;
    }

    public void setInStockQuantity(int inStockQuantity) {
        this.inStockQuantity = inStockQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(int siteCode) {
        this.siteCode = siteCode;
    }
}
