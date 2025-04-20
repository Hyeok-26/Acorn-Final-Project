package com.example.FinalProject.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.FinalProject.dto.CommentDto;
import com.example.FinalProject.dto.CommentListRequest;
import com.example.FinalProject.dto.PostDto;
import com.example.FinalProject.dto.PostListDto;
import com.example.FinalProject.service.PostService;

@RestController
public class PostController {
	
	@Autowired private PostService service;
	
	@PatchMapping("/posts/{num}/comments/{commentNum}")
	public Map<String, Boolean> updateComment(@RequestBody CommentDto dto){
		//dto 에는 댓글의 글 번호와 댓글의 내용이 들어 있다.
		service.updateComment(dto);
		return Map.of("isSuccess", true);
	}
	
	@DeleteMapping("/posts/{num}/comments/{commentNum}") 
	public Map<String, Boolean> deleteComment(@PathVariable("commentNum") long num){
		//해당 댓글 삭제하기
		service.deleteComment(num);
		return Map.of("isSuccess", true);
	}
	
	@GetMapping("/posts/{num}/comments")
	public Map<String, Object> commentList(@PathVariable("num") long num, int pageNum){
		//CommentListRequest 에 필요한 정보를 담고
		CommentListRequest clr=new CommentListRequest();
		clr.setPostNum(num);
		clr.setPageNum(pageNum);
		//서비스를 이용해서 댓글 목록 정보를 얻어내서 응답한다.
		return service.getComments(clr);
	}
	
	//댓글 저장 요청처리
	@PostMapping("/posts/{num}/comments")
	public CommentDto saveComment(@PathVariable(value="num") long num , 
			@RequestBody CommentDto dto) {
		//dto 에 원글의 글번호 담기
		dto.setPostNum(num);
		//서비스를 이용해서 댓글 저장
		service.createComment(dto);
		return dto;
	}
	
	//글 삭제 요청 처리
	@DeleteMapping("/posts/{num}")
	public PostDto delete(@PathVariable(value = "num") long num) {
		PostDto dto=service.getByNum(num);
		//서비스 객체를 이용해서 삭제하기 
		service.deletePost(num);
		//삭제된 글 정보를 리턴하기 
		return dto;
	}
	
	//글 수정 반영 요청처리
	@PatchMapping("/posts/{num}")
	public PostDto update(@PathVariable(value = "num") long num , @RequestBody PostDto dto) {
		//글번호를 dto 에 담는다.
		dto.setNum(num);
		//서비스를 이용해서 수정반영 
		service.updatePost(dto);
		//수정된 글정보 리턴 
		return dto;
	}
	
	
	@PostMapping("/posts")
	public Map<String, Object> save(@RequestBody PostDto dto){
		//새글을 저장하고 글번호를 리턴 받는다.
		long num=service.createPost(dto);
		
		return Map.of("num", num);
	}
	/*
	 *  dto 에 글번호만 있는 경우도 있고 
	 *  검색과 관련된 정보도 같이 있을수 있다. 
	 */
	@GetMapping("/posts/{num}")
	public PostDto view(@PathVariable(name = "num") long num, PostDto dto) {
		//글번호는 경로 변수에, 검색키워드가 있다면 해당 정보는 PostDto 객체에 담겨 있다.
		
		//글번호를 dto 에 담는다.
		dto.setNum(num);
		//글 자세한 정보를 얻어와서 
		PostDto resultDto=service.getDetail(dto);
		//응답한다.
		return resultDto;
	}
	
	/*
	 *  pageNum 이 파라미터로 넘어오지 않으면 pageNum 의 default 값은 1 로 설정 
	 *  검색 키워드도 파라미터로 넘어오면 PostDto 의 condition 과 keyword 가 null 이 아니다 
	 *  검색 키워드가 넘어오지않으면 PostDto 의 condition 과 keyword 는 null 이다 
	 */
	@GetMapping("/posts")
	public PostListDto list(@RequestParam(defaultValue = "1") int pageNum, PostDto search) {
		//글 목록과 검색 키워드 관련 정보가 들어 있는 PostListDto
		PostListDto dto=service.getPosts(pageNum, search);
		//JSON 문자열이 응답 되도록 dto 를 리턴한다. 
		return dto;
	}
}