import { Card, Col, Button } from "react-bootstrap";
import * as Api from "../../api";
import ProjectDetailCardSlider from "./ProjectDetailCardSlider";
import { useRecoilState, useSetRecoilState } from "recoil";
import { pageState, allPageState } from "./PortfolioAtom";

const PER_PAGE = 3;

const ProjectDetailCard = ({
  project,
  setIsEditing,
  isEditable,
  setProjects,
}) => {
  const [page, setPage] = useRecoilState(pageState);
  const setAllPage = useSetRecoilState(allPageState);

  const slicingDate = (from, to) => {
    from = from.slice(0, 10).split("-").join(".");
    to = to.slice(0, 10).split("-").join(".");
    return `${from} ~ ${to}`;
  };

  const handleDelete = async () => {
    const { projectId, userId } = project;
    try {
      Api.delete("portfolio", projectId);
      const res = await Api.get(
        "portfoliolist",
        `${userId}?page=${page}&perPage=${PER_PAGE}`
      );
      const { totalPage, portfolios } = res.data;
      if (page > totalPage) {
        setPage(page - 1);
      }
      setAllPage(totalPage);
      setProjects(portfolios);
    } catch (err) {
      console.log(err.message);
    }
  };
  console.log(project.images);
  return (
    <Card.Body
      className="mb-4"
      style={{ backgroundColor: "white", borderRadius: "10px" }}
    >
      {project.images && <ProjectDetailCardSlider slides={project.images} />}
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
      {project.deployLink && (
        <div style={{ backgroundColor: "white" }}>
          <span style={{ backgroundColor: "white", fontWeight: "bold" }}>
            URL:{" "}
          </span>
          <span style={{ backgroundColor: "white" }}>{project.deployLink}</span>
        </div>
      )}
      {project.githubLink && (
        <div style={{ backgroundColor: "white" }}>
          <span style={{ backgroundColor: "white", fontWeight: "bold" }}>
            GitHub:{" "}
          </span>
          <span style={{ backgroundColor: "white" }}>{project.githubLink}</span>
        </div>
      )}

      {project.githubLink && (
        <div style={{ backgroundColor: "white", marginBottom: "15px" }}>
          <span style={{ backgroundColor: "white", fontWeight: "bold" }}>
            Project Role:{" "}
          </span>
          <span style={{ backgroundColor: "white" }}>
            {project.projectRole}
          </span>
        </div>
      )}

      {project.details !== [""] && (
        <>
          <span style={{ backgroundColor: "white", fontWeight: "bold" }}>
            세부 정보
          </span>
          <ul style={{ backgroundColor: "white" }}>
            {project.details.map((detail, idx) => (
              <li style={{ backgroundColor: "white" }} key={idx}>
                {detail}
              </li>
            ))}
          </ul>
        </>
      )}
      {isEditable && (
        <Col style={{ backgroundColor: "white" }} className="text-center">
          <Button
            variant="outline-info"
            onClick={() => setIsEditing(true)}
            className="mr-3"
          >
            편집
          </Button>{" "}
          <Button variant="outline-danger" onClick={() => handleDelete()}>
            삭제
          </Button>
        </Col>
      )}
    </Card.Body>
  );
};

export default ProjectDetailCard;
