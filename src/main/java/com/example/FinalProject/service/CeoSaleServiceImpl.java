package com.example.FinalProject.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.TWCeoSaleDto;
import com.example.FinalProject.dto.TWCeoSalePageDto;
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
	public List<TWCeoSaleDto> getList(TWCeoSalePageDto dto) {
		int pageNum = dto.getPageNum();
		int totalRow = ceoSaleMapper.getTotalRow();
		
		 int rowPerPage = 10;
	     int pageCountPerGroup = 5;
	     int startRowNum = (pageNum - 1) * rowPerPage + 1;
	     int endRowNum = pageNum * rowPerPage;
	     int totalPageCount = (int) Math.ceil((double) totalRow / rowPerPage);
	     int currentGroup = (int) Math.ceil((double) pageNum / pageCountPerGroup);
	     int startPageNum = (currentGroup - 1) * pageCountPerGroup + 1;
	     int endPageNum = Math.min(startPageNum + pageCountPerGroup - 1, totalPageCount);
	     
	     dto.setStartRowNum(startRowNum);
	     dto.setEndRowNum(endRowNum);
	     dto.setTotalRow(totalRow);
	     dto.setTotalPageCount(totalPageCount);
	     dto.setStartPageNum(startPageNum);
	     dto.setEndPageNum(endPageNum);
		
		return ceoSaleMapper.getList(dto);
	}

	@Override
	public int update(TWCeoSaleDto ceoSaleDto) {
		return ceoSaleMapper.update(ceoSaleDto);
	}

}
