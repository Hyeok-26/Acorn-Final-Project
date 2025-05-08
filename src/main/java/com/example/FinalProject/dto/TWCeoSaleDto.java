package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("TWCeoSaleDto")
public class TWCeoSaleDto {
    private int ceoSaleId;
    private int userId;
    private String creDate;
    private String editDate;
    private String saleName;
    private int price;
    private String cdAcode;
    private String cdBcode;
    private String auto;
}
