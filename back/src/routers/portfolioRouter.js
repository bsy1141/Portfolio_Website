import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { portfolioService } from "../services/portfolioService";

const portfolioRouter = Router();

portfolioRouter.post("/portfolio", login_required, async function (req, res, next) {
  try {
    if (is.emptyObject(req.body) || !req.body.projectId || !req.body.userId || !req.body.title || !req.body.fromDate || !req.body.toDate) {
      throw new Error(
        "요청 내용이 빈 객체거나 프로젝트 ID 혹은 유저 ID가 없습니다."
      );
    }
    // req (request) 에서 데이터 가져오기
    const newPortfolio = { 
      title : req.body.title,
      fromDate : req.body.fromDate,
      toDate : req.body.toDate,
      userId : req.body.userId, 
      projectId : req.body.projectId, 
      deployLink : req.body.deployLink ? req.body.deployLink : "", 
      githubLink : req.body.githubLink ? req.body.githubLink : "",
      projectRole : req.body.projectRole ? req.body.projectRole : "",
      details : req.body.details ? req.body.details : [],  
    }

    // 위 데이터를 프로젝트 db에 추가하기
    const result = await portfolioService.addPortfolio({ newPortfolio });
    
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

portfolioRouter.post("/portfolio/:id", login_required, async (req, res, next) => {
  try {

      if (is.emptyObject(req.body) || is.emptyObject(req.params)) {
          throw new Error(
            "자격증 업데이트에 실패했습니다. portfolio ID 혹은 Body의 데이터를 확인해주세요."
          );
      }

      const updatePortfolio = {
          deployLink : req.body.deployLink ? req.body.deployLink : "", 
          githubLink : req.body.githubLink ? req.body.githubLink : "",
          projectRole : req.body.projectRole ? req.body.projectRole : "",
          details : req.body.details ? req.body.details : [],  
      }

      const result = await portfolioService.setPortfolio({ 
        projectId : req.params.id,
        toUpdate : updatePortfolio,
       });

      if (result.errorMessage) {
          throw new Error(result.errorMessage);
      }

      res.status(200).send(result);

  } catch (error) {
      next (error);
  }   
});

portfolioRouter.get("/portfolio/:id", login_required, async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const projectId = req.params.id;

    // 위 id를 이용하여 db에서 data 찾기
    const portfolio = await portfolioService.getPortfolio({ projectId });

    if (portfolio.errorMessage) {
      throw new Error(portfolio.errorMessage);
    }

    res.status(200).send(portfolio);
  } catch (error) {
    next(error);
  }
});

portfolioRouter.get("/portfoliolist/:userId", login_required, async function (req, res, next) {
    try {
      // 특정 사용자의 전체 프로젝트 목록을 얻음
      const userId = req.params.userId;
      
      const page = Number(req.query.page) || 1 // url 쿼리에서 page 받기, 기본값 1
      const perPage = Number(req.query.perPage) || 3 // url 쿼리에서 perRage 받기, 기본값 3

      const { totalPage, portfolios: portfoliolist } = await portfolioService.getPortfolioList({ userId, page, perPage })
      
      res.status(200).send({ totalPage, portfolios: portfoliolist });
    } catch (error) {
      next(error);
    }
  });

portfolioRouter.delete("/portfolio/:id", login_required, async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const projectId = req.params.id;

    // 위 id를 이용하여 db에서 데이터 삭제하기
    const result = await portfolioService.deletePortfolio({ projectId });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

portfolioRouter.get("/portfolio/language/:id", login_required, async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const projectId = req.params.id;

    // 위 id를 이용하여 db에서 데이터 삭제하기
    const result = await portfolioService.getProjectLanguage({ projectId });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

export { portfolioRouter };
