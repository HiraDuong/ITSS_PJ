package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class OrderList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int orderListId;
    private int siteCode;
    private int merchandiseCode;
    private int quantity;
    private String unit;
    private String deliveryMeans;
    private int status = 0;

    public OrderList(int orderListId, int merchandiseCode, int siteCode, int quantity, String unit, String deliveryMeans, int status) {
        this.orderListId = orderListId;
        this.merchandiseCode = merchandiseCode;
        this.siteCode = siteCode;
        this.quantity = quantity;
        this.unit = unit;
        this.deliveryMeans = deliveryMeans;
        this.status = status;
    }

    public OrderList() {

    }

    public int getOrderListId() {
        return orderListId;
    }

    public void setOrderListId(int orderListId) {
        this.orderListId = orderListId;
    }

    public int getMerchandiseCode() {
        return merchandiseCode;
    }

    public void setMerchandiseCode(int merchandiseCode) {
        this.merchandiseCode = merchandiseCode;
    }

    public int getSiteCode() {
        return siteCode;
    }

    public void setSiteCode(int siteCode) {
        this.siteCode = siteCode;
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

    public String getDeliveryMeans() {
        return deliveryMeans;
    }

    public void setDeliveryMeans(String deliveryMeans) {
        this.deliveryMeans = deliveryMeans;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
