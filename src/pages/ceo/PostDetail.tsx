import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { Button, Container, Row, Col } from 'react-bootstrap';

interface Post {
  postId: number;
  title: string;
  writer: string;
  content: string;
  creDate: string;
  editDate: string;
  uploadFile: string;
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('본사2'); // 실제 로그인 정보 연동 필요

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      api.patch(`/posts/delete/${id}`)
        .then(() => {
          alert("삭제되었습니다.");
          navigate('/posts');
        });
    }
  };

  const handleDownload = () => {
    window.open(`/uploads/${post?.uploadFile}`, "_blank");
  };

  if (!post) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <h3>{post.title}</h3>
      <Row className="my-2">
        <Col><strong>공지 ID</strong>: {post.postId}</Col>
        <Col><strong>작성자</strong>: {post.writer}</Col>
        <Col><strong>작성 날짜</strong>: {post.creDate}</Col>
        <Col><strong>수정 날짜</strong>: {post.editDate}</Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <Button variant="outline-success" onClick={handleDownload}>파일 다운로드</Button>
        </Col>
      </Row>
      <div className="border p-3 mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* 작성자만 보이는 수정/삭제 */}
      {currentUser === post.writer && (
        <div className="mb-3">
          <Button variant="danger" onClick={handleDelete} className="me-2">삭제</Button>
          <Button variant="success" onClick={() => navigate(`/posts/edit/${post.postId}`)}>수정</Button>
        </div>
      )}

      <Button variant="secondary" onClick={() => navigate('/posts')}>목록</Button>
    </Container>
  );
}
