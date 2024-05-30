package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class Orders {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
    private int order_id;
    private int merchandise_code;
    private String unit;
    private int quantity;
    private Date delivery_date;

    public Orders(int order_id, int merchandise_code, String unit, int quantity, Date delivery_date) {
        this.order_id = order_id;
        this.merchandise_code = merchandise_code;
        this.unit = unit;
        this.quantity = quantity;
        this.delivery_date = delivery_date;
    }

    public Orders() {

    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public Date getDelivery_date() {
        return delivery_date;
    }

    public void setDelivery_date(Date delivery_date) {
        this.delivery_date = delivery_date;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getMerchandise_code() {
        return merchandise_code;
    }

    public void setMerchandise_code(int merchandise_code) {
        this.merchandise_code = merchandise_code;
    }
}
