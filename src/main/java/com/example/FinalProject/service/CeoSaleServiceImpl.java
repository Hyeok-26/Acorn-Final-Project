package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.mapper.CeoSaleMapper;

@Service
public class CeoSaleServiceImpl implements CeoSaleService{
	
	@Autowired private CeoSaleMapper ceoSaleMapper;

	@Override
	public int insertEtcProfit(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.insertEtcProfit(ceoSaleDto);
	}

	@Override
	public int insertEtcProfitSelf(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.insertEtcProfitSelf(ceoSaleDto);
	}

	@Override
	public List<TWCeoSaleDto> getList() {
		return ceoSaleMapper.getList();
	}

	@Override
	public int update(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.update(ceoSaleDto);
	}

}
