package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Merchandise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int merchandise_code;

    private String name;
    private String unit;

    public Merchandise(int merchandise_code, String name, String unit) {
        this.merchandise_code = merchandise_code;
        this.name = name;
        this.unit = unit;
    }

    public Merchandise() {

    }

    public int getMerchandise_code() {
        return merchandise_code;
    }

    public void setMerchandise_code(int merchandise_code) {
        this.merchandise_code = merchandise_code;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
