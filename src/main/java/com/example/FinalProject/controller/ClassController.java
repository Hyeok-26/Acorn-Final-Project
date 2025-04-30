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
	// class?userId=${userId}&pageNum=${pageNum}&condition=${condition}&keyword=${keyword}&cdStatus=${cdStatus}
	// class?userId=1&pageNum=1&condition=className&keyword=자바&cdStatus=BEFORE
	@GetMapping("/class")
	public HjClassListDto getClassByStore(@RequestParam(defaultValue = "1") int pageNum, HjClassListDto search) {
		System.out.println(search);
		
		return service.getClassByStore(pageNum, search);
	}	
	
	// 수업 설명 불러오기
	// class/description?classId=101
	@GetMapping("/class/description")
	public List<HjClassDto> getClassDescription(int classId) {
		return service.getClassDescription(classId);
	}	
	
	// 해당지점 수업 개설하기
	//class/add , 추가할정보 전달
	/*
	{
	  "userId": 1,   
	  "className": "자바의신",
	  "cdLecture": "JAVA",
	  "description": "설명블라블라",
	  "teacherId": 1,
	  "applyStartDate": "2025-05-01",
	  "applyEndDate": "2025-05-01",
	  "startDate": "2025-05-01",
	  "endDate": "2025-05-01",
	  "startTime": "20:00",
	  "endTime": "20:00",
	  "maxStudent": 20,
	  "weekday": "1010100",
	  "price": 300000
	}
	*/	
	@PostMapping("/class/add")
	public boolean addClass(@RequestBody HjClassDto dto) {
		return service.addClass(dto);
	};	

	//수업정보수정 
	//class/update, 수정할정보 전달
	/*
	{
	  "classId": 1,   
	  "className": "자바의신",
	  "cdLecture": "JAVA",
	  "description": "설명블라블라",
	  "teacherId": 1,
	  "applyStartDate": "2025-05-01",
	  "applyEndDate": "2025-05-01",
	  "startDate": "2025-05-01",
	  "endDate": "2025-05-01",
	  "startTime": "20:00",
	  "endTime": "20:00",
	  "maxStudent": 20,
	  "weekday": "1010100",
	  "price": 300000
	}	
	*/
	@PatchMapping("/class/update")
	public boolean updateClass(@RequestBody HjClassDto dto) {
		return service.updateClass(dto);
	}
	
	//수업상태값 수정
	//class/sataus, 수정할정보 전달
	/*
	{
	  "classId": 111,   
	  "applyStartDate": "2025-05-01",
	  "applyEndDate": "2025-05-01",
	  "startDate": "2025-05-01",
	  "endDate": "2025-05-01",
	  "maxStudent": 20,
	  "cdStatus":"END"
	}	
	*/	
	@PatchMapping("/class/status")
	public boolean updateClassStatus(@RequestBody HjClassDto dto) {
		return service.updateClassStatus(dto);
	}	
	
	// 수업 강의분류 가져오기
	// class/lecture
	@GetMapping("/class/lecture")
	public List<HjLectureDto> getClassLecture() {
		return service.getClassLecture();
	};	
	

	
}
