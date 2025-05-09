import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import { initEditor } from '../../editor/SmartEditor';

function PostUpdateForm() {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editorTool, setEditorTool] = useState<any>([]);
  const inputTitle = useRef<HTMLInputElement>(null);
  const inputWriter = useRef<HTMLInputElement>(null);
  const inputContent = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    setEditorTool(initEditor("content"));
  }, []);

  useEffect(() => {
    if (postId) {
      setIsEditMode(true);
      api.get(`/posts/${postId}`)
        .then(res => {
          inputTitle.current!.value = res.data.title;
          inputWriter.current!.value = res.data.writer;
          setTimeout(() => {
            editorTool.setContents(res.data.content);
          }, 300);
        })
        .catch(() => alert("글 불러오기 실패"));
    }
  }, [postId, editorTool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editorTool.exec();

    const formData = new FormData();
    formData.append("title", inputTitle.current?.value || '');
    formData.append("writer", inputWriter.current?.value || '');
    formData.append("content", inputContent.current?.value || '');
    if (uploadFile) {
      formData.append("uploadFile", uploadFile);
    }

    const request = isEditMode
      ? api.patch(`/posts/${postId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post(`/posts`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    request
      .then(() => {
        alert(isEditMode ? "수정 완료" : "등록 완료");
        navigate("/posts");
      })
      .catch(() => alert("처리 실패"));
  };

  return (
    <Container className="mt-4">
      <h3>{isEditMode ? '공지 수정' : '공지 작성'}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control ref={inputTitle} placeholder="제목 입력..." />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control ref={inputWriter} placeholder="작성자 이름 입력..." />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>첨부파일</Form.Label>
          <Form.Control type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>내용</Form.Label>
          <textarea id="content" ref={inputContent} className="form-control" rows={10}></textarea>
        </Form.Group>

        <div className="text-end">
          <Button type="submit">{isEditMode ? '수정' : '등록'}</Button>
        </div>
      </Form>
    </Container>
  );
}

export default PostUpdateForm;
