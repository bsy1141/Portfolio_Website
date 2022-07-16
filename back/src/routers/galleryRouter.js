import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { galleryService } from "../services/galleryService";
import multer from "multer";

const galleryRouter = Router();
galleryRouter.use(login_required);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}_` + Date.now() + `_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }); // storage에 저장, 이미지 크기는 5MB로 제한

galleryRouter.post(
  "/portfolio/gallery/:projectId",
  upload.array("gallery"),
  async function (req, res, next) {
    try {
      // req (request) 에서 데이터 가져오기
      const { projectId } = req.params;
      // req.file 은 `gallery` 라는 필드의 파일 정보입니다.
      let result = {};

      await Promise.all(
        req.files.map(async (v, i) => {
          const saveFileName = req.files[i].filename; // 저장된 파일명​
          const saveFilePath = `http://localhost:5001/uploads/${saveFileName}`; // 업로드된 파일의 경로 (index.html 기준)
          const newImage = {
            userId: req.currentUserId,
            projectId,
            saveFileName,
            saveFilePath,
          };
          const newImageContent = await galleryService.addImagePortfolio(
            newImage
          );

          if (newImageContent.errorMessage) {
            throw new Error(newImageContent.errorMessage);
          }
          result[i] = newImageContent;
        })
      );

      console.log(result);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

galleryRouter.delete(
  "/portfolio/gallery/:projectId/:id",
  async function (req, res, next) {
    try {
      const imageId = req.params.id;
      const projectId = req.params.projectId;
      const result = await galleryService.deleteImagePortfolio({
        projectId,
        imageId,
      });

      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }

      res.status(200).send(result.status);
    } catch (error) {
      next(error);
    }
  }
);

galleryRouter.post(
  "/gallery/create",
  upload.array("gallery"),
  async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "요청 내용이 빈 객체입니다. headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }

      // req (request) 에서 데이터 가져오기
      const { userId, description } = req.body;

      // req.file 은 `gallery` 라는 필드의 파일 정보입니다.
      const saveFileName = req.file.filename; // 저장된 파일명​
      const saveFilePath = `http://localhost:5001/uploads/${saveFileName}`; // 업로드된 파일의 경로 (index.html 기준)

      const newImage = { userId, description, saveFileName, saveFilePath };

      const newImageContent = await galleryService.addImageContent(newImage);

      if (newImageContent.errorMessage) {
        throw new Error(newImageContent.errorMessage);
      }

      res.status(201).json(newImageContent);
    } catch (error) {
      next(error);
    }
  }
);

galleryRouter.delete("/gallery/:userId/:id", async function (req, res, next) {
  try {
    const imageId = req.params.id;
    const result = await galleryService.deleteImage({ imageId });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

galleryRouter.get("/gallery/:userId/:id", async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const imageId = req.params.id;

    // 위 id를 이용하여 db에서 data 찾기
    const image = await galleryService.getImage({ imageId });

    if (image.errorMessage) {
      throw new Error(image.errorMessage);
    }

    res.status(200).send(image);
  } catch (error) {
    next(error);
  }
});

galleryRouter.get("/gallery/:userId", async function (req, res, next) {
  try {
    // 특정 사용자의 전체 프로젝트 목록을 얻음
    const userId = req.params.userId;

    const { images } = await galleryService.getGallery({ userId });

    res.status(200).send({ images });
  } catch (error) {
    next(error);
  }
});

galleryRouter.patch(
  "/gallery/:userId/:id",
  upload.none(),
  async function (req, res, next) {
    try {
      // URI로부터 data id를 추출함.
      const imageId = req.params.id;
      const { description } = req.body ?? null;

      // 위 추출된 정보를 이용하여 db의 데이터 수정함
      const updatedImageContent = await galleryService.setImageContent({
        imageId,
        description,
      });

      if (updatedImageContent.errorMessage) {
        throw new Error(updatedImageContent.errorMessage);
      }

      res.status(200).json(updatedImageContent);
    } catch (error) {
      next(error);
    }
  }
);

export { galleryRouter };
