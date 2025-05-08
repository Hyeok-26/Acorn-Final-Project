import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';

interface Post {
  postId: number;
  title: string;
  writer: string;
  creDate: string;
}

interface PostListDto {
  list: Post[];
  pageNum: number;
  startPageNum: number;
  endPageNum: number;
  totalPageCount: number;
  totalRow: number;
  condition?: string;
  keyword?: string;
}

function PostList() {
  const [params] = useSearchParams();
  const [postList, setPostList] = useState<PostListDto>({
    list: [],
    pageNum: 1,
    startPageNum: 1,
    endPageNum: 1,
    totalPageCount: 1,
    totalRow: 0,
  });
  const [pageArray, setPageArray] = useState<number[]>([]);
  const [search, setSearch] = useState({
    condition: '',
    keyword: ''
  });

  const navigate = useNavigate();

  const range = (start: number, end: number) => {
    const result: number[] = [];
    for (let i = start; i <= end; i++) result.push(i);
    return result;
  };

  const refresh = (pageNum: number) => {
    const condition = params.get("condition") || "";
    const keyword = params.get("keyword") || "";

    api.get(`/posts?pageNum=${pageNum}&condition=${condition}&keyword=${keyword}`)
      .then(res => {
        setPostList(res.data);
        setPageArray(range(res.data.startPageNum, res.data.endPageNum));
      })
      .catch(error => console.log(error));
  };

  const move = (pageNum: number) => {
    const query = new URLSearchParams(search).toString();
    navigate(`/posts?pageNum=${pageNum}&${query}`);
  };

  useEffect(() => {
    const pageNum = parseInt(params.get("pageNum") || "1");
    refresh(pageNum);
  }, [params]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container">
      <h1>공지사항</h1>
      <div>
        <button onClick={() => navigate(`/posts/new`)}>공지 추가</button>
        <select name="condition" onChange={handleSearchChange}>
          <option value="">전체</option>
          <option value="writer">작성자</option>
          <option value="title">제목</option>
        </select>
        <input type="text" name="keyword" onChange={handleSearchChange} placeholder="검색어 입력" />
        <button onClick={() => move(1)}>검색</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일자</th>
          </tr>
        </thead>
        <tbody>
          {postList.list.map(post => (
            <tr key={post.postId} onClick={() => navigate(`/posts/${post.postId}`)} style={{ cursor: 'pointer' }}>
              <td>{post.postId}</td>
              <td>{post.title}</td>
              <td>{post.writer}</td>
              <td>{post.creDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination className="mt-3">
        <Pagination.Item onClick={() => move(postList.startPageNum - 1)} disabled={postList.startPageNum === 1}>Prev</Pagination.Item>
        {pageArray.map(item => (
          <Pagination.Item key={item} onClick={() => move(item)} active={postList.pageNum === item}>{item}</Pagination.Item>
        ))}
        <Pagination.Item onClick={() => move(postList.endPageNum + 1)} disabled={postList.endPageNum >= postList.totalPageCount}>Next</Pagination.Item>
      </Pagination>
    </div>
  );
}

export default PostList;
