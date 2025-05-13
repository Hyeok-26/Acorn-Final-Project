package com.example.FinalProject.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;

@Mapper
public interface CeoSaleMapper {
    int insertEtcProfit(TWCeoSaleDto ceoSaleDto);
    int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto);
    int update(TWCeoSaleDto ceoSaleDto);
    List<TWCeoSaleDto> getList(TWCeoSalePageDto dto);
    int getTotalRow();
    List<Map<String, Object>> getListGraph(int year);
    List<Integer> getAvailableYears();
}

