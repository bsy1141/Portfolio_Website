import { Portfolio, db, Gallery } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";
import { crawler } from "../constant";

class portfolioService {
  static addPortfolio = async ({ newPortfolio }) => {
    const portfolio = await Portfolio.create({ newPortfolio });

    if (!portfolio) {
      const errorMessage =
        "포트폴리오 생성에 실패했습니다.";
      return { errorMessage };
    }

    return portfolio;
    
  }

  static getPortfolio = async ({ projectId }) => {
    const portfolio = await Portfolio.findById({ projectId });
    if (!portfolio) {
      const errorMessage =
        "해당 ID를 가진 포트폴리오 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return portfolio;
  }

  static getPortfolioList = async({ userId, page, perPage }) => {
    const portfolio = await Portfolio.findByUserId({
      userId, page, perPage
    });

    if (!portfolio) {
      const errorMessage =
        "User ID의 포트폴리오 데이터가 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return portfolio;
  }

  static setPortfolio = async ({ projectId, toUpdate }) => {
    const portfolio = await Portfolio.update({
      projectId, toUpdate
    })

    return portfolio;
  }

  static deletePortfolio = async ({ projectId }) => {
    const session = await db.startSession();

    try {
      session.startTransaction();

      const isDataDeleted = await Portfolio.deleteById({ projectId });
      if (!isDataDeleted) {
        const errorMessage =
          "해당 id를 가진 포트폴리오가 없습니다. 다시 한 번 확인해 주세요.";
        throw new Error(errorMessage);
      }
      await Gallery.deleteByProjectId({ projectId });
      session.commitTransaction();
      return isDataDeleted;

    } catch (e) {

      await session.abortTransaction();
      const errorMessage =
        "회원탈퇴에 실패했습니다. 다시 시도해주세요.";
      return { errorMessage };

    } finally {
      session.endSession();
    }
    
  }

  static getProjectLanguage = async({ projectId }) => {
      const user = await this.getPortfolio({ projectId });
      if (!user) {
        const errorMessage =
          "해당 ID를 가진 포트폴리오 데이터는 없습니다. 다시 한 번 확인해 주세요.";
        return { errorMessage };
      }

      const language = await crawler(user.githubLink);

      return language;
  }
}

export { portfolioService };
