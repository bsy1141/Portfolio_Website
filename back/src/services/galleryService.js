import { Gallery, db } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { Portfolio } from "../db";
import { v4 as uuidv4 } from "uuid";

class galleryService {
  static addImageContent = async ({
    userId,
    description,
    saveFileName,
    saveFilePath,
  }) => {
    // id 는 유니크 값 부여
    const id = uuidv4();
    const newImageContent = {
      id,
      userId,
      description,
      saveFileName,
      saveFilePath,
    };
    // db에 저장
    const createdNewImage = await Gallery.create({ newImageContent });
    createdNewImage.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.
    return createdNewImage;
  };

  static addImagePortfolio = async ({
    userId,
    description,
    projectId,
    saveFileName,
    saveFilePath,
  }) => {
    // id 는 유니크 값 부여
    const id = uuidv4();
    const newImageContent = {
      id,
      userId,
      description,
      projectId,
      saveFileName,
      saveFilePath,
    };
    // db에 저장
    const createdNewImage = await Gallery.create({ newImageContent });
    const portfolio = await Portfolio.updateImage({
      projectId,
      createdNewImage,
    });

    createdNewImage.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.
    return createdNewImage;
  };

  static deleteImagePortfolio = async ({ projectId, imageId }) => {
    const session = await db.startSession();

    try {
      session.startTransaction();

      const image = await this.getImage({ imageId });
      if (image.errorMessage) {
        throw new Error("find image Error");
      }

      const portfolio = await Portfolio.disConnectImage({
        projectId,
        imageId: image._id,
      });
      if (!portfolio) {
        throw new Error("disconnect image Error");
      }

      const result = await this.deleteImage({ imageId });
      if (result.errorMessage) {
        throw new Error("Award withdraw Error");
      }

      session.commitTransaction();
      return { status: "success" };
    } catch (e) {
      await session.abortTransaction();
      const errorMessage = "delete Image Portfolio Error";
      return { errorMessage };
    } finally {
      session.endSession();
    }
  };

  static deleteImage = async ({ imageId }) => {
    const isDataDeleted = await Gallery.deleteById({ imageId });
    if (!isDataDeleted) {
      const errorMessage =
        "해당 id를 가진 이미지 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return { status: "ok" };
  };

  static getImage = async ({ imageId }) => {
    const image = await Gallery.findById({ imageId });
    if (!image) {
      const errorMessage =
        "해당 id를 가진 이미지 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return image;
  };

  static getGallery = async ({ userId }) => {
    const { images } = await Gallery.findByUserId({ userId });
    return { images };
  };

  static setImageContent = async ({ imageId, description }) => {
    let image = await Gallery.findById({ imageId });
    if (!image) {
      const errorMessage =
        "해당 id를 가진 이미지 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedImageContent = await Gallery.update({ imageId, description });
    return updatedImageContent;
  };
}

export { galleryService };
