import { portfolioModel } from "../schemas/portfolio";

class Portfolio {
  static create = async ({ newPortfolio }) => {
    const checkPortfolio = await this.findById({
      projectId: newPortfolio.projectId,
    });

    if (!checkPortfolio.errorMessage) {
      return checkPortfolio;
    }
    const portfolio = await portfolioModel.create(newPortfolio);
    return portfolio;
  };

  static disConnectImage = async ({ projectId, imageId }) => {
    const portfolio = await portfolioModel.findOneAndUpdate(
      {
        projectId: projectId,
        active: true,
      },
      {
        $pull: { images: imageId },
      },
      {
        returnNewDocument: true,
        returnOriginal: false,
      }
    );

    if (portfolio) {
      return true;
    } else {
      return false;
    }
  };

  static findById = async ({ projectId }) => {
    const portfolio = await portfolioModel
      .findOne({ projectId: projectId, active: true })
      .populate("images");
    if (!portfolio) {
      const errorMessage = "포트폴리오를 불러오는 데 실패했습니다.";
      return { errorMessage };
    }
    return portfolio;
  };

  static updateImage = async ({ projectId, createdNewImage }) => {
    const portfolio = await portfolioModel
      .findOneAndUpdate(
        {
          projectId,
          active: true,
        },
        {
          $push: { images: createdNewImage },
        },
        {
          returnNewDocument: true,
          returnOriginal: false,
        }
      )
      .populate("images");
    console.log(portfolio);
    return portfolio;
  };

  static findByUserId = async ({ userId, page, perPage }) => {
    const total = await portfolioModel.countDocuments({ userId, active: true });
    const totalPage = Math.ceil(total / perPage);
    const portfolios = await portfolioModel
      .find({ userId, active: true })
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .populate("images");
    return { totalPage, portfolios };
  };

  static update = async ({ projectId, toUpdate }) => {
    const filter = { projectId: projectId, active: true };
    const option = { returnOriginal: false };
    const updatedPortfolio = await portfolioModel
      .findOneAndUpdate(filter, toUpdate, option)
      .populate("images");
    return updatedPortfolio;
  };

  static deleteById = async ({ projectId }) => {
    const deleteResult = await portfolioModel.deleteOne({
      projectId,
      active: true,
    });
    // returns: { "acknowledged" : true, "deletedCount" : 1 }
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  };

  static withdrawByUserId = async ({ userId, delayTime }) => {
    try {
      const withdrawResult = await portfolioModel.updateMany(
        { userId: userId, active: true },
        { $set: { expiredAt: delayTime, active: false } },
        { returnOriginal: false }
      );

      return withdrawResult;
    } catch (err) {
      return { error: err.message };
    }
  };

  static recoveryByUserId = async ({ userId }) => {
    try {
      const recoveryResult = await portfolioModel.updateMany(
        { userId: userId, active: false },
        { $set: { active: true }, $unset: { expiredAt: true } },
        { returnOriginal: false }
      );

      return recoveryResult;
    } catch (err) {
      return { error: err.message };
    }
  };
}

export { Portfolio };
