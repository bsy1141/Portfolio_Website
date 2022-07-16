import { projectModel } from "../schemas/project";

class Project {
  static create = async ({ newProject }) => {
    const createdNewProject = await projectModel.create(newProject);
    return createdNewProject;
  };

  static findById = async ({ projectId }) => {
    const project = await projectModel.findOne({ id: projectId, active: true });
    return project;
  };

  static findByUserId = async ({ userId, page, perPage }) => {
    const total = await projectModel.countDocuments({ userId, active: true });
    const totalPage = Math.ceil(total / perPage);
    const projects = await projectModel
      .find({ userId, active: true })
      .sort({ createdAt: 1 })
      .skip(perPage * (page - 1))
      .limit(perPage);
    return { totalPage, projects };
  };

  static getTotalList = async ({ userId }) => {
    const projects = await projectModel
      .find({ userId, active: true })
      .sort({ createdAt: 1 });
    return projects;
  };

  static update = async ({ projectId, toUpdate }) => {
    const filter = { id: projectId, active: true };
    const option = { returnOriginal: false };
    const updatedProject = await projectModel.findOneAndUpdate(
      filter,
      toUpdate,
      option
    );
    return updatedProject;
  };

  static deleteById = async ({ projectId }) => {
    const deleteResult = await projectModel.deleteOne({
      id: projectId,
      active: true,
    });
    // returns: { "acknowledged" : true, "deletedCount" : 1 }
    const isDataDeleted = deleteResult.deletedCount === 1;
    return isDataDeleted;
  };

  static withdrawByUserId = async ({ userId, delayTime }) => {
    try {
      const withdrawResult = await projectModel.updateMany(
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
      const recoveryResult = await projectModel.updateMany(
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

export { Project };
