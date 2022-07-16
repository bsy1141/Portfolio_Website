import { User, Award, Certificate, Education, Project, Comment, Reply, Auth, db, Gallery, Portfolio } from "../db";
 // from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { EXPIRE_DELAY_TIME, randomString } from "../constant";
import nodemailer from "nodemailer";

class userAuthService {

  static withdrawUser = async ({ userId, password }) => {
    const user = await User.findById({ userId : userId });
    if (!user) {
      const errorMessage =
        "해당 아이디는 없는 아이디입니다. 다른 아이디를 입력해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    console.log(userId);
    const session = await db.startSession();

    try {
      
      session.startTransaction();

      const withdrawResult = User.withdraw({ userId });
      if (!withdrawResult) { throw new Error("User withdraw Error") };


      const pResult = await Project.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (pResult.error) { throw new Error("Project withdraw Error") };

      const eResult = await Education.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (eResult.error) { throw new Error("Education withdraw Error") };

      const cResult = await Certificate.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (cResult.error) { throw new Error("Certificate withdraw Error") };

      const aResult = await Award.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (aResult.error) { throw new Error("Award withdraw Error") };

      const coResult = await Comment.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (coResult.error) { throw new Error("Award withdraw Error") };

      const rResult = await Reply.withdrawByUserId({
        userId, delayTime : Date.now() + EXPIRE_DELAY_TIME
      })

      if (rResult.error) { throw new Error("Award withdraw Error") };

      const gaResult = Gallery.withdrawByUserId({ userId });

      if (gaResult.error) { throw new Error("Gallery withdraw Error") };

      const poResult = Portfolio.withdrawByUserId({ userId });

      if (poResult.error) { throw new Error("Portfolio withdraw Error") };

      session.commitTransaction();
      
      return { status : "success" }

    } catch (e) {

      await session.abortTransaction();
      const errorMessage =
        "회원탈퇴에 실패했습니다. 다시 시도해주세요.";
      return { errorMessage };

    } finally {
      session.endSession();
    }
  }

  static recoveryUser = async ({ userId }) => {
    const user = await User.findById({ userId : userId, active:false });
    if (!user) {
      const errorMessage =
        "해당 아이디는 없는 아이디입니다. 다른 아이디를 입력해 주세요.";
      return { errorMessage };
    }

    const session = await db.startSession();

    try {
      session.startTransaction();

      const recoveryResult = User.recovery({ userId });
      if (!recoveryResult) { throw new Error("User withdraw Error") };

      const pResult = await Project.recoveryByUserId({ userId });
      if (pResult.error) { throw new Error("Project withdraw Error") };

      const eResult = await Education.recoveryByUserId({ userId });
      if (eResult.error) { throw new Error("Education withdraw Error") };

      const cResult = await Certificate.recoveryByUserId({ userId });
      if (cResult.error) { throw new Error("Certificate withdraw Error") };

      const aResult = await Award.recoveryByUserId({ userId })
      if (aResult.error) { throw new Error("Award withdraw Error") };

      const coResult = await Comment.recoveryByUserId({ userId })
      if (coResult.error) { throw new Error("Award withdraw Error") };

      const rResult = await Reply.recoveryByUserId({ userId })
      if (rResult.error) { throw new Error("Award withdraw Error") };

      const gaResult = Gallery.recoveryByUserId({ userId });
      if (gaResult.error) { throw new Error("Gallery withdraw Error") };

      const poResult = Portfolio.recoveryByUserId({ userId });
      if (poResult.error) { throw new Error("Portfolio withdraw Error") };


      session.commitTransaction();

      return { status : "success" };

    } catch(e) {

      await session.abortTransaction();
      const errorMessage =
        "회원복구에 실패했습니다. 다시 시도해주세요.";
      return { errorMessage };

    } finally {
      session.endSession();
    }
  }

  static recoveryByUser = async ({ email, password }) => {
    const user = await User.findByEmail({ email:email, active:false });

    if (!user) {
      const errorMessage =
        "해당 아이디는 비활성화 되지 않았습니다. 다른 아이디를 입력해 주세요.";
      return { errorMessage };
    }

    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 맞지 않습니다. 다시 확인해주세요.";
      return { errorMessage };
    }
    const session = await db.startSession();

    try {
      session.startTransaction();

      const recoveryResult = User.recovery({ userId : user.id });
      if (!recoveryResult) { throw new Error("User withdraw Error") };

      const pResult = await Project.recoveryByUserId({ userId : user.id });
      if (pResult.error) { throw new Error("Project withdraw Error") };

      const eResult = await Education.recoveryByUserId({ userId : user.id });
      if (eResult.error) { throw new Error("Education withdraw Error") };

      const cResult = await Certificate.recoveryByUserId({ userId : user.id });
      if (cResult.error) { throw new Error("Certificate withdraw Error") };

      const aResult = await Award.recoveryByUserId({ userId : user.id })
      if (aResult.error) { throw new Error("Award withdraw Error") };

      const coResult = await Comment.recoveryByUserId({ userId : user.id })
      if (coResult.error) { throw new Error("Award withdraw Error") };

      const rResult = await Reply.recoveryByUserId({ userId : user.id })
      if (rResult.error) { throw new Error("Award withdraw Error") };

      const gaResult = Gallery.recoveryByUserId({ userId : user.id });
      if (gaResult.error) { throw new Error("Gallery withdraw Error") };

      const poResult = Portfolio.recoveryByUserId({ userId : user.id });
      if (poResult.error) { throw new Error("Portfolio withdraw Error") };

      session.commitTransaction();
      return { status : "success" };

    } catch(e) {

      await session.abortTransaction();
      const errorMessage =
        "회원복구에 실패했습니다. 다시 시도해주세요.";
      return { errorMessage };
      
    } finally {
      session.endSession();
    }

  }

  static addUser = async ({ name, email, password }) => {
    // 이메일 중복 확인
    const user = await User.findByEmail({ email });
    if (user) {
      const errorMessage =
        "이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 해쉬화
    const hashedPassword = await bcrypt.hash(password, 10);

    // id 는 유니크 값 부여
    const id = uuidv4();
    const newUser = { id, name, email, password: hashedPassword };

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static changePassword = async ({ userId, password }) => {
    
    const user = await User.findById({ userId });

    if (!user) {
      const errorMessage =
        "회원을 탈퇴한 유저 혹은 없는 유저입니다. 비밀번호 변경에 실패했습니다.";
      return { errorMessage };
    }

    // 비밀번호 재생성
    const hashedPassword = await bcrypt.hash(password, 10);
    // db에 저장
    const createdNewUser = await User.changePassword({ userId, password : hashedPassword});
    
    createdNewUser.errorMessage = null; // 문제 없이 db 저장 완료되었으므로 에러가 없음.

    return createdNewUser;
  }

  static getUser = async ({ email, password }) => {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });

    if (!user.active) {
      const errorMessage =
        "해당 계정은 비활성화 되었습니다. ";
      return { errorMessage };
    }

    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 비밀번호 일치 여부 확인
    const correctPasswordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      correctPasswordHash
    );

    if (!isPasswordCorrect) {
      const errorMessage =
        "비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ userId: user.id }, secretKey, {expiresIn : '1 days'});

    // 반환할 loginuser 객체를 위한 변수 설정
    const id = user.id;
    const name = user.name;
    const description = user.description;

    const loginUser = {
      token,
      id,
      email,
      name,
      description,
      errorMessage: null,
    };

    return loginUser;
  }

  static getUsers = async () => {
    const users = await User.findAll();
    return users;
  }

  static setUser = async ({ userId, toUpdate }) => {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    // 업데이트 대상에 name이 있다면, 즉 name 값이 null 이 아니라면 업데이트 진행
    if (toUpdate.name) {
      const fieldToUpdate = "name";
      const newValue = toUpdate.name;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.email) {
      const fieldToUpdate = "email";
      const newValue = toUpdate.email;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.password) {
      const fieldToUpdate = "password";
      const newValue = toUpdate.password;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.description) {
      const fieldToUpdate = "description";
      const newValue = toUpdate.description;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    return user;
  }

  static getUserInfo = async ({ userId }) => {
    const user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    return user;
  }

  static addLike = async ({ userId, currentUserId }) => {
    // user db에 존재 여부 확인 & db에서 찾지 못한 경우, 에러 메시지 반환
    const likeInfo = await User.findById({ userId });
    if (!likeInfo) {
      const errorMessage =
        "해당 id를 가진 사용자는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const addedLike = await User.addLike({ userId, currentUserId });
    return addedLike;
  }

  static removeLike = async ({ userId, currentUserId }) => {
    // user db에 존재 여부 확인 & db에서 찾지 못한 경우, 에러 메시지 반환
    const likeInfo = await User.findById({ userId });
    if (!likeInfo) {
      const errorMessage =
        "해당 id를 가진 사용자는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    const removedLike = await User.removeLike({ userId, currentUserId });
    return removedLike;
  }

  static findPassword = async ({ email }) => {

    /**
     * todolist
     * 노드 메일러 추가
     * authentication 스키마 작성
     * 유저 이메일, 랜덤 숫자 6개 데이터 생성 5분 뒤 지워지는 것두 추가
     * 메일로 랜덤 숫자 6개를 보낸다.
     * 끝
     */
    const user = process.env.user;
    const pass = process.env.pass;

    await Auth.deleteAuth({ email });

    const code = randomString();

    const result = await Auth.create({ email, code });

    if (!result) {
      const errorMessage =
        "코드 생성에 실패했습니다. 다시 시도해주세요.";
      return { errorMessage };
    }

    const transport = nodemailer.createTransport({
      service : "Gmail",
      auth : {
        user : user,
        pass : pass,
      }
    })

    const mailOption = {
      from : `관리자@PortfolioTeam2<${user}>`,
      to : email,
      subject : "portfolio password auth code",
      html : `code : <strong>${code}</strong>`,
    }

    transport.sendMail(
      mailOption, (error, info) => { 
        if (error) { 
          const errorMessage =
            "메일 전송에 실패했습니다.";
          return { errorMessage };
        } 
        transporter.close(); 
      }
    );

    return { status : "success" };
  }

  static userEmailAuth = async ({ email, code }) => {

    /**
     * todolist
     * 유저가 보낸 랜덤 번호와 이메일이 DB에 있는지 체크
     * 만약 랜덤 번호가 틀렸으면 지운다. -> 에러 전송
     * 이메일이 틀렸으면 아예 검사 안됨
     * 맞았으면 로그인 시켜주고 디비에서 데이터를 지운다.
     * 
     */

    const auth = await Auth.findAuth({ email });

    if (auth.code !== code) {

      const errorMessage =
        "코드가 다릅니다. 다시 인증시도 해주세요.";
      return { errorMessage };

    }
    else {
      const result = await Auth.deleteAuth({ email });

      if (!result) {
        console.log("DB에 auth데이터가 없습니다.");
      }

      return await this.getUserForAuth({ email });
    }
  }

  static getUserForAuth = async ({ email }) => {
    const user = await User.findByEmail({ email });

    const secretKey = process.env.JWT_SECRET_KEY || "jwt-secret-key";
    const token = jwt.sign({ userId: user.id }, secretKey, {expiresIn : '1 days'});

    const id = user.id;
    const name = user.name;
    const description = user.description;

    const loginUser = {
      token,
      id,
      email,
      name,
      description,
      errorMessage: null,
    };

    return loginUser;
  }

  static uploadImage = async ({ userId, imageInfo }) => {
    // 우선 해당 id 의 유저가 db에 존재하는지 여부 확인
    let user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        "가입 내역이 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    user = await User.upload({ userId, imageInfo })
    
    return user;
  }
}

export { userAuthService };