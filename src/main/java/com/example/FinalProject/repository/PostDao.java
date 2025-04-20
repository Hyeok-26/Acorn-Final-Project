package com.example.FinalProject.repository;

import java.util.List;

import com.example.FinalProject.dto.PostDto;

public interface PostDao {
	public List<PostDto> getList(PostDto dto);
	public int insert(PostDto dto);
	public int delete(long num);
	public int update(PostDto dto);
	public int getCount(PostDto dto);
	//저장할 글 번호를 생성해서 리턴해주는 메소드
	public long getSequence();
	public PostDto getData(long num);
	public PostDto getDetail(PostDto dto);
	public int insertReaded(long num, String sessionId);
	public boolean isReaded(long num, String sessionId);
	public int addViewCount(long num);
	//몇번 글을 읽었는지 정보를 가지고 있는 테이블에서 해당 글의 정보 모두 삭제하기
	public int deleteReaded(long num);
}
