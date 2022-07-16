import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Col, Row, Tabs, Tab } from "react-bootstrap";

import { UserStateContext } from "../App";
import * as Api from "../api";
import User from "./user/User";
// project import
import Projects from "./project/Projects";
// award import
import Educations from "./education/Educations";
import Awards from "./award/Awards";
import Certificates from "./certificate/Certificates";
import Comments from "./comment/Comments";
import Gallerys from "./gallery/Gallerys";
import ProjectsDetail from "./portfolio/ProjectsDetail";
import { RecoilRoot } from "recoil";
import { useMediaQuery } from "@material-ui/core";
import "./Components.css";

function Portfolio() {
  const navigate = useNavigate();
  const params = useParams();
  // useState 훅을 통해 portfolioOwner 상태를 생성함.
  const [portfolioOwner, setPortfolioOwner] = useState(null);
  // fetchPorfolioOwner 함수가 완료된 이후에만 (isFetchCompleted가 true여야) 컴포넌트가 구현되도록 함.
  // 아래 코드를 보면, isFetchCompleted가 false이면 "loading..."만 반환되어서, 화면에 이 로딩 문구만 뜨게 됨.
  const [isFetchCompleted, setIsFetchCompleted] = useState(false);
  const userState = useContext(UserStateContext);

  const fetchPorfolioOwner = async (ownerId) => {
    // 유저 id를 가지고 "/users/유저id" 엔드포인트로 요청해 사용자 정보를 불러옴.
    const res = await Api.get("users", ownerId);
    // 사용자 정보는 response의 data임.
    const ownerData = res.data;
    // portfolioOwner을 해당 사용자 정보로 세팅함.
    setPortfolioOwner(ownerData);
    // fetchPorfolioOwner 과정이 끝났으므로, isFetchCompleted를 true로 바꿈.
    setIsFetchCompleted(true);
  };

  const matches = useMediaQuery("(min-width: 1400px)");
  const [checkedTab, setCheckedTab] = useState("portfolio");

  const handleSelect = (key) => {
    navigate(`${window.location.pathname}?tab=${key}`, { replace: true });
    setCheckedTab(key);
  };

  useEffect(() => {
    if (window.location.search.split("=")[1] === "portfolio") {
      setCheckedTab("portfolio");
    }
    if (window.location.search.split("=")[1] === "comment") {
      setCheckedTab("comment");
    }
    if (window.location.search.split("=")[1] === "gallery") {
      setCheckedTab("gallery");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.search]);

  useEffect(() => {
    // 전역 상태의 user가 null이라면 로그인이 안 된 상태이므로, 로그인 페이지로 돌림.
    if (!userState.user) {
      navigate("/login", { replace: true });
      return;
    }

    if (params.userId) {
      // 만약 현재 URL이 "/users/:userId" 라면, 이 userId를 유저 id로 설정함.
      const ownerId = params.userId;
      // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
      fetchPorfolioOwner(ownerId);
    } else {
      // 이외의 경우, 즉 URL이 "/" 라면, 전역 상태의 user.id를 유저 id로 설정함.
      const ownerId = userState.user.id;
      // 해당 유저 id로 fetchPorfolioOwner 함수를 실행함.
      fetchPorfolioOwner(ownerId);
    }
  }, [params, userState, navigate]);

  if (!isFetchCompleted) {
    return "loading...";
  }

  return (
    <RecoilRoot>
      <Container fluid>
        <Row>
          {matches ? (
            <Col md="3">
              <User
                portfolioOwnerId={portfolioOwner.id}
                isEditable={portfolioOwner.id === userState.user?.id}
                authorId={userState.user?.id}
              />
            </Col>
          ) : (
            <Row className="justify-content-center">
              <User
                portfolioOwnerId={portfolioOwner.id}
                isEditable={portfolioOwner.id === userState.user?.id}
                authorId={userState.user?.id}
              />
            </Row>
          )}
          <Col>
            <Tabs
              id="tabs"
              className="mb-3"
              defaultActiveKey={checkedTab}
              onSelect={handleSelect}
            >
              <Tab eventKey="resume" title="Resume" tabClassName="coloredTab">
                <div className="mb-3">
                  <Projects
                    portfolioOwnerId={portfolioOwner.id}
                    isEditable={portfolioOwner.id === userState.user?.id}
                  />
                </div>
                <div className="mb-4">
                  <Educations
                    portfolioOwnerId={portfolioOwner.id}
                    isEditable={portfolioOwner.id === userState.user?.id}
                  />
                </div>
                <div className="mb-4">
                  <Awards
                    portfolioOwnerId={portfolioOwner.id}
                    isEditable={portfolioOwner.id === userState.user?.id}
                  />
                </div>
                <div className="mb-4">
                  <Certificates
                    portfolioOwnerId={portfolioOwner.id}
                    isEditable={portfolioOwner.id === userState.user?.id}
                  />
                </div>
              </Tab>
              <Tab eventKey="portfolio" title="Portfolio">
                <ProjectsDetail
                  portfolioOwnerId={portfolioOwner.id}
                  isEditable={portfolioOwner.id === userState.user?.id}
                />
              </Tab>
              <Tab eventKey="comment" title="Comment">
                <Comments userId={portfolioOwner.id} author={userState.user} />
              </Tab>
              <Tab eventKey="gallery" title="Gallery">
                <Gallerys
                  portfolioOwnerId={portfolioOwner.id}
                  isEditable={portfolioOwner.id === userState.user?.id}
                />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </RecoilRoot>
  );
}

export default Portfolio;
