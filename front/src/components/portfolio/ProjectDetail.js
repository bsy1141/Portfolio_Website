import { useState } from "react";

import ProjectDetailEditForm from "./ProjectDetailEditForm";
import ProjectDetailCard from "./ProjectDetailCard";

const ProjectDetail = ({ project, isEditable, setProjects }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {isEditing ? (
        <ProjectDetailEditForm
          project={project}
          setIsEditing={setIsEditing}
          setProjects={setProjects}
        />
      ) : (
        <ProjectDetailCard
          project={project}
          isEditable={isEditable}
          setIsEditing={setIsEditing}
          setProjects={setProjects}
        />
      )}
    </>
  );
};

export default ProjectDetail;
