package com.example.FinalProject.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.FinalProject.dto.CommentDto;
import com.example.FinalProject.dto.CommentListRequest;
import com.example.FinalProject.dto.PostDto;
import com.example.FinalProject.dto.PostListDto;
import com.example.FinalProject.repository.CommentDao;
import com.example.FinalProject.repository.PostDao;

@Service
public class PostServiceImpl implements PostService{
	
	//한 페이지에 몇개씩 표시할 것인지
	final int PAGE_ROW_COUNT=5;
	//하단 페이지를 몇개씩 표시할 것인지
	final int PAGE_DISPLAY_COUNT=5;
	
	//서비스는 여러가지 dao 에 의존성이 있을수 있다. 
	@Autowired private PostDao postDao;
	@Autowired private CommentDao commentDao;
		
	/*
	 *  pageNum 과 검색 조건, 키워드가 담겨 있을수 있는 PostDto 를 전달하면
	 *  해당 글 목록을 리턴하는 메소드 
	 */
	@Override
	public PostListDto getPosts(int pageNum, PostDto search) {
		
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;
		
		//하단 시작 페이지 번호 
		int startPageNum = 1 + ((pageNum-1)/PAGE_DISPLAY_COUNT)*PAGE_DISPLAY_COUNT;
		//하단 끝 페이지 번호
		int endPageNum=startPageNum+PAGE_DISPLAY_COUNT-1;
		//전체 글의 갯수
		int totalRow=postDao.getCount(search);
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
		List<PostDto> list=postDao.getList(search);
		
		String findQuery="";
		if(search.getKeyword() != null) {
			findQuery="&keyword="+search.getKeyword()+"&condition="+search.getCondition();
		}
		//글 목록 페이지에서 필요한 정보를 모두 PostListDto 에 담는다.
		PostListDto dto=PostListDto.builder()
				.list(list)
				.startPageNum(startPageNum)
				.endPageNum(endPageNum)
				.totalPageCount(totalPageCount)
				.pageNum(pageNum)
				.totalRow(totalRow)
				.findQuery(findQuery)
				.condition(search.getCondition())
				.keyword(search.getKeyword())
				.build();
				
		return dto;
	}

	@Override
	public long createPost(PostDto dto) {
		//글 작성자를 얻어내서 dto 에 담는다.
		String writer=SecurityContextHolder.getContext().getAuthentication().getName();
		dto.setWriter(writer);
		//저장할 글번호를 미리 얻어온다.
		long num=postDao.getSequence();
		//dto 에 글번호를 넣은 다음 DB 에 저장한다
		dto.setNum(num);
		postDao.insert(dto);
		//글번호를 리턴해준다.
		return num;
	}

	@Override
	public PostDto getByNum(long num) {
		
		return postDao.getData(num);
	}

	@Override
	public PostDto getDetail(PostDto dto) {
		
		return postDao.getDetail(dto);
	}

	@Override
	public void updatePost(PostDto dto) {
		
		postDao.update(dto);
	}

	@Override
	public void deletePost(long num) {
		//글의 작성자와 로그인 된 userName 과 다르면 ExceptionController 에서 처리하게 한다
		/*
		 * String writer = postDao.getData(num).getWriter(); String userName =
		 * SecurityContextHolder.getContext().getAuthentication().getName();
		 * if(!writer.equals(userName)) { throw new DeniedException("요청이 거부 되었습니다"); }
		 */
		
		//posts 의 num 을 참조하고 있는 자식 레코드를 미리 삭제
		postDao.deleteReaded(num);
		//글 삭제
		postDao.delete(num);
	}

	@Override
	public void manageViewCount(long num, String sessionId) {
		//이미 읽었는지 여부를 얻어낸다 
		boolean isReaded=postDao.isReaded(num, sessionId);
		if(!isReaded){
			//글 조회수도 1 증가 시킨다
			postDao.addViewCount(num);
			//이미 읽었다고 표시한다. 
			postDao.insertReaded(num, sessionId);
		}
	}

	@Override
	public void createComment(CommentDto dto) {
		//글 작성자
		String writer=SecurityContextHolder.getContext().getAuthentication().getName();
		//저장할 댓글의 번호 미리 얻어내기 
		long num=commentDao.getSequence();
		long parentNum=dto.getParentNum();
		//만일 원글의 댓글이면 
		if(parentNum == 0) {
			//댓글의 글번호가 parentNum 이 된다. 
			parentNum=num;
		}
		//CommentDto 에 추가 정보를 담는다
		dto.setNum(num);
		dto.setWriter(writer);
		dto.setParentNum(parentNum);
		//dao 를 이용해서 DB 에 저장 
		commentDao.insert(dto);
	}

	@Override
	public void updateComment(CommentDto dto) {
		commentDao.update(dto);
	}

	@Override
	public void deleteComment(long num) {
		commentDao.delete(num);
	}

	@Override
	public Map<String, Object> getComments(CommentListRequest clr) {
		CommentDto dto=new CommentDto();
		dto.setPostNum(clr.getPostNum());
		/*
		[ 댓글 페이징 처리에 관련된 로직 ]
		*/
		
		//한 페이지에 댓글을 몇개씩 표시할 것인지
		final int PAGE_ROW_COUNT=10;
		
		int pageNum=clr.getPageNum();
		//보여줄 페이지의 시작 ROWNUM
		int startRowNum=1+(pageNum-1)*PAGE_ROW_COUNT;
		//보여줄 페이지의 끝 ROWNUM
		int endRowNum=pageNum*PAGE_ROW_COUNT;
		//계산된 값을 dto 에 담는다
		dto.setStartRowNum(startRowNum);
		dto.setEndRowNum(endRowNum);
		
		//전체 댓글의 갯수
		int totalRow=commentDao.getCount(clr.getPostNum());
		//전체 페이지의 갯수 구하기
		int totalPageCount=(int)Math.ceil(totalRow/(double)PAGE_ROW_COUNT);
		
		//pageNum 에 해당하는 댓글 목록을 얻어낸다.
		List<CommentDto> list=commentDao.getList(dto);
		//json 을 응답할때 필요한 Map 객체를 구성한다.
		Map<String, Object> map=new HashMap<>();
		map.put("list", list);
		map.put("totalPageCount", totalPageCount);
		
		return map;
	}
}