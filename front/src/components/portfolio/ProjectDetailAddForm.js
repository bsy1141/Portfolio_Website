import { useState, useEffect } from "react";
import * as Api from "../../api";

import {
  Button,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Col,
} from "react-bootstrap";

import { useRecoilState, useSetRecoilState } from "recoil";
import { pageState, allPageState, isAddingState } from "./PortfolioAtom";

const PER_PAGE = 3;

const ProjectDetailAddForm = ({ portfolioOwnerId, setProjects, projects }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [project, setProject] = useState(0);
  const [deployLink, setDeployLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [details, setDetails] = useState([""]);
  const [pickedImages, setPickedImages] = useState([]);

  const [page, setPage] = useRecoilState(pageState);
  const setAllPage = useSetRecoilState(allPageState);
  const setIsAdding = useSetRecoilState(isAddingState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, fromDate, toDate } = project;
    try {
      await Api.post("portfolio", {
        title,
        fromDate,
        toDate,
        userId: portfolioOwnerId,
        projectId: id,
        deployLink,
        githubLink,
        projectRole,
        details,
      });

      if (pickedImages !== []) {
        console.log(pickedImages);
        try {
          const formData = new FormData();
          pickedImages.map((img) => {
            formData.append("gallery", img);
          });
          await Api.postImage(`portfolio/gallery/${id}`, formData);
        } catch (err) {
          console.log(err.message);
        }
      }

      const res = await Api.get(
        "portfoliolist",
        `${portfolioOwnerId}?page=${page}&perPage=${PER_PAGE}`
      );
      const { totalPage, portfolios } = res.data;
      setPage(totalPage);
      setAllPage(totalPage);
      setProjects(portfolios);
    } catch (err) {
      console.log(err.message);
    }
    setIsAdding(false);
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

  const handleFileChange = (e) => {
    const data = e.target.files;
    const picked = [];
    if (data.length > 5) {
      alert("첨부파일은 최대 5개까지 첨부 가능합니다.");
      e.target.value = "";
    } else {
      for (let i = 0; i < data.length; i++) {
        picked.push(data[i]);
      }
      setPickedImages(picked);
    }
  };

  const slicingDate = (from, to) => {
    if (from === undefined && to === undefined) {
      return;
    }
    from = from.slice(0, 10).split("-").join(".");
    to = to.slice(0, 10).split("-").join(".");
    return `${from} ~ ${to}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await Api.get("projectTotalList", portfolioOwnerId);
        let temp = [...res.data];
        projects.forEach((proj) => {
          temp = temp.filter((p) => p.id !== proj.projectId);
        });
        setProjectsList(temp);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchProjects();
  }, [portfolioOwnerId]);

  return (
    <>
      {/* 프로젝트 목록 드롭다운 */}
      <DropdownButton
        variant="primary"
        title="project 선택"
        className="portfolioBG mb-3"
      >
        {projectsList.map((proj, idx) => (
          <Dropdown.Item key={proj.id} onClick={() => setProject(proj)}>
            {proj.title}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      {/* 선택한 프로젝트에 따른 프로젝트 제목, 설명, 날짜를 보여줌(수정 불가)*/}
      <h4
        className="portfolioBG"
        style={{ display: "inline", marginRight: "10px" }}
      >
        {project?.title}
      </h4>
      <p className="portfolioBG">
        {slicingDate(project?.fromDate, project?.toDate)}
      </p>

      {/* 배포링크, 깃헙링크, 역할 기록할 수 있는 텍스트 폼 */}
      <Form onSubmit={handleSubmit} className="portfolioBG">
        <Form.Group>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple={true}
          />
          <ul className="portfolioBG">
            {pickedImages &&
              pickedImages.map((img) => (
                <li className="portfolioBG" key={img.name}>
                  {img.name}
                </li>
              ))}
          </ul>
        </Form.Group>
        <Form.Group controlId="formBasicTitle" className="mb-3 portfolioBG">
          <Form.Label className="portfolioBG">URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="배포 링크"
            value={deployLink}
            onChange={(e) => setDeployLink(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicTitle" className="mb-3 portfolioBG">
          <Form.Label className="portfolioBG">Github</Form.Label>
          <Form.Control
            type="text"
            placeholder="깃헙 링크"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicTitle" className="mb-3 portfolioBG">
          <Form.Label className="portfolioBG">Project Role</Form.Label>
          <Form.Control
            type="text"
            placeholder="프로젝트 내 역할"
            value={projectRole}
            onChange={(e) => setProjectRole(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicTitle" className="mb-3 portfolioBG">
          <Form.Label className="portfolioBG">세부사항</Form.Label>
          {/* 세부사항을 받을 수 있는 텍스트 폼 - 추가할 수 있게 만듦 */}
          {details.map((detail, idx) => (
            <div
              key={idx}
              style={{ marginBottom: "15px" }}
              className="portfolioBG"
            >
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="portfolioBG"
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
                <Col className="text-center portfolioBG mt-3">
                  <Button variant="outline-primary" onClick={handleDetailsAdd}>
                    추가
                  </Button>
                </Col>
              )}
            </div>
          ))}
        </Form.Group>

        <Form.Group as={Row} className="mt-3 text-center mb-4">
          <Col sm={{ span: 20 }} className="portfolioBG">
            <Button variant="primary" type="submit" className="me-3">
              확인
            </Button>
            <Button variant="secondary" onClick={() => setIsAdding(false)}>
              취소
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  );
};

export default ProjectDetailAddForm;
