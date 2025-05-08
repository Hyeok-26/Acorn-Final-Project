package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.HjTeacherDto;
import com.example.FinalProject.service.ClassService;

@RestController
public class ClassController {
	@Autowired private ClassService service;
	
	// 테스트용
	@GetMapping("/class/ping")
	public String ping() {
		return "pong";
	}	
	
	// 해당지점 수업 리스트 불러오기
	@GetMapping("/class")
	public HjClassListDto getClassByStore(@RequestParam(defaultValue = "1") int pageNum, HjClassListDto search) {
		
		return service.getClassByStore(pageNum, search);
	}	
	
	// 수업 설명 불러오기
	@GetMapping("/class/description")
	public HjClassDto getClassDescription(int classId) {
		return service.getClassDescription(classId);
	}	
	
	//수업 상세내용 불러오기
	@GetMapping("/class/detail")
	public HjClassDto getClassdetail(int classId) {
		return service.getClassdetail(classId);
	}		
	
	// 해당지점 수업 개설하기
	@PostMapping("/class/add")
	public boolean addClass(@RequestBody HjClassDto dto) {
		return service.addClass(dto);
	};	

	//수업정보수정 
	@PatchMapping("/class/update")
	public boolean updateClass(@RequestBody HjClassDto dto) {
		return service.updateClass(dto);
	}
	
	//수업상태값 수정
	@PatchMapping("/class/status")
	public boolean updateClassStatus(@RequestBody HjClassDto dto) {
		return service.updateClassStatus(dto);
	}	
	
	// 수업 강의분류 가져오기
	@GetMapping("/class/lecture")
	public List<HjLectureDto> getClassLecture() {
		return service.getClassLecture();
	};	
	

	
}
