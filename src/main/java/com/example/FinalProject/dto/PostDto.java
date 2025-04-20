package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("postDto")	//mapper xml 에서 PostDto type 을 편하게 선언하기 위해
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PostDto {
	private long num;
	private String writer;
	private String title;
	private String content;
	private int viewCount;
	private String createdAt;
	private String updatedAt;
	//페이징 처리할때 필요한 필드
	private int startRowNum;
	private int endRowNum;
	private String condition; //검색 조건 writer 또는 title 또는 title+content
	private String keyword; //검색 키워드
	private long prevNum; //이전 글의 글 번호
	private long nextNum; //다음 글의 글 번호
}
