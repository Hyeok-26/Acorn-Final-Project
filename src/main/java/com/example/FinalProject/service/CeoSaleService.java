package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.TWCeoSaleDto;

public interface CeoSaleService {
	int insertEtcProfit(TWCeoSaleDto ceoSaleDto);
	int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto);
	int update(TWCeoSaleDto ceoSaleDto);
	List<TWCeoSaleDto> getList();
}
