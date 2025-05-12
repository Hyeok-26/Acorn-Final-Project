package com.example.FinalProject.service;

import java.util.List;
import java.util.Map;


public interface DashBoardService {
	
	// Ceo DashBoard
	int getStudentsAll();
	int getUserAll();
	int getLastYearCeoOrderSale();
	List<Map<String, Object>> getLastYearMonthlySales();
	List<Map<String, Object>> getPopularLectureTop3();
}
