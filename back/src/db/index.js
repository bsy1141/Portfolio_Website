import mongoose from "mongoose";
import { User } from "./models/User";
import { Project } from "./models/Project";
import { Award } from "./models/Award";
import { Certificate } from "./models/Certificate";
import { Education } from "./models/Education";
import { Comment } from "./models/Comment";
import { Reply } from "./models/Reply";
import { Auth } from "./models/Auth";
import { Gallery } from "./models/Gallery";
import { Portfolio } from "./models/Portfolio";

const DB_URL =
  process.env.MONGODB_URL ||
  "MongoDB 서버 주소가 설정되지 않았습니다.\n./db/index.ts 파일을 확인해 주세요.";

mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on("connected", () =>
  console.log("정상적으로 MongoDB 서버에 연결되었습니다.  " + DB_URL)
);
db.on("error", (error) =>
  console.error("MongoDB 연결에 실패하였습니다...\n" + DB_URL + "\n" + error)
);

export { User };
export { Project };
export { Award };
export { Certificate };
export { Education };
export { db };
export { Comment };
export { Reply };
export { Auth };
export { Gallery };
export { Portfolio };