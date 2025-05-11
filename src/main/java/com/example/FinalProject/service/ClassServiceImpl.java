package com.example.FinalProject.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.FinalProject.dto.ClassCheckDto;
import com.example.FinalProject.dto.ConflictClassDto;
import com.example.FinalProject.dto.HjClassDto;
import com.example.FinalProject.dto.HjClassListDto;
import com.example.FinalProject.dto.HjLectureDto;
import com.example.FinalProject.dto.SelectableStudentDto;
import com.example.FinalProject.dto.StudentClassDto;
import com.example.FinalProject.dto.StudentDto;
import com.example.FinalProject.mapper.AdminSalesMapper;
import com.example.FinalProject.mapper.ClassMapper;

@Service
public class ClassServiceImpl implements ClassService {
	
	//한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT=10;
	//하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT=5;
	
	
	@Autowired private ClassMapper classMapper;
	@Autowired private AdminSalesMapper salesmapper;


	@Override
	public HjClassListDto getClassByStore(int pageNum, HjClassListDto search) {

		
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;

		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pageNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		//전체 글의 갯수
		int totalRow=classMapper.getCount(search);
		

		
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		//끝 페이지 번호가 이미 전체 페이지 갯수보다 크게 계산되었다면 잘못된 값이다.
		if(endPageNum > totalPageCount){
			endPageNum=totalPageCount; //보정해 준다. 
		}	
		
		// startRowNum 과 endRowNum 을 PostDto 객체에 담아서
		search.setStartRowNum(startRowNum);
		search.setEndRowNum(endRowNum);
		//글 목록 얻어오기
		List<HjClassDto> list=classMapper.getClassByStore(search);
		
		String findQuery="";
		if(search.getKeyword() != null) {
			findQuery="&condition="+search.getCondition()+"&keyword="+search.getKeyword();
			
		}
		//글 목록 페이지에서 필요한 정보를 모두 PostListDto 에 담는다.
		HjClassListDto dto=HjClassListDto.builder()
				.list(list)
				.startPageNum(startPageNum)
				.endPageNum(endPageNum)
				.totalPageCount(totalPageCount)
				.pageNum(pageNum)
				.totalRow(totalRow)
				.findQuery(findQuery)
				.condition(search.getCondition())
				.keyword(search.getKeyword())
				.cdStatus(search.getCdStatus())
				.build();
				
		return dto;
	}


	@Override
	public HjClassDto getClassDescription(int classId) {
		return classMapper.getClassDescription(classId);	
	}


	@Override
	public boolean addClass(HjClassDto dto) {
		try {
			return classMapper.addClass(dto);
		}catch(Exception e) {
			return false;
		}
		
	}


	@Override
	public boolean updateClass(HjClassDto dto) {
		try {
			return classMapper.updateClass(dto);
		}catch(Exception e) {
			return false;
		}
		
	}
	
	//예외처리
	public static class SalesRegisterFailException extends DataAccessException{

		public SalesRegisterFailException(String msg) {
			super(msg);
		}
	}

	//매출+수업변경 
	@Override
	@Transactional
	public boolean updateClassStatus(HjClassDto dto) {
		
		
			String cdStatus = dto.getCdStatus();
	        if ("START".equals(cdStatus)) {
	            // START일 경우: 상태 업데이트 + 매출 등록
	    		boolean adminResult = salesmapper.insertClsProfitToAdmin(dto);
	    		boolean updateResult = classMapper.updateClassStatus(dto);
	            if (adminResult && updateResult ) {
	                return true;
	            } else {
	                throw new SalesRegisterFailException("개강 및 매출테이블 등록에 실패하였습니다");
	            }
	        } else {
	            // START 아닐 경우: 상태 업데이트만
	    		boolean updateResult = classMapper.updateClassStatus(dto);
	    		return updateResult;
	        }
	}


	@Override
	public List<HjLectureDto> getClassLecture() {
		return classMapper.getClassLecture();
	}


	@Override
	public HjClassDto getClassdetail(int classId) {
		return classMapper.getClassdetail(classId);	
	}

	@Override
	public List<HjClassDto> getAllClassList(int userId) {
		// TODO Auto-generated method stub
		return classMapper.getClassList(userId);
	}
	

	@Override
	public List<StudentDto> getClassStudentList(int classId) {
		// TODO Auto-generated method stub
		return classMapper.getClassStudentList(classId);
	}


	@Override
	public List<StudentDto> getAllStudentList(int userId) {
		// TODO Auto-generated method stub
		return classMapper.getAllStudentList(userId);
	}

	@Override
	public List<SelectableStudentDto> checkStudentsWithConflict(int classId, int userId) {
	    HjClassDto targetClass = classMapper.getClassdetail(classId);
	    List<StudentDto> allStudents = classMapper.getAllStudentList(userId);

	    return allStudents.stream().map(student -> {
	        SelectableStudentDto dto = new SelectableStudentDto();
	        dto.setStudentId(student.getStudentId());
	        dto.setName(student.getName());
	        dto.setPhone(student.getPhone());

	        List<ConflictClassDto> conflicts = classMapper.getStudentSchedules(student.getStudentId(), classId);

	        // 1. 날짜가 겹치는 conflict 만 필터링
	        List<ConflictClassDto> dateOverlaps = conflicts.stream()
	            .filter(conflict -> !(conflict.getEndDate().compareTo(targetClass.getStartDate()) <= 0 ||
	                                  conflict.getStartDate().compareTo(targetClass.getEndDate()) >= 0))
	            .collect(Collectors.toList());

	        // 2. 위에서 날짜가 겹치는 것들 중 요일/시간 겹침이 있는지 확인
	        Optional<ConflictClassDto> conflictFound = dateOverlaps.stream()
	            .filter(conflict -> conflict.getWeekday().equals(targetClass.getWeekday()) &&
	                                !(conflict.getEndTime().compareTo(targetClass.getStartTime()) <= 0 ||
	                                  conflict.getStartTime().compareTo(targetClass.getEndTime()) >= 0))
	            .findFirst();

	        if (conflictFound.isPresent()) {
	            dto.setSelectable(false);
	            ConflictClassDto conflict = conflictFound.get();
	            String reason = String.format("%s %s~%s 수업과 중복됨",
	                    conflict.getWeekday(), conflict.getStartTime(), conflict.getEndTime());
	            dto.setConflictReason(reason);
	        } else {
	            dto.setSelectable(true);
	        }

	        return dto;
	    }).collect(Collectors.toList());
	}


	    @Override
	    public void addStudentsToClass(int classId, List<Integer> studentIds) {
	        if (studentIds == null || studentIds.isEmpty()) return ;
	        classMapper.insertStudentClass(classId, studentIds);
	    }

	    @Override
	    public void removeStudentFromClass(int classId, int studentId) {
	        classMapper.deleteStudentClass(classId, studentId);
	    }

	
	
	
	
}
