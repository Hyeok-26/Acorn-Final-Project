package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;

public interface CeoSaleService {
	int insertEtcProfit(TWCeoSaleDto ceoSaleDto);
	int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto);
	int update(TWCeoSaleDto ceoSaleDto);
	TWCeoSalePageDto getList(TWCeoSalePageDto dto);
	int getTotalRow();
}
