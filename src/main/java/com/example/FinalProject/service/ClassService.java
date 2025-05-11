package com.example.FinalProject.service;

import java.util.List;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.StudentClassDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.dto.ClassCheckDto;
import com.example.FinalProject.dto.HCPostDto;

public interface ClassService {
	public HjClassListDto getClassByStore(int pageNum, HjClassListDto search);
	public HjClassDto getClassDescription(int classId);
	public boolean addClass(HjClassDto dto);
	public boolean updateClass(HjClassDto dto);
	public boolean updateClassStatus(HjClassDto dto);
	public List<HjLectureDto> getClassLecture();
	public HjClassDto getClassdetail(int classId);
	
	public List<HjClassDto> getAllClassList(int userId);
	//
	public List<StudentClassDto> checkClassOverlap(ClassCheckDto dto); // 중복 체크
	public boolean insertStudentClass(StudentClassDto dto); // 학생 수업 추가
	public boolean deleteStudentClass(StudentClassDto dto); // 학생 수업 삭제
	public List<StudentDto> getClassStudentList(int classId);
	public List<StudentDto> getAllStudentList(int userId);
	
	
}
