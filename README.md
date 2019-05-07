# README

云数据库 集和
colPartyMemberSystemManagement
colPartyMemberSystemMaterial

云存储 资源
storagePartyMemberSystemMaterial
  - document 
  - activity
  - contart
  - video

## PAGE

- management 系统管理
  - managementIndex 主界面
  - academyIndex && academyManagement 学院管理
  - branchDepartmentIndex && branchDepartmentManagement 支部管理&&班级管理
  - userIndex && userManagement 用户管理

- material
  - materialReview && materialUpload && materialIndex

## DATABASE DESIGN

  - colPartyMemberSystemManagement
      - academy

      ```json
      {
        type:'academy',
        name:'信息科技学院'
      }
      ```

      - branchDepartment

      ```json
      {
        type:'branchDepartment',
        parentId: [信息科技学院_id],
        name: '信息科技学院第一党支部'
      }
      ```

      - class

      ```json
      {
        type:'class',
        parentId: [信息科技学院_id],
        name: '信息科技学院第一党支部'
      }
      ```

      - user

      ```json
      {
        type:'user',
        username:'revang',
        password:'123',
        nickname: '吴钢明',
        userType:'',
        academyId:[学院_id],
        branchDepartmentId:[支部_id],
        classId:[班级_id],
        contartPersonId:[联系人_id],
        partyMemberType:'入党积极分子'
      }
      ```

## analysis 信息统计

- 用户统计 userTypeAnalysis

  （饼图）系统管理员/支部管理员/联系人/学生

    系统管理员：admin
    支部管理员：陆莹 陈安龙
    联系人：赵方 戴国勇 丁健龙
    学生：吴钢明 黄韵达 周默涵 林权祥 滕春雨 张素嵘 路人甲

- 学生政治面貌统计 studentPartyMemberTypeAnalysis

  （饼图）学生：正式党员/预备党员/入党积极分子/群众

  正式党员：吴钢明 林权祥
  预备党员：张素嵘
  入党积极分子：黄韵达 
  群众：周默涵 滕春雨 路人甲

- 支部统计 branchDepartmentTypeAnalysis

  （条形图）：统计每个学院的支部数量

  信息学院：信息第一党支部 信息第二... 信息第三... 
  城建学院：2
  管理学院：1
  生环学院：2
  现服学院：4
  人外学院: 3
  家扬书院：1

## 入党材料管理

- 提交文档

  ```json
  {
    type:'document',
    title:'吴钢明的入党申请书',
    documentType:'入党申请书',
    documentRes:[文档云储存路径],
    date:'2019/5/5',
    userId:[用户(吴钢明)_id]
  }
  ```

  - 审核文档

  ```json
  {
    type:'documentReview',
    userId:[用户_id],
    materialId:[文档_id],
    reviewState:true,
    reviewComment:'总体还行，思想还欠上进',
    reviewTime:[系统审核时间]
  }
  ```

## 志愿服务

  - 提交志愿服务

  ```json
  {
    type:'activity',
    title:'明宫真社区的志愿服务活动',
    activityAddress:[地址名称],
    activityMap:[地址经纬度],
    activityRes:[(列表)文档云储存路径],
    activityComment:'这次的志愿服务活动收获很大',
    activityduration:'3小时',
    date:'2019/5/5',
    userId:[用户(吴钢明)_id]
  }
  ```

  - 审核志愿活动

  ```json
  {
    type:'activityReview',
    materialId:[志愿活动_id],
    reviewState:true,
    reviewComment:'多参与，多贡献',
    reviewTime:[系统审核时间]
  }
  ```

## 三联系

  - 提交三联系

  ```json
  {
    type:'contart',
    title:'联系学习困难户路人甲',
    activityAddress:[地址名称],
    activityMap:[地址经纬度],
    activityRes:[(列表)文档云储存路径],
    activityComment:'这次的志愿服务活动收获很大',
    activityduration:'3小时',
    date:'2019/5/5',
    userId:[用户(吴钢明)_id]
  }
  ```

  - 审核三联系

  ```json
  {
    type:'contartReview',
    materialId:[志愿活动_id],
    reviewState:true,
    reviewComment:'多参与，多贡献',
    reviewTime:[系统审核时间]
  }
  ```


## 审核显示信息

```json
{
  nickname:'吴钢明',
  academyName:'信息学院',
  branchDepartmentName:'信息第一党支部',
  className:'计算机154班',
  partyMemberType:'正式党员',

  title:'吴钢明的入党申请书',
  documentType:'入党申请书',
  documentRes:[文档云储存路径],
  date:'2019/5/5',
}
```
