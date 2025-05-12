package com.example.FinalProject.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface DashBoardMapper {
	
	// Ceo DashBoard
	int getStudentsAll();
	int getUserAll();
	int getLastYearCeoOrderSale(int lastyear);
	List<Map<String, Object>> getLastYearMonthlySales(int lastYear);
	List<Map<String, Object>> getPopularLectureTop3();
	
//	// Admin DashBoard
//	int getStudentByUserId(int userId);
//	int getTeacherByUserId(int userId);
//	int getClassByUserId(int userId);
//	int getLastYearSaleByUserId(@Param("year") int year, int userId);
//	int getPopularClassTop5(int userId);
}
