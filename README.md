# 레이서 포트폴리오 서비스 - 2팀 투게더 코딩

## 주요 사용 기술

1. 프론트엔드

- React (create-react-app으로 구현되었습니다.)
- React Bootstrap
- axios
- recoil

2. 백엔드

- Express (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose
- multer
- nodemailer

## 설치 방법

1. 프론트 엔드 서버 실행

```bash
cd front
yarn install
yarn start
```

2. 백엔드 서버 실행

```bash
back 폴더 내부 README 참고
```

---

## 개요
웹 서비스 프로젝트 2주차 기능 추가를 temp-dev branch merge 진행 완료

## 구현 내용
- 각 MVP 기능들을 master에서 branch로 파생된 temp-dev branch로 merge를 진행

<br>

- User MVP : 사용자
> 비밀번호 찾기: 이메일을 통해 인증번호를 받음

> 회원 복구: 회원 탈퇴 시, 복구가 가능함

> Edit: '편집' 버튼을 눌러 프로필 이미지, 이름, 이메일, 인사말, 비밀번호를 수정 가능함

> 회원 탈퇴: 사용자가 회원을 탈퇴하는 기능이 가능함

<br>

- Award MVP (award-mvp-merge) : 수상이력
> Add: '+' 버튼을 눌러 수상내역과 상세내역을 입력하면 수상이력 정보가 추가됨

> Edit: '편집' 버튼을 눌러 수상이력 정보를 수정 가능함

> Delete: '삭제' 버튼을 눌러 해당 정보만 삭제 가능함

<br>

- Certificate MVP (certificate-mvp-merge) : 자격증
> Add: '+' 버튼을 눌러 자격증 제목과 상세내역을 입력 후, 취득일자를 선택하면 자격증 정보가 추가됨

> Edit: '편집' 버튼을 눌러 자격증 정보를 수정 가능함

> Delete: '삭제' 버튼을 눌러 해당 정보만 삭제 가능함

<br>

- Education MVP (education-mvp-merge) : 학력
> Add: '+' 버튼을 눌러 학교 이름과 전공을 입력 후, 상태를 선택하면 학력 정보가 추가됨

> Edit: '편집' 버튼을 눌러 학력 정보를 수정 가능함

> Delete: '삭제' 버튼을 눌러 해당 정보만 삭제 가능함

<br>

- Project MVP (project-mvp-merge) : 프로젝트
> Add: '+' 버튼을 눌러 프로젝트 제목과 상세내역을 입력 후, 상태를 선택하면 프로젝트 정보가 추가됨

> Edit: '편집' 버튼을 눌러 프로젝트 정보를 수정 가능함

> Delete: '삭제' 버튼을 눌러 해당 정보만 삭제 가능함

<br>

- Comment MVP (comment-mvp-merge) : 방명록
> Add: 댓글을 입력 후 submit 하면 방명록이 남게 됨

> reply: 댓글에 댓글을 다는 기능이 가능함

> Edit: '편집' 버튼을 눌러 댓글을 수정 가능함

> Delete: '삭제' 버튼을 눌러 해당 댓글만 삭제 가능함

> 댓글의 댓글 기능이 가능함 (해당 대댓글도 edit, delete가 가능함)

> 유저 회원 탈퇴가 이루어질 경우 탈퇴한 회원으로 표시됨

<br>

- Like MVP (like-mvp-merge) : 좋아요 기능
> 좋아요 기능: 좋아요를 누를 수 있는 기능이 포함되어있음 (네트워크에서는 누를 수 없으며, 해당 사용자의 포토폴리오 페이지에서 누를 수 있음)

<br>

- Gallery MVP (gallery-mvp-merge) : 갤러리
> 이미지 길이와 상관없이 항상 일정한 크기로 리사이징함

> Add: '+' 버튼을 눌러 이미지 선택과 상세내역을 입력 후 확인을 누르면 갤러리가 추가됨.

> Edit: '편집' 버튼을 눌러 해당 이미지의 상세내역 정보를 수정이 가능함

> Delete: '삭제' 버튼을 눌러 해당 갤러리 정보만 삭제 가능함

<br>

- User, Comment, Gallery MVP를 제외한 공통 기능
> Pagination: Add, Delete 기능에 맞게 한 페이지 당 3개씩의 정보를 보여주도록 함

<br>

## 테스트
- 팀원 5명이 dev branch에 구현된 기능들을 테스트

<br>

## 개발자 👨‍💻
|이름|포지션|
|------|---|
|이예원|팀장, 프론트엔드|
|배서영|프론트엔드|
|김기동|프론트엔드|
|정윤지|백엔드|
|송연석|백엔드|

<br>

## 기능 구현
### 기능 개선
1. 항목 삭제
2. 비밀번호 변경
3. 프로필 이미지
4. 좋아요
5. 반응형 웹
6. UI 고도화

<br>

### 기능 추가
1. 방명록
2. 갤러리
3. 탭 메뉴
4. 페이지네이션
5. 비밀번호찾기
6. 회원탈퇴/복구


---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.
