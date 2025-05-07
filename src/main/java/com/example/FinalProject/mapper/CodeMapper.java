package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.example.FinalProject.dto.HCCodeDto;

@Mapper
public interface CodeMapper {
	public List<HCCodeDto> getAcodeList();
	public int insertAcode(HCCodeDto dto);
	public int hideAcode(@Param("acode") String acode);
	
	public List<HCCodeDto> getBcodeList(HCCodeDto dto);
	public int insertBcode(HCCodeDto dto);
	public int hideBcode(@Param("bcode") String bcode);
}