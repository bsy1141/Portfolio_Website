import { Project, Portfolio, db, Gallery } from "../db"; // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";

class projectService {
  static addProject = async ({
    userId,
    title,
    description,
    fromDate,
    toDate,
  }) => {
    // id 는 유니크 값 부여
    const id = uuidv4();
    const newProject = { id, userId, title, description, fromDate, toDate };

    // db에 저장
    const createdNewProject = await Project.create({ newProject });
    createdNewProject.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewProject;
  };

  static getProject = async ({ projectId }) => {
    // project db에 존재 여부 확인 & db에서 찾지 못한 경우, 에러 메시지 반환
    const project = await Project.findById({ projectId });
    if (!project) {
      const errorMessage =
        "해당 id를 가진 프로젝트 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return project;
  };

  static getProjectList = async ({ userId, page, perPage }) => {
    // project db에서 해당 유저의 프로젝트 리스트를 가져옴
    const { totalPage, projects } = await Project.findByUserId({
      userId,
      page,
      perPage,
    });
    return { totalPage, projects };
  };

  static getProjectTotalList = async ({ userId }) => {
    // project db에서 해당 유저의 프로젝트 리스트를 가져옴
    const projects = await Project.getTotalList({ userId });
    return projects;
  };

  static setProject = async ({ projectId, toUpdate }) => {
    // project db에 존재 여부 확인 & db에서 찾지 못한 경우, 에러 메시지 반환
    let project = await Project.findById({ projectId });
    if (!project) {
      const errorMessage =
        "해당 id를 가진 프로젝트 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const updatedProject = await Project.update({ projectId, toUpdate });
    return updatedProject;
  };

  static deleteProject = async ({ projectId }) => {
    // project db에 존재 여부 확인 & db에서 찾지 못한 경우, 에러 메시지 반환
    const session = await db.startSession();
    try {
      session.startTransaction();

      const isDataDeleted = await Project.deleteById({ projectId });
      if (!isDataDeleted) {
        const errorMessage =
          "해당 id를 가진 프로젝트 데이터는 없습니다. 다시 한 번 확인해 주세요.";
        console.log("asdasdsad");
        throw new Error(errorMessage);
      }

      const portfolio = await Portfolio.findById({ projectId });

      if (!portfolio.errorMessage) {
        const result = await Portfolio.deleteById({ projectId });
        if (!result) {
          const errorMessage =
            "프로젝트와 연결된 포트폴리오를 지우는 도중 에러가 발생했습니다.";
          throw new Error(errorMessage);
        }

        await Gallery.deleteByProjectId({ projectId });
      }

      session.commitTransaction();

      return { status: "ok" };
    } catch (e) {
      await session.abortTransaction();
      const errorMessage = e.errorMessage;
      return { errorMessage };
    } finally {
      session.endSession();
    }
  };
}

export { projectService };
