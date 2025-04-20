package com.example.FinalProject.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.FinalProject.dto.PostDto;

//bean 으로 만들기 위한 어노테이션
@Repository
public class PostDaoImpl implements PostDao{
	
	//의존 객체 주입
	@Autowired private SqlSession session;
	
	@Override
	public List<PostDto> getList(PostDto dto) {
		
		return session.selectList("post.getList", dto);
	}

	@Override
	public int insert(PostDto dto) {
		
		return session.insert("post.insert", dto);
	}

	@Override
	public int delete(long num) {
			
		return session.delete("post.delete", num);
	}

	@Override
	public int update(PostDto dto) {
		
		return session.update("post.update", dto);
	}

	@Override
	public int getCount(PostDto dto) {
		//resultType 은 int 이다
		return session.selectOne("post.getCount", dto);
	}

	@Override
	public long getSequence() {
		
		return session.selectOne("post.getSequence");
	}

	@Override
	public PostDto getData(long num) {
		
		return session.selectOne("post.getData", num);
	}

	@Override
	public PostDto getDetail(PostDto dto) {
		
		return session.selectOne("post.getDetail", dto);
	}

	@Override
	public int insertReaded(long num, String sessionId) {
		//parameterType 으로 지정할 Map 객체에 필요한 정보를 담는다.
		Map<String, Object> map = Map.of("num", num, "sessionId", sessionId);
		//Map 객체를 parameterType 으로 전달해서 sql 문을 실행한다.
		return session.insert("post.insertReaded", map);
	}

	@Override
	public boolean isReaded(long num, String sessionId) {
		//parameterType 으로 지정할 Map 객체에 필요한 정보를 담는다.
		Map<String, Object> map = Map.of("num", num, "sessionId", sessionId);
		//select 되는 데이터가 있는지 읽어와서
		Map<String, Object> resultMap = session.selectOne("post.isReaded", map);
		if(resultMap == null) {
			return false;	//아직 읽지않은 post
		}else {
			return true;	//이미 읽은 post
		}
	}

	@Override
	public int addViewCount(long num) {
		
		return session.update("post.addViewCount", num);
	}

	@Override
	public int deleteReaded(long num) {
		
		return session.delete("post.deleteReaded", num);
	}

}
