import React, { useRef, useState, useEffect } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { initEditor } from '../../editor/SmartEditor';

function PostCreate() {
  const [writer, setWriter] = useState('');
  const [title, setTitle] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [editorTool, setEditorTool] = useState<any>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tool = initEditor('content');
    setEditorTool(tool);
  }, []);

  const handleSubmit = async () => {
    if (!writer || !title) {
      alert('작성자와 제목을 입력해주세요.');
      return;
    }

    // 스마트에디터 내용 textarea로 동기화
    editorTool?.exec();

    const content = contentRef.current?.value || '';
    const formData = new FormData();
    formData.append('writer', writer);
    formData.append('title', title);
    formData.append('content', content);
    if (uploadFile) formData.append('uploadFile', uploadFile);

    try {
      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('공지 작성 완료!');
      navigate('/posts');
    } catch (error) {
      console.error(error);
      alert('작성 실패!');
    }
  };

  return (
    <Container className="p-4 border mt-4" style={{ maxWidth: '900px' }}>
      <h3 className="mb-4">공지 작성</h3>

      <Form.Group className="mb-3">
        <Form.Label><strong>작성자</strong></Form.Label>
        <Form.Control type="text" value={writer} onChange={e => setWriter(e.target.value)} placeholder="입력란..." />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>제목</strong></Form.Label>
        <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력해주세요..." />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>파일 첨부</strong></Form.Label>
        <Row>
          <Col xs={10}>
            <Form.Control type="file" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
          </Col>
          <Col>
            <Button variant="success" onClick={() => alert('파일 선택 후 작성 버튼을 눌러주세요')}>업로드</Button>
          </Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label><strong>내용</strong></Form.Label>
        <Form.Control as="textarea" id="content" ref={contentRef} style={{ display: 'none' }} />
      </Form.Group>

      <div className="text-end">
        <Button onClick={handleSubmit}>작성</Button>
      </div>
    </Container>
  );
}

export default PostCreate;
