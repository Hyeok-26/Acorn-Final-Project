package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.PostDto;

@Mapper
public interface ClassMapper {
	List<HjClassDto> getClassByStore(HjClassListDto dto);
	int getCount(HjClassListDto dto);
	HjClassDto getClassDescription(int classId);
	boolean addClass(HjClassDto dto);
	boolean updateClass(HjClassDto dto);
	boolean updateClassStatus(HjClassDto dto);
	List<HjLectureDto> getClassLecture();
	HjClassDto getClassdetail(int classId);
}
