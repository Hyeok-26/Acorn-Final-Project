package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HCCodeDto;

public interface CodeService {
	public List<HCCodeDto> getAcodeList();
	public void saveAcode(HCCodeDto dto);
	public void hideAcode(String acode);
	
	public List<HCCodeDto> getBcodeList(String acode);
	public void saveBcode(HCCodeDto dto);
	public void hideBcode(String bcode);
}