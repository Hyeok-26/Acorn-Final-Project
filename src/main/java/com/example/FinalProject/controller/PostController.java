package com.example.FinalProject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.HCPostDto;
import com.example.FinalProject.dto.HCPostListDto;
import com.example.FinalProject.service.PostService;

@RestController
public class PostController {
	

	@Autowired private PostService service;
	//목록 
	@GetMapping("/posts")
	public HCPostListDto list(@RequestParam(defaultValue = "1") int pageNum, HCPostDto search) {
		
		HCPostListDto dto = service.getlist(pageNum, search);
		
		return dto;
	}
	//글 자세히 보기
	@GetMapping("/posts/{postId}")
	 public HCPostDto detail(@PathVariable int postId) {
        return service.getPostData(postId);
    }
	
	//글 추가
	@PostMapping("/posts")
	 public ResponseEntity<String> insert(@RequestBody HCPostDto dto) {
        service.insertPost(dto);
        return ResponseEntity.ok("등록 완료");
    }
	//글 수정
	@PatchMapping("/posts/{postId}")
	public ResponseEntity<String> update(@PathVariable int postId, @RequestBody HCPostDto dto) {
	    dto.setPostId(postId);
	    service.updatePost(dto);
	    return ResponseEntity.ok("수정 완료");
	}

	//글 삭제
	@DeleteMapping("/posts/{postId}")
	public ResponseEntity<String> delete(@PathVariable int postId) {
	    service.deletePost(postId);
	    return ResponseEntity.ok("삭제 완료");
	}
}