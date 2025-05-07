package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.HCPostDto;

public interface ClassService {
	public HjClassListDto getClassByStore(int pageNum, HjClassListDto search);
	public List<HjClassDto> getClassDescription(int classId);
	public boolean addClass(HjClassDto dto);
	public boolean updateClass(HjClassDto dto);
	public boolean updateClassStatus(HjClassDto dto);
	public List<HjLectureDto> getClassLecture();
	
	
	
	
}
