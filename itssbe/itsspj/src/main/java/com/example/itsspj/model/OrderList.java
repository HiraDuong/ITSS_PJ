package com.example.itsspj.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

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
    private Date deliveryDate;
    private int status = 0;

    public OrderList(int status, int orderListId, int siteCode, int merchandiseCode, int quantity, String unit, String deliveryMeans, Date deliveryDate) {
        this.status = status;
        this.orderListId = orderListId;
        this.siteCode = siteCode;
        this.merchandiseCode = merchandiseCode;
        this.quantity = quantity;
        this.unit = unit;
        this.deliveryMeans = deliveryMeans;
        this.deliveryDate = deliveryDate;
    }

    public OrderList() {

    }

    public Date getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Date deliveryDate) {
        this.deliveryDate = deliveryDate;
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
