package com.example.FinalProject.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.TeacherClassHistoryDto;
import com.example.FinalProject.dto.TeacherDto;
import com.example.FinalProject.dto.TeacherListDto;
import com.example.FinalProject.dto.TeacherSearchPageDto;
import com.example.FinalProject.dto.TeacherSearchRequestDto;
import com.example.FinalProject.service.TeacherService;

@RestController
public class TeacherController {
	
	@Autowired TeacherService teacherService;
	
	//테스트용
	@GetMapping("/teachers/ping")
	public String ping() {
		return "pong";
	}

	// teachers
	@PostMapping("/teachers")
	public String insertTeacher(@RequestBody TeacherDto dto) {
		teacherService.insertTeacher(dto);
		return "success!";
	}
	
	// teachers/1
	@PatchMapping("/teachers/{teacherId}")
	public String updateTeacher(@PathVariable int teacherId, @RequestBody TeacherDto dto) {
		dto.setTeacherId(teacherId);
		teacherService.updateTeacher(dto);
		return "success!";
	}

	// teachers/class?teacherId=1
	@GetMapping("/teachers/class")
	public List<TeacherClassHistoryDto> getAllClasses(@RequestParam int teacherId){
		return teacherService.getAllClasses(teacherId);
	}
	
	// teachers?userId=01&state=WORK&condition=CLASS&keyword=%EA%B9%80%EC%B2%A0%EC%88%98
	/*
	 * 	특정 지점에 해당하는 userId 전달
	 * 	pageNum 이 파라미터로 넘어오지 않으면 pageNum 의 default 값은 1로 설정
	 * 	state 는 "WORK", "T_QUIT", "WHOLE" 중 하나
	 * 	condition 과 keyword 는 검색 조건으로 넘어오는 값이 없으면 null
	 */
	@GetMapping("/teachers")
	public TeacherListDto getResult(@RequestParam int userId,
			@RequestParam(defaultValue = "1") int pageNum,
			@RequestParam(defaultValue = "WHOLE") String state,
		    @RequestParam(required = false) String condition,
		    @RequestParam(required = false) String keyword){
		TeacherSearchPageDto dto = new TeacherSearchPageDto();
		TeacherSearchRequestDto search = new TeacherSearchRequestDto(userId, state, condition, keyword);
		dto.setSearch(search);
		return teacherService.getResult(pageNum, dto);
	}
}