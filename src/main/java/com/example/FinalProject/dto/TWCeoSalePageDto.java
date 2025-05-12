package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.Data;

@Data
@Alias("TWCeoSalePageDto")
public class TWCeoSalePageDto {
	private int pageNum;
	private int startRowNum;
	private int endRowNum;

	private int totalRow;
	private int totalPageCount;
	private int startPageNum;
	private int endPageNum;
}
