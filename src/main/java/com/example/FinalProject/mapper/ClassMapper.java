package com.example.FinalProject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.StudentClassDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.ClassCheckDto;
import com.example.FinalProject.dto.HCPostDto;

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
	
	List<HjClassDto> getClassList(int userId);
	List<StudentClassDto> checkClassStudent(ClassCheckDto dto);
	boolean insertStudentClass(StudentClassDto dto);
	boolean deleteStudentClass(StudentClassDto dto);
	List<StudentDto> getClassStudentList(int classId);
	List<StudentDto> getAllStudentList(int userId);
}
