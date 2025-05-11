package com.example.FinalProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.LoginDto;
import com.example.FinalProject.service.LoginService;

@RestController
public class LoginController {
	@Autowired private LoginService loginService;

	//품목 리스트
	@GetMapping("/login")
    public LoginDto list( @RequestParam(required = true) String userId,
    		 @RequestParam(required = true) String userPw) {
     
		LoginDto loginDto = new LoginDto();
		loginDto.setId(userId);
		loginDto.setPw(userPw);
		return loginService.login(loginDto);
    }
}
