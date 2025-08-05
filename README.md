## 2024-01-27

- app 忘记密码接口报错
- app 修改性别报错
- app 修改疾病是否公开无效
- app 病历详情接口没有返回病历图片字段
- app 项目我的报名列表，填的疾病、地区没返回，项目状态翻译返回的不对
- app 项目我的报名列表搜索报错
- app 罕见名医详情接口字段缺少，头像、名称、等等 参考app
- app 罕见病组织详情接口缺少省市字段
- pc 罕见药典列表分页有问题，一页给了10 但数据全给返回了，顺便确认下其他列表有没有这个问题
- pc 罕见病关联列表缺少 创建时间、更新时间
- pc 项目加入者列表缺少 省市、创建时间、更新时间
- pc 机构管理列表缺少 省市
- pc 志愿者管理编辑接口报错
- pc 医院管理编辑接口 省市修改无效
- pc 新药临床中心列表相关字段翻译
- pc 医保药物是否处方药字段保存不了

## 2023-12-20 APP现有接口问题

- 1-医保药物列表接口字段翻译
- 2-医保药物列表接口关键字搜索无效
- 3-医保药物详情接口字段翻译
- 4-罕见病组织列表接口查不出数据
- 5-罕见病组织列表接口字段翻译
- 6-罕见病组织详情接口字段翻译
- 7-医保政策列表关键字搜索无效
- 8-医保政策详情接口字段翻译
- 9-罕见名医列表接口缺少头像字段
- 10-罕见名医列表接口关键字搜索无效
- 11-罕见名医详情接口字段缺少
- 12-前沿治疗列表接口关键词搜索无效
- 13-资讯列表接口关键词搜索无效
- 14-项目列表接口关键词搜索无效
- 15-项目详情接口字段翻译
- 16-新增电子病历 多文件路径、多图片
- 17-电子病历详情接口翻译字段
- 18- ~~动态、求助、倡导 列表缺少：状态、头像、转发数、喜欢数、点赞数、留言数等字段~~；
- 19- ~~志愿者&活动缺少查询列表接口~~；
- 20- ~~新增动态缺少图片字段~~；
- 21- ~~动态、求助、倡导新增接口报错~~；
- 22- ~~动态、求助、倡导 列表缺少：状态、头像等字段~~；
- 23- ~~转发、点赞、喜欢接口无效~~；
- 24- ~~留言接口统一~~；
- 25-新增 留言接口、新增 动态、求助、倡导，content 包含表情包时报错；
- 26-~~留言列表接口缺少：头像、昵称等字段~~；
- 27-文件上传接口：①返回url无法访问；②图片2.9mb时，报错：“uploadFile:fail HTTP 413Request Entity Too Large”
- 28- ~~动态、求助、志愿者、倡导、抽奖列表：需返回是否已喜欢、点赞字段~~
- 29- ~~倡导 新增评论成功后，列表查不到~~
- 30- ~~倡导、抽奖列表缺少：是否已点赞、是否已喜欢等字段~~
- 31- 动态 新增添加的图片，列表中查不到；
- 32- 动态列表缺少疾病字段
- 33- 缺少我的求助接口（分页）
- 34- 我的抽奖接口 需返回分页数据，现在返回“{status: 0}”

用户信息修改接口还缺

## APP缺少接口

- 注册
- 用户信息接口
- 修改用户信息接口
- 我的报名列表接口 支持根据项目id筛选
- 罕见药典模块接口

- app 医保政策列表查不出数据
- app 罕见病组织列表查不出数据
- app 就医指南列表查不出数据

```vue
<ProSearch :model-value="keyword" @search="handleSearch">
      <template #suffer>
        <VanIcon name="filter-o" />
      </template>
    </ProSearch>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .project-item-status {
    @extend %pa;
    @extend %cfff;
    @extend %tac;
    width: j(80);
    font-size: j(12);
    transform: rotate(45deg);
    right: j(-18);
    top: j(12);
    &.status-0 {
      background-color: $color-primary;
    }
    &.status-1 {
      background-color: #999;
    }
  }
</style>
```

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
