import { galleryModel } from "../schemas/gallery";
import fs from "fs";

class Gallery {
  static create = async ({ newImageContent }) => {
    const createdNewImage = await galleryModel.create(newImageContent);
    return createdNewImage;
  }

  static deleteById = async ({ imageId }) => {
    const imageDoc = await galleryModel.findOne({ id: imageId });
    const filePath = "uploads/" + imageDoc.saveFileName
    // const dir = fs.existsSync(filePath) // filePath에 파일이 있는지 체크하는 메서드
    if (fs.existsSync(filePath) === false) {
      console.log("이미지가 존재하지 않습니다.")
    } else {
      fs.unlink(filePath, (err) => {
        if(err) throw err;
      })
    }

    const deleteResult = await galleryModel.deleteOne({ id: imageId, active : true, });
    // returns: { "acknowledged" : true, "deletedCount" : 1 }
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  }

  static deleteByProjectId = async ({ projectId }) => {
    const imageDoc = await galleryModel.find({ projectId: projectId });
    if (imageDoc.length > 0) {
      imageDoc.forEach((i) => {
        const filePath = "uploads/" + i.saveFileName
        // const dir = fs.existsSync(filePath) // filePath에 파일이 있는지 체크하는 메서드
        if (fs.existsSync(filePath) === false) {
          console.log("이미지가 존재하지 않습니다.")
        } else {
          fs.unlink(filePath, (err) => {
            if(err) throw err;
          })
        }
      })
    }
    const deleteResult = await galleryModel.deleteMany({ projectId: projectId, active : true, });
    // returns: { "acknowledged" : true, "deletedCount" : 1 }
    const isDataDeleted = deleteResult.deletedCount > 0;
    return isDataDeleted;
  }

  static findById = async ({ imageId }) => {
    const image = await galleryModel.findOne({ id: imageId, active : true, });
    return image;
  }

  static findByUserId = async ({ userId }) => {
    const images = await galleryModel.find({ userId, active : true, }).sort({ createdAt: 1 });
    return { images };
  }

  static update = async ({ imageId, description }) => {
    const filter = { id: imageId, active : true, };
    const option = { returnOriginal: false };
    const updatedImageContent = await galleryModel.findOneAndUpdate(
      filter,
      { description },
      option
    );
    return updatedImageContent;
  }

  static withdrawByUserId = async ({ userId, delayTime }) => {
    try {
      const withdrawResult = await galleryModel.updateMany(
        { userId : userId, active : true, },
        { $set : { expiredAt : delayTime, active : false} },
        { returnOriginal : false },
      )

      return withdrawResult;

    } catch(err) {
      return { error: err.message };
    }
  }

  static recoveryByUserId = async ({ userId }) => {
    try {
      const recoveryResult = await galleryModel.updateMany(
        { userId : userId, active : false, },
        { $set : { active : true }, $unset : { expiredAt : true } },
        { returnOriginal : false },
      )

      return recoveryResult;
    } catch (err) {
      return { error : err.message };
    }
  }
}

export { Gallery };