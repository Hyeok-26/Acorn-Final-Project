package com.example.FinalProject.service;

import java.util.Map;

import com.example.FinalProject.dto.CommentDto;
import com.example.FinalProject.dto.CommentListRequest;
import com.example.FinalProject.dto.PostDto;
import com.example.FinalProject.dto.PostListDto;

public interface PostService {
	public PostListDto getPosts(int pageNum, PostDto search);
	public long createPost(PostDto dto);
	public PostDto getByNum(long num);
	public PostDto getDetail(PostDto dto);
	public void updatePost(PostDto dto);
	public void deletePost(long num);
	public void manageViewCount(long num, String sessionId);
	
	public void createComment(CommentDto dto);
	public void updateComment(CommentDto dto);
	public void deleteComment(long num);
	public Map <String, Object> getComments(CommentListRequest clr);
}
