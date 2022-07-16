import { useState } from "react";
import { Button, Card, Form, Col, Row } from "react-bootstrap";
import * as Api from "../../api";
import ProjectDetailCardSlider from "./ProjectDetailCardSlider";

import { useRecoilValue } from "recoil";
import { pageState } from "./PortfolioAtom";

const PER_PAGE = 3;

const ProjectDetailEditForm = ({ project, setIsEditing, setProjects }) => {
  const [deployLink, setDeployLink] = useState(project.deployLink);
  const [githubLink, setGithubLink] = useState(project.githubLink);
  const [projectRole, setProjectRole] = useState(project.projectRole);
  const [details, setDetails] = useState(project.details);
  const page = useRecoilValue(pageState);

  const slicingDate = (from, to) => {
    from = from.slice(0, 10).split("-").join(".");
    to = to.slice(0, 10).split("-").join(".");
    return `${from} ~ ${to}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, projectId } = project;
    try {
      Api.post(`portfolio/${projectId}`, {
        userId,
        projectId,
        deployLink,
        githubLink,
        projectRole,
        details,
      });
      const res = await Api.get(
        "portfoliolist",
        `${userId}?page=${page}&perPage=${PER_PAGE}`
      );
      setProjects(res.data.portfolios);
    } catch (err) {
      console.log(err.message);
    }
    setIsEditing(false);
  };

  const handleDetailsAdd = () => {
    setDetails([...details, ""]);
  };

  const handleDetailsRemove = (index) => {
    const temp = [...details];
    temp.splice(index, 1);
    setDetails(temp);
  };

  const handleDetailChange = (e, index) => {
    const temp = [...details];
    temp[index] = e.target.value;
    setDetails(temp);
  };

  return (
    <Card.Body
      className="mb-4"
      style={{ backgroundColor: "white", borderRadius: "10px" }}
    >
      <h4
        style={{
          display: "inline",
          marginRight: "10px",
          backgroundColor: "white",
        }}
      >
        {project.title}
      </h4>
      <p style={{ backgroundColor: "white" }}>
        {slicingDate(project.fromDate, project.toDate)}
      </p>
      {project.images && <ProjectDetailCardSlider slides={project.images} />}

      <Form onSubmit={handleSubmit} style={{ backgroundColor: "white" }}>
        <Form.Group
          controlId="formBasicTitle"
          className="mb-3"
          style={{ backgroundColor: "white" }}
        >
          <Form.Label style={{ backgroundColor: "white" }}>URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="배포 링크"
            value={deployLink}
            onChange={(e) => setDeployLink(e.target.value)}
          />
        </Form.Group>

        <Form.Group
          controlId="formBasicTitle"
          className="mb-3"
          style={{ backgroundColor: "white" }}
        >
          <Form.Label style={{ backgroundColor: "white" }}>Github</Form.Label>
          <Form.Control
            type="text"
            placeholder="깃헙 링크"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </Form.Group>

        <Form.Group
          controlId="formBasicTitle"
          className="mb-3"
          style={{ backgroundColor: "white" }}
        >
          <Form.Label style={{ backgroundColor: "white" }}>
            Project Role
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="프로젝트 내 역할"
            value={projectRole}
            onChange={(e) => setProjectRole(e.target.value)}
          />
        </Form.Group>

        <Form.Group
          controlId="formBasicTitle"
          className="mb-3"
          style={{ backgroundColor: "white" }}
        >
          <Form.Label style={{ backgroundColor: "white" }}>세부사항</Form.Label>
          {/* 세부사항을 받을 수 있는 텍스트 폼 - 추가할 수 있게 만듦 */}
          {details.map((detail, idx) => (
            <div
              key={idx}
              style={{ marginBottom: "15px", backgroundColor: "white" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "white",
                }}
              >
                <Form.Control
                  type="text"
                  style={{ width: "95%" }}
                  value={detail}
                  onChange={(e) => handleDetailChange(e, idx)}
                />
                {details.length === 1 ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDetailsRemove(idx)}
                    disabled
                  >
                    -
                  </Button>
                ) : (
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDetailsRemove(idx)}
                  >
                    -
                  </Button>
                )}
              </div>
              {details.length - 1 === idx && details.length < 5 && (
                <Col
                  className="text-center mt-3"
                  style={{ backgroundColor: "white" }}
                >
                  <Button variant="outline-primary" onClick={handleDetailsAdd}>
                    추가
                  </Button>
                </Col>
              )}
            </div>
          ))}
        </Form.Group>

        <Form.Group as={Row} className="mt-3 text-center mb-4">
          <Col sm={{ span: 20 }} style={{ backgroundColor: "white" }}>
            <Button variant="primary" type="submit" className="me-3">
              확인
            </Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              취소
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </Card.Body>
  );
};

export default ProjectDetailEditForm;
