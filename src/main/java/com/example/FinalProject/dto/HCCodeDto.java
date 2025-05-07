package com.example.FinalProject.dto;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Alias("CodeDto")//mapper xml 에서 PostDto type 을 편하게 선언하기 위해
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class HCCodeDto {
	private String acode;
	private String aname;
	private String bcode;
	private String bname;
}
