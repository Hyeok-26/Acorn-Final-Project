package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;
import com.example.FinalProject.service.CeoSaleService;

@RestController
public class CeoSaleController {
	
	@Autowired private CeoSaleService ceoSaleService;
	
	@GetMapping("/ceosale")
	public List<TWCeoSaleDto> getList(TWCeoSalePageDto dto) {
		return ceoSaleService.getList(dto);
	}
	
	@PostMapping("/ceosale") 
	public int insertEtcProfit(TWCeoSaleDto dto) {
		return ceoSaleService.insertEtcProfit(dto);
	}
	
	@PutMapping("/ceosale/{ceoSaleId}")
	public int update(TWCeoSaleDto dto) {
		return ceoSaleService.update(dto);
	}
	
	@PostMapping("/ceosaleself")
	public int insertEtcProfitSelf(TWCeoSaleDto dto) {
		return ceoSaleService.insertEtcProfitSelf(dto);
	}
	
}
