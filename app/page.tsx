"use client";

import { useEffect, useMemo, useState } from "react";

type Toast = { message: string; tone?: "default" | "success" | "warning" } | null;

const navGroups = [
  { icon: "AI", label: "AI创作" },
  { icon: "库", label: "资产库" },
  { icon: "投", label: "推广自动化" },
  { icon: "店", label: "抖店运营" },
];

const creatorNav = ["工作台", "达人库", "达人采集", "建联管理", "历史达人分析", "定向链接自动化"];

const taskSeed = [
  { id: 1, tone: "danger", title: "定向链接执行异常", meta: "8 个自动化任务异常", action: "去处理", view: "定向链接自动化", filter: "任务状态 = 异常" },
  { id: 2, tone: "danger", title: "达人采集任务失败", meta: "3 个采集任务执行失败", action: "去处理", view: "达人采集", filter: "状态 = 执行失败" },
  { id: 3, tone: "warning", title: "达人采集异常", meta: "2 个采集任务存在失败数据", action: "去处理", view: "达人采集", filter: "状态 = 部分失败" },
  { id: 4, tone: "warning", title: "建联状态长期未更新", meta: "15 个达人超过 3 天未更新状态", action: "去处理", view: "建联管理", filter: "状态 = 沟通中 · 更新时间超过3天" },
  { id: 5, tone: "brand", title: "待处理达人回复", meta: "23 个达人等待商务跟进", action: "去处理", view: "建联管理", filter: "状态 = 已回复" },
  { id: 6, tone: "brand", title: "合作意向待处理", meta: "8 个达人等待确认", action: "去处理", view: "建联管理", filter: "状态 = 达成合作意向" },
  { id: 7, tone: "neutral", title: "待分配达人较多", meta: "126 个达人等待分配", action: "去处理", view: "达人库", filter: "建联状态 = 未分配" },
];

const batches = [
  { id: "FP20260818007", product: "创维循环扇", owner: "陈小雨", count: 120, added: 86, replied: 31, intent: 12 },
  { id: "FP20260818006", product: "小熊破壁机", owner: "林晓婷", count: 80, added: 72, replied: 28, intent: 9 },
  { id: "FP20260817012", product: "苏泊尔空气炸锅", owner: "张文豪", count: 150, added: 146, replied: 63, intent: 21 },
  { id: "FP20260817009", product: "追觅洗地机", owner: "赵明轩", count: 60, added: 60, replied: 26, intent: 8 },
];

const activities = [
  { time: "10:26", icon: "采", title: "短视频达人抓取完成", text: "新增 1,183 位达人，更新 2,406 位" },
  { time: "09:48", icon: "链", title: "定向链接批量任务完成", text: "成功 36 条，异常 2 条" },
  { time: "09:15", icon: "分", title: "新建分配批次", text: "陈小雨获得 120 位循环扇达人" },
  { time: "08:42", icon: "数", title: "历史成交数据导入完成", text: "匹配 428 位达人，17 条待处理" },
];

const creators = [
  { id: "c0", name: "机哥", uid: "Jige006", initials: "机", type: "短视频", followers: "110.6万", gmv: "直播 0 · 视频 0", category: "3C数码家电", price: "—", score: 42, source: "精选联盟", update: "2026-06-05 19:24", avatar: "blue", history: "待建联", platform: "抖音", wechat: "", phone: "", delivery: "推广品 76 · 合作店 51", audience: "女35% · 男65%｜31–40岁 43%｜都市银发20%、小镇中老年16%、新锐白领16%", matchNote: "粉丝性别严重失衡（男性65%），精致妈妈仅5%，与产品强女性向定位严重错配；短视频带货为0，不推荐合作。", storeName: "康佳冷茂专卖店", createdAt: "2026-06-01 20:11" },
  { id: "c1", name: "小家电研究所", uid: "dy_86541972", initials: "家", type: "短视频", followers: "86.4万", gmv: "128.6万", category: "家电测评", price: "300–500元", score: 92, source: "蝉妈妈", update: "10:26", avatar: "blue", history: "历史建联" },
  { id: "c2", name: "洁净生活家", uid: "dy_10376294", initials: "洁", type: "短视频", followers: "42.8万", gmv: "76.2万", category: "清洁收纳", price: "200–500元", score: 88, source: "精选联盟", update: "10:18", avatar: "pink", history: "S级合作" },
  { id: "c3", name: "懒人厨房", uid: "dy_59724081", initials: "厨", type: "短视频", followers: "113.2万", gmv: "246.8万", category: "美食家电", price: "100–300元", score: 84, source: "蝉妈妈", update: "09:57", avatar: "orange", history: "无历史" },
  { id: "c4", name: "家居好物直播间", uid: "dy_77510684", initials: "居", type: "直播", followers: "58.9万", gmv: "315.4万", category: "家居百货", price: "300–800元", score: 90, source: "竞品抓取", update: "09:42", avatar: "purple", history: "历史建联" },
  { id: "c5", name: "阿阳测评", uid: "dy_42917835", initials: "阳", type: "直播", followers: "71.5万", gmv: "189.3万", category: "数码家电", price: "500–1000元", score: 86, source: "竞品抓取", update: "09:23", avatar: "green", history: "A级合作" },
  { id: "c6", name: "暖暖的居家日记", uid: "dy_31562099", initials: "暖", type: "短视频", followers: "29.1万", gmv: "52.4万", category: "居家生活", price: "200–500元", score: 95, source: "精选联盟", update: "08:56", avatar: "yellow", history: "无历史" },
  { id: "c7", name: "阿布家电实验室", uid: "dy_65790218", initials: "布", type: "短视频", followers: "64.7万", gmv: "110.3万", category: "家电测评", price: "500–1000元", score: 91, source: "蝉妈妈", update: "08:43", avatar: "purple", history: "A级合作" },
  { id: "c8", name: "收纳研究员", uid: "dy_24680137", initials: "纳", type: "短视频", followers: "36.2万", gmv: "64.8万", category: "清洁收纳", price: "100–300元", score: 82, source: "精选联盟", update: "08:35", avatar: "green", history: "历史建联" },
  { id: "c9", name: "家电阿喵", uid: "dy_91043726", initials: "喵", type: "短视频", followers: "18.6万", gmv: "38.7万", category: "家电测评", price: "200–500元", score: 76, source: "蝉妈妈", update: "08:21", avatar: "pink", history: "无历史" },
  { id: "c10", name: "生活电器大玩家", uid: "dy_82076419", initials: "玩", type: "短视频", followers: "95.3万", gmv: "167.9万", category: "居家生活", price: "300–800元", score: 89, source: "精选联盟", update: "08:07", avatar: "blue", history: "S级合作" },
  { id: "c11", name: "小周直播选品", uid: "dy_54290168", initials: "周", type: "直播", followers: "47.6万", gmv: "228.4万", category: "家居百货", price: "200–500元", score: 83, source: "精选联盟", update: "09:01", avatar: "yellow", history: "无历史" },
  { id: "c12", name: "小李的家电局", uid: "dy_69012457", initials: "李", type: "直播", followers: "88.2万", gmv: "462.1万", category: "数码家电", price: "500–1000元", score: 94, source: "竞品抓取", update: "08:49", avatar: "blue", history: "历史建联" },
  { id: "c13", name: "好物严选直播间", uid: "dy_23876410", initials: "选", type: "直播", followers: "32.5万", gmv: "145.8万", category: "居家生活", price: "100–300元", score: 95, source: "蝉妈妈", update: "08:31", avatar: "orange", history: "无历史" },
  { id: "c14", name: "乐妈家居直播", uid: "dy_76129840", initials: "乐", type: "直播", followers: "66.9万", gmv: "278.6万", category: "家居百货", price: "300–800元", score: 87, source: "竞品抓取", update: "08:12", avatar: "pink", history: "A级合作" },
  { id: "c15", name: "实用家电直播站", uid: "dy_18429650", initials: "实", type: "直播", followers: "40.8万", gmv: "156.2万", category: "数码家电", price: "200–500元", score: 96, source: "精选联盟", update: "07:58", avatar: "green", history: "无历史" },
];

type OutreachStage = "未建联" | "已分配" | "已添加" | "已同意" | "已回复" | "达成意向" | "未达成";
type OutreachProcessStage = "已分配" | "已添加" | "已同意" | "已回复";
type OutreachFinalResult = "达成意向" | "未达成";
type OutreachRecord = { processStage?: OutreachProcessStage; finalResult?: OutreachFinalResult; /** 兼容既有演示数据的状态摘要，不作为任务状态源。 */ stage?: OutreachStage; assignedAt?: string; assignedBy?: string; owner?: string; batch?: string; batchSize?: number; batchCreatedAt?: string; taskId?: string; product?: string; addedAt?: string; agreedAt?: string; repliedAt?: string; intentAt?: string; unreachedAt?: string; unreachedStage?: string; unreachedReason?: string; note?: string };

const processStages: OutreachProcessStage[] = ["已分配", "已添加", "已同意", "已回复"];
function getTaskSummary(task?: OutreachRecord): OutreachStage {
  if (!task) return "未建联";
  return task.finalResult ?? task.processStage ?? task.stage ?? "未建联";
}

const outreachRecords: Record<string, OutreachRecord> = {
  c0: { stage: "未建联" },
  c1: { stage: "已分配", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180071", product: "创维循环扇", note: "优先确认微信号有效性后发起添加。" },
  c2: { stage: "已添加", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180072", product: "创维循环扇", addedAt: "2026-08-18 14:26", note: "已通过微信搜索添加，等待达人通过。" },
  c3: { stage: "已同意", assignedAt: "2026-08-17 14:20", assignedBy: "林晓婷", owner: "张文豪", batch: "FP20260817012", batchSize: 150, batchCreatedAt: "2026-08-17 14:20", taskId: "CT202608170126", product: "苏泊尔空气炸锅", addedAt: "2026-08-17 16:08", agreedAt: "2026-08-18 10:12", note: "达人已通过好友申请，待发送合作简介。" },
  c4: { stage: "已回复", assignedAt: "2026-08-17 10:05", assignedBy: "陈旭光", owner: "赵明轩", batch: "FP20260817009", batchSize: 60, batchCreatedAt: "2026-08-17 10:05", taskId: "CT202608170093", product: "追觅洗地机", addedAt: "2026-08-17 11:24", agreedAt: "2026-08-17 13:48", repliedAt: "2026-08-18 09:36", note: "达人表示可先看样品与佣金方案。" },
  c5: { stage: "达成意向", assignedAt: "2026-08-16 11:30", assignedBy: "陈旭光", owner: "林晓婷", batch: "FP20260818006", batchSize: 80, batchCreatedAt: "2026-08-16 11:30", taskId: "CT202608180064", product: "小熊破壁机", addedAt: "2026-08-16 13:16", agreedAt: "2026-08-16 15:42", repliedAt: "2026-08-17 10:28", intentAt: "2026-08-18 11:06", note: "已确认合作意向，等待寄样并创建定向链接。" },
  c6: { stage: "未建联" },
  c7: { stage: "已分配", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180079", product: "创维循环扇", note: "已进入今日优先建联名单。" },
  c8: { stage: "已添加", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180081", product: "创维循环扇", addedAt: "2026-08-18 15:04", note: "已发送好友申请。" },
  c9: { stage: "未建联" }, c10: { stage: "已同意", assignedAt: "2026-08-17 14:20", assignedBy: "林晓婷", owner: "张文豪", batch: "FP20260817012", batchSize: 150, batchCreatedAt: "2026-08-17 14:20", taskId: "CT202608170121", product: "苏泊尔空气炸锅", addedAt: "2026-08-17 16:36", agreedAt: "2026-08-18 08:54", note: "已同意添加，待商务首次沟通。" },
  c11: { stage: "已回复", assignedAt: "2026-08-17 10:05", assignedBy: "陈旭光", owner: "赵明轩", batch: "FP20260817009", batchSize: 60, batchCreatedAt: "2026-08-17 10:05", taskId: "CT202608170098", product: "追觅洗地机", addedAt: "2026-08-17 12:02", agreedAt: "2026-08-17 17:15", repliedAt: "2026-08-18 09:01", note: "达人询问排期，已回复合作资料。" },
  c12: { stage: "达成意向", assignedAt: "2026-08-16 11:30", assignedBy: "陈旭光", owner: "林晓婷", batch: "FP20260818006", batchSize: 80, batchCreatedAt: "2026-08-16 11:30", taskId: "CT202608180068", product: "小熊破壁机", addedAt: "2026-08-16 14:12", agreedAt: "2026-08-16 16:05", repliedAt: "2026-08-17 11:46", intentAt: "2026-08-18 10:40", note: "已确认报价与排期，进入合作准备。" },
  c13: { stage: "未达成", assignedAt: "2026-08-15 10:20", assignedBy: "陈旭光", owner: "赵明轩", batch: "FP20260817009", batchSize: 60, batchCreatedAt: "2026-08-15 10:20", taskId: "CT202608170097", product: "追觅洗地机", addedAt: "2026-08-15 14:10", unreachedAt: "2026-08-18 16:18", unreachedStage: "添加阶段", unreachedReason: "长期未回复", note: "已完成沟通但本次合作未达成，可重新分配给其他商务跟进。" }, c14: { stage: "已添加", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180088", product: "创维循环扇", addedAt: "2026-08-18 16:18", note: "已添加，待对方通过。" }, c15: { stage: "未建联" },
};

// 将旧演示数据迁移为“过程阶段 + 最终结果”模型；页面摘要始终由这两个字段派生。
Object.values(outreachRecords).forEach((task) => {
  const legacy = task.stage;
  if (legacy && processStages.includes(legacy as OutreachProcessStage)) task.processStage = legacy as OutreachProcessStage;
  if (legacy === "达成意向" || legacy === "未达成") task.finalResult = legacy;
  if (!task.processStage && task.assignedAt) task.processStage = task.repliedAt ? "已回复" : task.agreedAt ? "已同意" : task.addedAt ? "已添加" : "已分配";
  delete (task as OutreachRecord & { product?: string }).product;
});

type SharedOutreachTask = {
  taskId: string;
  creatorId: string;
  batchId: string;
  owner: string;
  processStage?: OutreachProcessStage;
  finalResult?: OutreachFinalResult;
  createdAt: string;
  updatedAt: string;
  assignedBy: string;
};

// 统一建联任务数据源：页面只从这份任务主档派生当前状态和历史记录。
let sharedOutreachTasks: SharedOutreachTask[] = Object.entries(outreachRecords)
  .filter(([, task]) => getTaskSummary(task) !== "未建联" && task.taskId)
  .map(([creatorId, task]) => ({ taskId: task.taskId!, creatorId, batchId: task.batch ?? "—", owner: task.owner ?? "—", processStage: task.processStage, finalResult: task.finalResult, createdAt: task.assignedAt ?? "—", updatedAt: task.repliedAt ?? task.agreedAt ?? task.addedAt ?? task.assignedAt ?? "—", assignedBy: task.assignedBy ?? "—" }));

function publishSharedOutreachTasks(tasks: SharedOutreachTask[]) {
  sharedOutreachTasks = tasks;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("outreach-tasks-updated"));
}

// 达人归属为单选。命中更高优先级采集时，覆盖旧归属和旧采集信息：竞品达人 > 直播达人 > 短视频达人。
const creatorRelationProfiles: Record<string, { type: "短视频" | "直播" | "竞品达人"; acquisitionSource: string; competitorStores: string[] }> = {
  c1: { type: "直播", acquisitionSource: "直播达人抓取", competitorStores: [] },
  c2: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["美的生活电器旗舰店"] },
  c4: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["美的生活电器旗舰店", "米家官方旗舰店"] },
  c5: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["小熊官方旗舰店"] },
  c7: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["奥克斯生活电器旗舰店", "志高电器旗舰店"] },
  c11: { type: "直播", acquisitionSource: "直播达人抓取", competitorStores: [] },
  c12: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["苏泊尔厨电旗舰店", "九阳官方旗舰店", "美的生活电器旗舰店"] },
  c13: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["小熊官方旗舰店"] },
  c14: { type: "竞品达人", acquisitionSource: "竞品直播间抓取", competitorStores: ["奥克斯生活电器旗舰店", "志高电器旗舰店"] },
};

// 达人类型只保留当前最高优先级归属；采集来源则保留可追溯的历史记录，不随迁移删除。
const creatorAcquisitionHistory: Record<string, Array<{ collectedAt: string; sourceType: string; sourceObject: string; taskId: string }>> = {
  c2: [
    { collectedAt: "2026-08-13 08:20", sourceType: "短视频达人抓取", sourceObject: "短视频达人·清洁收纳", taskId: "CT202608130012" },
  ],
  c4: [
    { collectedAt: "2026-08-12 09:10", sourceType: "短视频达人抓取", sourceObject: "短视频达人·家居百货", taskId: "CT202608120008" },
    { collectedAt: "2026-08-15 06:05", sourceType: "直播达人抓取", sourceObject: "直播达人全量更新", taskId: "CT202608150019" },
  ],
  c5: [
    { collectedAt: "2026-08-14 06:12", sourceType: "直播达人抓取", sourceObject: "直播达人全量更新", taskId: "CT202608140016" },
  ],
  c7: [
    { collectedAt: "2026-08-11 07:46", sourceType: "短视频达人抓取", sourceObject: "短视频达人·家电测评", taskId: "CT202608110006" },
  ],
  c12: [
    { collectedAt: "2026-08-10 06:20", sourceType: "直播达人抓取", sourceObject: "直播达人全量更新", taskId: "CT202608100011" },
  ],
};

const creatorRows = creators.map((creator, index) => ({
  ...creator,
  ...(creatorRelationProfiles[creator.id] ?? { type: creator.type as "短视频" | "直播", acquisitionSource: creator.type === "直播" ? "直播达人抓取" : "短视频达人抓取", competitorStores: [] }),
  settlement: index === 0 ? "25万-50万" : ["50万-100万", "25万-50万", "10万-25万", "100万-200万"][index % 4],
  live: index === 0 ? "5000-7500 (51%)" : `${3200 + (index % 6) * 700}-${5200 + (index % 6) * 700} (${42 + (index % 8)}%)`,
  video: index === 0 ? "5000-7500 (45%)" : `${2800 + (index % 5) * 650}-${4800 + (index % 5) * 650} (${38 + (index % 9)}%)`,
  products: index === 0 ? 150 : 72 + (index % 8) * 13,
  stores: index === 0 ? 64 : 28 + (index % 7) * 6,
  contactStatus: getTaskSummary(outreachRecords[creator.id]),
  outreach: outreachRecords[creator.id],
  platform: "抖音",
  wechat: index === 0 ? "" : `creator_${creator.uid.replace("dy_", "")}`,
  phone: "",
  delivery: index === 0 ? "推广品 150 · 合作店 64" : `推广品 ${72 + (index % 8) * 13} · 合作店 ${28 + (index % 7) * 6}`,
  audience: index === 0 ? "女35% · 男65%｜31–40岁 43%｜都市银发20%、小镇中老年16%、新锐白领16%" : `女${48 + (index % 9)}% · 男${52 - (index % 9)}%｜24–30岁 ${24 + (index % 8)}%｜31–40岁 ${31 + (index % 7)}%｜核心人群：${creator.category}兴趣人群`,
  matchNote: index === 0 ? "粉丝性别严重失衡（男性65%），精致妈妈仅5%，与产品强女性向定位严重错配；不推荐合作。" : `内容垂直度较高，${creator.category}相关内容表现稳定；建议结合近30天结算和建联状态评估合作优先级。`,
  storeName: index === 0 ? "康佳冷茂专卖店" : `${creator.category}精选店`,
  createdAt: index === 0 ? "2026-06-01 20:11" : "2026-06-01 10:00",
}));

type CollectionCreatorType = "短视频达人" | "直播达人" | "竞品达人";
const creatorTypePriority: Record<CollectionCreatorType, number> = { "短视频达人": 1, "直播达人": 2, "竞品达人": 3 };

function normalizeCreatorType(type?: string): CollectionCreatorType {
  if (type?.includes("竞品")) return "竞品达人";
  if (type?.includes("直播")) return "直播达人";
  return "短视频达人";
}

/** 采集入库统一使用此方法计算达人主档归属，避免不同入口各自覆盖类型。 */
function resolveCreatorType(existingType: string | undefined, incomingType: string): CollectionCreatorType {
  const existing = normalizeCreatorType(existingType);
  const incoming = normalizeCreatorType(incomingType);
  return creatorTypePriority[incoming] > creatorTypePriority[existing] ? incoming : existing;
}

function toLibraryCreatorType(type: CollectionCreatorType): "短视频" | "直播" | "竞品达人" {
  return type === "短视频达人" ? "短视频" : type === "直播达人" ? "直播" : "竞品达人";
}

/** 模拟一次采集结果逐条写入达人库：平台+UID命中则更新并追加来源历史，否则创建主档。 */
function ingestCollectionResults(task: { id: string; type: string; source: string; config: string }) {
  const incomingType = normalizeCreatorType(task.type);
  const sourceType = `${incomingType}抓取`;
  const sourceObject = `${task.config} · ${task.source}`;
  const samples = [
    { platform: "抖音", uid: "dy_86541972" },
    { platform: "抖音", uid: `dy_${task.id.slice(-5)}` },
  ];
  samples.forEach(({ platform, uid }) => {
    const existing = creatorRows.find((creator) => creator.platform === platform && creator.uid === uid);
    const collectedAt = "刚刚";
    if (existing) {
      const resolvedType = resolveCreatorType(existing.type, incomingType);
      existing.type = toLibraryCreatorType(resolvedType);
      existing.source = task.source;
      existing.acquisitionSource = sourceType;
      existing.update = collectedAt;
      creatorAcquisitionHistory[existing.id] ??= [];
      creatorAcquisitionHistory[existing.id].unshift({ collectedAt, sourceType, sourceObject, taskId: task.id });
      return;
    }
    const template = creatorRows[0];
    const id = `c_collection_${task.id}_${uid}`;
    creatorRows.push({
      ...template,
      id,
      name: `新采集达人 ${uid.replace("dy_", "")}`,
      uid,
      initials: "新",
      type: toLibraryCreatorType(resolveCreatorType(undefined, incomingType)),
      source: task.source,
      update: collectedAt,
      contactStatus: "未建联",
      outreach: undefined,
      acquisitionSource: sourceType,
      competitorStores: [],
      platform,
    });
    creatorAcquisitionHistory[id] = [{ collectedAt, sourceType, sourceObject, taskId: task.id }];
  });
}

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("工作台");
  const [period, setPeriod] = useState<7 | 30>(7);
  const [tasks, setTasks] = useState(taskSeed);
  const [toast, setToast] = useState<Toast>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [refreshed, setRefreshed] = useState("10:30");
  const [layerMetric, setLayerMetric] = useState<"成交金额" | "达人数量">("成交金额");

  const metrics = useMemo(() => period === 7 ? [
    { label: "累计达人资产", value: "128,642", detail: "截至当前平台累计沉淀的去重达人数量", trend: "累计", icon: "达", color: "violet" },
    { label: "今日新增达人", value: "3,589", detail: "今日通过达人采集新增进入达人库的达人数量", trend: "今日", icon: "新", color: "cyan" },
    { label: "待分配达人", value: "126", detail: "当前未创建建联任务的达人数量", trend: "需处理", icon: "分", color: "orange" },
    { label: "定向链接异常", value: "8", detail: "当前需要处理的自动化执行异常任务数量", trend: "需处理", icon: "链", color: "red" },
  ] : [
    { label: "累计达人资产", value: "128,642", detail: "截至当前平台累计沉淀的去重达人数量", trend: "累计", icon: "达", color: "violet" },
    { label: "今日新增达人", value: "3,589", detail: "今日通过达人采集新增进入达人库的达人数量", trend: "今日", icon: "新", color: "cyan" },
    { label: "待分配达人", value: "126", detail: "当前未创建建联任务的达人数量", trend: "需处理", icon: "分", color: "orange" },
    { label: "定向链接异常", value: "8", detail: "当前需要处理的自动化执行异常任务数量", trend: "需处理", icon: "链", color: "red" },
  ], [period]);

  const funnelComparison = useMemo(() => period === 7 ? [
    { label: "本周", caption: "近7天", tone: "current", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 74 }, { label: "已同意", percentage: 54 }, { label: "已回复", percentage: 38 }, { label: "达成意向", percentage: 22 }] },
    { label: "上周", caption: "前7天", tone: "previous", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 71 }, { label: "已同意", percentage: 50 }, { label: "已回复", percentage: 33 }, { label: "达成意向", percentage: 17 }] },
  ] : [
    { label: "本周期", caption: "近30天", tone: "current", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 75 }, { label: "已同意", percentage: 56 }, { label: "已回复", percentage: 41 }, { label: "达成意向", percentage: 24 }] },
    { label: "上一周期", caption: "前30天", tone: "previous", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 72 }, { label: "已同意", percentage: 51 }, { label: "已回复", percentage: 35 }, { label: "达成意向", percentage: 19 }] },
  ], [period]);

  const creatorLayerData = useMemo(() => {
    const amount = period === 7 ? [
      { label: "头部", value: "2.1k", percentage: 0.36 }, { label: "肩部", value: "27.7w", percentage: 47.94 }, { label: "中腰部", value: "4.1k", percentage: 0.71 }, { label: "腰部", value: "2.1w", percentage: 3.65 }, { label: "小达人", value: "6.2w", percentage: 10.79 }, { label: "尾部达人", value: "21.1w", percentage: 36.55 },
    ] : [
      { label: "头部", value: "8.6k", percentage: 0.48 }, { label: "肩部", value: "96.4w", percentage: 48.22 }, { label: "中腰部", value: "1.7w", percentage: 0.86 }, { label: "腰部", value: "7.2w", percentage: 3.6 }, { label: "小达人", value: "22.1w", percentage: 11.06 }, { label: "尾部达人", value: "71.6w", percentage: 35.78 },
    ];
    const count = period === 7 ? [
      { label: "头部", value: "12", percentage: 0.9 }, { label: "肩部", value: "183", percentage: 13.8 }, { label: "中腰部", value: "428", percentage: 32.2 }, { label: "腰部", value: "315", percentage: 23.7 }, { label: "小达人", value: "269", percentage: 20.2 }, { label: "尾部达人", value: "121", percentage: 9.1 },
    ] : [
      { label: "头部", value: "47", percentage: 1.1 }, { label: "肩部", value: "738", percentage: 17.2 }, { label: "中腰部", value: "1,286", percentage: 30.0 }, { label: "腰部", value: "982", percentage: 22.9 }, { label: "小达人", value: "846", percentage: 19.7 }, { label: "尾部达人", value: "389", percentage: 9.1 },
    ];
    return layerMetric === "成交金额" ? amount : count;
  }, [layerMetric]);

  const businessExecution = useMemo(() => period === 7 ? [
    { owner: "陈小雨", assigned: 120, replied: 48, intent: 12 },
    { owner: "林晓婷", assigned: 98, replied: 36, intent: 9 },
    { owner: "张文豪", assigned: 86, replied: 31, intent: 7 },
  ] : [
    { owner: "陈小雨", assigned: 486, replied: 196, intent: 52 },
    { owner: "林晓婷", assigned: 402, replied: 158, intent: 41 },
    { owner: "张文豪", assigned: 368, replied: 142, intent: 35 },
  ], [period]);

  useEffect(() => {
    const panel = document.querySelector<HTMLElement>(".activity-panel");
    if (!panel) return;
    panel.innerHTML = `<div class="panel-head"><div><h2>商务执行情况</h2><p>统计周期：${period === 7 ? "近7天" : "近30天"}</p></div></div><div class="business-execution-table"><div class="business-execution-head"><span>商务</span><span>建联人数</span><span>回复人数</span><span>合作意向</span></div>${businessExecution.map((item) => `<div class="business-execution-row"><strong>${item.owner}</strong><span>${item.assigned}</span><span>${item.replied}</span><span>${item.intent}</span></div>`).join("")}</div>`;
  }, [businessExecution, period]);

  function notify(message: string, tone: NonNullable<Toast>["tone"] = "default") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2400);
  }

  function finishTask(id: number) {
    const target = tasks.find((task) => task.id === id);
    setTasks((current) => current.filter((task) => task.id !== id));
    notify(`${target?.title ?? "待办"}已进入处理流程`, "success");
  }

  function openTodo(task: typeof taskSeed[number]) {
    setCurrentView(task.view);
    notify(`已进入${task.view}，自动筛选：${task.filter}`, "success");
  }

  return (
    <main className={`app-shell ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar" aria-label="主导航">
        <div className="brand-block">
          <div className="brand-mark">罗</div>
          <div className="brand-copy"><strong>内容罗盘</strong><span>AI 内容增长平台</span></div>
          <button className="collapse-btn" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "展开导航" : "收起导航"}>{collapsed ? "›" : "‹"}</button>
        </div>

        <nav className="nav-scroll">
          {navGroups.map((group) => (
            <div className="nav-group compact-group" key={group.label}>
              <button className="nav-group-title" onClick={() => notify(`${group.label}不在本次原型范围内`)}>
                <span className="nav-icon">{group.icon}</span><strong>{group.label}</strong><i>⌄</i>
              </button>
            </div>
          ))}

          <div className="nav-group creator-group">
            <div className="nav-group-title open"><span className="nav-icon">达</span><strong>达人建联</strong><i>⌃</i></div>
            <div className="nav-sublist">
              {creatorNav.map((item) => (
                <button key={item} className={`nav-item ${item === currentView ? "active" : ""}`} onClick={() => item === "历史达人分析" ? notify("历史达人分析功能暂未开放", "warning") : ["工作台", "达人库", "达人采集", "建联管理", "定向链接自动化"].includes(item) ? setCurrentView(item) : notify(`${item}页面将在下一步继续设计`)}>
                  <span className="nav-dot" />{item}
                </button>
              ))}
            </div>
          </div>
        </nav>

        <div className="account-block"><div className="user-avatar">陈</div><div className="account-copy"><strong>陈旭光</strong><span>产品管理员</span></div><button aria-label="账户菜单">···</button></div>
      </aside>

      <section className="main-content">
        {currentView === "工作台" ? <>
        <header className="page-header">
          <div><h1>达人建联工作台</h1><p>集中查看达人采集、分配建联与定向链接的今日进展。</p></div>
          <div className="header-actions">
            <button className="ghost-button" onClick={() => { setRefreshed(new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })); notify("数据已刷新", "success"); }}><span>↻</span> 刷新数据</button>
          </div>
        </header>

        <div className="context-row">
          <div className="date-chip" aria-label="当前日期"><span>今天</span> 2026年8月18日 · 星期二</div><div className="refresh-note">数据更新于 {refreshed}</div>
          <div className="period-switch" aria-label="周期筛选"><button aria-pressed={period === 7} className={period === 7 ? "active" : ""} onClick={() => setPeriod(7)}>近7天</button><button aria-pressed={period === 30} className={period === 30 ? "active" : ""} onClick={() => setPeriod(30)}>近30天</button></div>
        </div>

        <section className="metric-grid" aria-label="核心指标">
          {metrics.map((metric) => <article className="metric-card" key={metric.label} title={metric.label === "累计达人资产" ? "平台累计去重达人数量" : metric.label === "今日新增达人" ? "当天新增进入达人库的达人数量" : metric.label === "待分配达人" ? "当前未创建建联任务的达人数量" : "当前需要处理的自动化执行异常任务数量"}><div className={`metric-icon ${metric.color}`}>{metric.icon}</div><div className="metric-main"><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></div><span className={`metric-trend ${metric.color}`}>{metric.trend}</span></article>)}
        </section>

        <section className="dashboard-grid top-grid">
          <article className="panel funnel-panel">
            <div className="panel-head"><div><h2>建联转化漏斗</h2><p>统计周期：{period === 7 ? "近7天" : "近30天"}<br/><span>统计创建建联任务后的达人转化情况；进入建联 = 创建建联任务的达人数量。</span></p></div><button className="text-button" onClick={() => setCurrentView("建联管理")}>查看全部 <span>→</span></button></div>
            <div className="funnel-summary">
              <div><strong>{period === 7 ? "1,268" : "5,486"}</strong><span>进入建联</span></div><i>→</i>
              <div><strong>{period === 7 ? "943" : "4,102"}</strong><span>已添加</span><small>74.4%</small></div><i>→</i>
              <div><strong>{period === 7 ? "511" : "2,296"}</strong><span>已同意</span><small>54.2%</small></div><i>→</i>
              <div><strong>{period === 7 ? "286" : "1,147"}</strong><span>已回复</span><small>56.0%</small></div><i>→</i>
              <div className="success-stage"><strong>{period === 7 ? "89" : "372"}</strong><span>达成意向</span><small>31.1%</small></div>
            </div>
            <div className="funnel-compare" aria-label={period === 7 ? "本周与上周建联转化漏斗对比" : "本周期与上一周期建联转化漏斗对比"}>
              {funnelComparison.slice().reverse().map((funnel) => <section className={`funnel-chart ${funnel.tone}`} key={funnel.label}>
                <div className="funnel-chart-head"><strong>{funnel.label}</strong><span>{funnel.caption}</span></div>
                <div className="funnel-bars">{funnel.stages.map((stage) => <div key={stage.label} style={{ width: `${stage.percentage}%` }}><span>{stage.label}</span><small>{stage.percentage}%</small></div>)}</div>
              </section>)}
            </div>
            <div className="funnel-insight"><span>↑</span><p><strong>{period === 7 ? "本周建联效率提升" : "本周期建联效率提升"}</strong> 从“已回复”到“达成意向”的转化率较{period === 7 ? "上周" : "上一周期"}提升 4.8%。</p></div>
          </article>

          <article className="panel todo-panel">
            <div className="panel-head"><div><h2>今日待办</h2><p>优先处理会阻塞业务进度的事项</p></div><span className="count-badge">{tasks.length}</span></div>
            <div className="todo-list">{tasks.length ? tasks.map((task) => <div className="todo-item" key={task.id}><span className={`todo-signal ${task.tone}`} /><div><strong>{task.title}</strong><small>{task.meta}</small></div><button onClick={() => openTodo(task)}>{task.action}</button></div>) : <div className="empty-state"><span>✓</span><strong>今日待办已处理完成</strong><small>新的异常或任务会出现在这里</small></div>}</div>
          </article>
        </section>

        <section className="dashboard-grid bottom-grid">
          <article className="panel creator-layer-panel">
            <div className="creator-layer-head"><div><h2>达人分层占比 <span className="layer-help" tabIndex={0} aria-label="达人粉丝量级分层说明">?</span></h2><p>粉丝量级 <i /> <b>·</b> <em>{layerMetric}</em></p></div><div className="layer-metric-switch"><button className={layerMetric === "成交金额" ? "active" : ""} onClick={() => setLayerMetric("成交金额")}>成交金额</button><button className={layerMetric === "达人数量" ? "active" : ""} onClick={() => setLayerMetric("达人数量")}>达人数量</button></div></div>
            <div className="creator-layer-bars" aria-label={`${layerMetric}达人分层占比`}>{creatorLayerData.map((item) => <div className="creator-layer-row" key={item.label}><span>{item.label}</span><div className="creator-layer-track"><i style={{ width: `${Math.max(item.percentage, 1)}%` }} /></div><strong>{item.value}({item.percentage}%)</strong></div>)}</div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-head"><div><h2>最新动态</h2><p>系统关键动作与数据变化</p></div></div>
            <div className="activity-list">{activities.map((item) => <div className="activity-item" key={`${item.time}-${item.title}`}><div className="activity-time">{item.time}</div><div className="activity-icon">{item.icon}</div><div><strong>{item.title}</strong><small>{item.text}</small></div></div>)}</div>
          </article>
        </section>

        </> : currentView === "达人库" ? <CreatorLibrary notify={notify} onBack={() => setCurrentView("工作台")} /> : currentView === "达人采集" ? <CreatorCollection notify={notify} onBack={() => setCurrentView("工作台")} /> : currentView === "建联管理" ? <ContactManagement notify={notify} onBack={() => setCurrentView("工作台")} /> : /* 历史达人分析暂未开放，保留 HistoricalAnalysis 页面实现，待开放时恢复此分支。 */ currentView === "历史达人分析" ? null : <LinkAutomation notify={notify} onBack={() => setCurrentView("工作台")} />}
      </section>

      {quickOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickOpen(false); }}><section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title"><header><div><span>快捷操作</span><h2 id="quick-title">你想先做什么？</h2></div><button onClick={() => setQuickOpen(false)} aria-label="关闭">×</button></header><div className="quick-grid">
        <button onClick={() => { setQuickOpen(false); setCurrentView("达人库"); }}><span className="quick-icon violet">达</span><strong>筛选达人</strong><small>从达人库筛选并加入待分配清单</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); setCurrentView("建联管理"); }}><span className="quick-icon cyan">分</span><strong>创建分配批次</strong><small>将已选达人分配给指定商务</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); setCurrentView("定向链接自动化"); }}><span className="quick-icon orange">链</span><strong>创建定向链接</strong><small>录入达人UID并调用影刀执行</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); notify("历史达人分析功能暂未开放", "warning"); }}><span className="quick-icon green">导</span><strong>导入历史数据</strong><small>上传并匹配公司历史成交达人</small><i>→</i></button>
      </div></section></div>}
      {toast && <div className={`toast ${toast.tone ?? "default"}`} role="status"><span>{toast.tone === "success" ? "✓" : toast.tone === "warning" ? "!" : "i"}</span>{toast.message}</div>}
    </main>
  );
}

function CreatorLibrary({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [creatorType, setCreatorType] = useState<"短视频" | "直播" | "竞品达人">("短视频");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState("全部来源");
  const [competitorStoreFilter, setCompetitorStoreFilter] = useState("全部竞品店铺");
  const [storeListCreatorId, setStoreListCreatorId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("全部类目");
  const [minScore, setMinScore] = useState("不限");
  const [historyFilter, setHistoryFilter] = useState("不限");
  const [updateFilter, setUpdateFilter] = useState("不限");
  const [followersFilter, setFollowersFilter] = useState("不限");
  const [settlementFilter, setSettlementFilter] = useState("不限");
  const [productCountFilter, setProductCountFilter] = useState("不限");
  const [storeCountFilter, setStoreCountFilter] = useState("不限");
  const [sortKey, setSortKey] = useState<"AI匹配度" | "粉丝量" | "近30天结算">("AI匹配度");
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignConflictNames, setAssignConflictNames] = useState<string[]>([]);
  const [reassignCreatorId, setReassignCreatorId] = useState<string | null>(null);
  const [outreachTaskHistory, setOutreachTaskHistory] = useState<Record<string, OutreachRecord[]>>({
    // 演示一位达人多次建联：当前任务与历史任务始终分开保存，重新分配只会追加历史记录。
    c4: [{ processStage: "已添加", finalResult: "未达成", stage: "未达成", taskId: "CT202608150021", batch: "FP20260815003", assignedAt: "2026-08-15 10:08", assignedBy: "陈旭光", owner: "赵明轩", addedAt: "2026-08-15 12:26", unreachedAt: "2026-08-16 17:20", unreachedStage: "沟通阶段", unreachedReason: "暂无合作意愿" }],
  });
  const [historyTaskDetail, setHistoryTaskDetail] = useState<OutreachRecord | null>(null);
  const [detailTab, setDetailTab] = useState<"overview" | "relations" | "history">("overview");
  const [unreachedOpen, setUnreachedOpen] = useState(false);
  const [outreachOverrides, setOutreachOverrides] = useState<Record<string, Partial<OutreachRecord>>>(() => Object.fromEntries(sharedOutreachTasks.map((task) => [task.creatorId, { processStage: task.processStage, finalResult: task.finalResult, stage: task.finalResult ?? task.processStage, taskId: task.taskId, assignedAt: task.createdAt, assignedBy: task.assignedBy, owner: task.owner, batch: task.batchId, addedAt: task.processStage && ["已添加", "已同意", "已回复"].includes(task.processStage) ? task.updatedAt : undefined, agreedAt: task.processStage && ["已同意", "已回复"].includes(task.processStage) ? task.updatedAt : undefined, repliedAt: task.processStage === "已回复" ? task.updatedAt : undefined }])));
  const pageSize = 5;
  const competitorStores = Object.fromEntries(creatorRows.filter((creator) => creator.competitorStores.length).map((creator) => [creator.id, creator.competitorStores])) as Record<string, string[]>;
  const competitorStoreOptions = Array.from(new Set(Object.values(competitorStores).flat()));

  const visibleCreators = useMemo(() => creatorRows.filter((creator) => {
    const matchText = `${creator.name}${creator.uid}${creator.category}`.toLowerCase().includes(query.toLowerCase());
    const matchSource = sourceFilter === "全部来源" || creator.acquisitionSource === sourceFilter;
    const matchCategory = categoryFilter === "全部类目" || creator.category === categoryFilter;
    const matchScore = minScore === "不限" || creator.score >= Number(minScore);
    const matchHistory = historyFilter === "不限" || (historyFilter === "有建联记录" ? creator.contactStatus !== "未建联" : creator.contactStatus === "未建联");
    const asNumber = (value: string | number) => Number(String(value).replace("万", "").match(/[\d.]+/)?.[0] ?? 0);
    const matchFollowers = followersFilter === "不限" || asNumber(creator.followers) >= Number(followersFilter);
    const matchSettlement = settlementFilter === "不限" || asNumber(creator.settlement) >= Number(settlementFilter);
    const matchProducts = productCountFilter === "不限" || Number(creator.products) >= Number(productCountFilter);
    const matchStores = storeCountFilter === "不限" || Number(creator.stores) >= Number(storeCountFilter);
    const matchUpdate = updateFilter === "不限" || (updateFilter === "近24小时" ? !creator.update.startsWith("2026-") : true);
    const matchCompetitorStore = competitorStoreFilter === "全部竞品店铺" || (competitorStores[creator.id] ?? []).includes(competitorStoreFilter);
    const matchTab = creator.type === creatorType;
    return matchTab && matchText && matchSource && matchCategory && matchScore && matchHistory && matchFollowers && matchSettlement && matchProducts && matchStores && matchUpdate && matchCompetitorStore;
  }).sort((a, b) => {
    const asNumber = (value: string) => Number(value.replace("万", "").match(/[\d.]+/)?.[0] ?? 0);
    if (sortKey === "粉丝量") return asNumber(b.followers) - asNumber(a.followers);
    if (sortKey === "近30天结算") return asNumber(b.settlement) - asNumber(a.settlement);
    return b.score - a.score;
  }), [categoryFilter, competitorStoreFilter, creatorType, followersFilter, historyFilter, minScore, productCountFilter, query, settlementFilter, sortKey, sourceFilter, storeCountFilter, updateFilter]);
  const pageCount = Math.max(1, Math.ceil(visibleCreators.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageCreators = visibleCreators.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const getOutreachStage = (creator: typeof creatorRows[number]) => getTaskSummary({ ...creator.outreach, ...outreachOverrides[creator.id] });
  // 所有分配入口只读取该资格判断：历史任务不影响分配，只有当前有效任务决定是否可再次分配。
  const getAssignmentEligibility = (creator: typeof creatorRows[number]) => {
    const currentStatus = getOutreachStage(creator);
    const hasActiveTask = processStages.includes(currentStatus as OutreachProcessStage);
    if (hasActiveTask) return { canAssign: false, hasActiveTask: true, currentStatus, reason: "当前达人已有进行中的建联任务，暂不可重复分配" };
    if (currentStatus === "达成意向") return { canAssign: false, hasActiveTask: false, currentStatus, reason: "当前已达成合作意向，暂不支持再次分配" };
    return { canAssign: true, hasActiveTask: false, currentStatus, reason: "当前无进行中的建联任务，可分配" };
  };
  const hasActiveOutreachTask = (creator: typeof creatorRows[number]) => getAssignmentEligibility(creator).hasActiveTask;
  const canAssignCreator = (creator: typeof creatorRows[number]) => getAssignmentEligibility(creator).canAssign;
  const assignBlockMessage = (creator: typeof creatorRows[number]) => getAssignmentEligibility(creator).reason;
  const assignablePageCreators = pageCreators.filter(canAssignCreator);
  const allVisibleSelected = assignablePageCreators.length > 0 && assignablePageCreators.every((creator) => selected.includes(creator.id));
  const detailCreator = creatorRows.find((creator) => creator.id === detailId) ?? null;
  const reassignCreator = creatorRows.find((creator) => creator.id === reassignCreatorId) ?? null;
  const storeListCreator = creatorRows.find((creator) => creator.id === storeListCreatorId) ?? null;
  const outreach = detailCreator?.outreach ? { ...detailCreator.outreach, ...outreachOverrides[detailCreator.id] } : undefined;
  const historicOutreachTasks = detailCreator ? outreachTaskHistory[detailCreator.id] ?? [] : [];
  const outreachStages: Array<"已分配" | "已添加" | "已同意" | "已回复"> = ["已分配", "已添加", "已同意", "已回复"];
  const currentOutreachStage = !outreach || outreach.stage === "未建联" ? -1 : outreach.repliedAt ? 3 : outreach.agreedAt ? 2 : outreach.addedAt ? 1 : 0;
  const outreachTimeline = outreach && outreach.stage !== "未建联" ? [
    { label: "已分配建联任务", detail: `${outreach.assignedAt} · ${outreach.assignedBy} 分配给 ${outreach.owner}` },
    outreach.addedAt ? { label: "已添加达人", detail: `${outreach.addedAt} · ${outreach.owner}` } : null,
    outreach.agreedAt ? { label: "达人已同意", detail: `${outreach.agreedAt} · ${outreach.owner}` } : null,
    outreach.repliedAt ? { label: "达人已回复", detail: `${outreach.repliedAt} · ${outreach.owner}` } : null,
    outreach.intentAt ? { label: "达成合作意向", detail: `${outreach.intentAt} · ${outreach.owner}` } : null,
    outreach.unreachedAt ? { label: "最终未达成", detail: `${outreach.unreachedAt} · ${outreach.unreachedStage ?? "—"} · ${outreach.unreachedReason ?? "—"}` } : null,
  ].filter((item): item is { label: string; detail: string } => item !== null) : [];

  useEffect(() => {
    // 待分配池是暂存选择。若期间当前任务状态变化为不可分配，立即使该项失效，避免跨页面残留。
    setSelected((current) => {
      const valid = current.filter((id) => {
        const creator = creatorRows.find((item) => item.id === id);
        return creator ? getAssignmentEligibility(creator).canAssign : false;
      });
      return valid.length === current.length ? current : valid;
    });
  }, [outreachOverrides]);

  useEffect(() => {
    const panelId = "creator-portrait-panel";
    document.getElementById(panelId)?.remove();
    if (!detailCreator || detailTab !== "overview") return;
    const drawerBody = document.querySelector(".creator-detail-drawer .drawer-body");
    if (!drawerBody) return;
    const scoreDescription = drawerBody.querySelector(".drawer-score p");
    const scoreHeading = drawerBody.querySelector(".drawer-score-heading");
    const recommendation = scoreHeading?.querySelector<HTMLElement>(":scope > span:first-child");
    if (recommendation) {
      recommendation.className = "drawer-score-recommendation";
      recommendation.textContent = detailCreator.score >= 80 ? "建议优先评估" : "建议谨慎评估";
    }
    scoreHeading?.parentElement?.querySelector(".drawer-score-label")?.remove();
    if (scoreHeading) scoreHeading.insertAdjacentHTML("afterend", "<div class=\"drawer-score-label\">AI匹配度</div>");
    if (scoreDescription) scoreDescription.textContent = detailCreator.matchNote;
    const panel = document.createElement("section");
    panel.id = "creator-portrait-panel";
    panel.className = "creator-real-data-panel";
    panel.innerHTML = `<h3>采集详情</h3><div class="creator-real-grid"><div><small>平台 / 平台ID</small><strong>${detailCreator.platform} · ${detailCreator.uid}</strong></div><div><small>达人类型</small><strong>${detailCreator.type}达人</strong></div><div><small>店铺名称</small><strong>${detailCreator.storeName}</strong></div><div><small>来源渠道</small><strong>${detailCreator.source}</strong></div><div><small>微信</small><div class="creator-contact-value"><strong>${detailCreator.wechat || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.wechat}" aria-label="复制微信" title="复制微信" ${detailCreator.wechat ? "" : "disabled"}>⧉</button></div></div><div><small>手机号</small><div class="creator-contact-value"><strong>${detailCreator.phone || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.phone}" aria-label="复制手机号" title="复制手机号" ${detailCreator.phone ? "" : "disabled"}>⧉</button></div></div></div><h3>粉丝画像</h3><p>${detailCreator.audience}</p><small class="creator-real-time">创建于 ${detailCreator.createdAt} · 更新于今天 ${detailCreator.update}</small>`;
    panel.innerHTML = `<h3>粉丝画像</h3><p>${detailCreator.audience}</p>`;
    const detailMetrics = drawerBody.querySelector<HTMLElement>(".detail-metrics");
    detailMetrics?.querySelector(".creator-moved-fields")?.remove();
    detailMetrics?.querySelector(".creator-category-field")?.remove();
    if (detailMetrics) {
      const typeField = detailMetrics.children[6];
      if (typeField) {
        typeField.innerHTML = `<small>达人类型</small><strong>${detailCreator.type}</strong>`;
        const categoryField = document.createElement("div");
        categoryField.className = "creator-category-field";
        categoryField.innerHTML = `<small>类目</small><strong>${detailCreator.category}</strong>`;
        typeField.insertAdjacentElement("afterend", categoryField);
      }
      const movedFields = document.createElement("div");
      movedFields.className = "creator-moved-fields";
      movedFields.innerHTML = `<div><small>平台</small><strong>${detailCreator.platform}</strong></div><div><small>平台ID</small><strong>${detailCreator.uid}</strong></div><div><small>来源渠道</small><strong>${detailCreator.source}</strong></div><div><small>微信</small><div class="creator-contact-value"><strong>${detailCreator.wechat || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.wechat}" aria-label="复制微信" title="复制微信" ${detailCreator.wechat ? "" : "disabled"}>⧉</button></div></div><div><small>手机号</small><div class="creator-contact-value"><strong>${detailCreator.phone || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.phone}" aria-label="复制手机号" title="复制手机号" ${detailCreator.phone ? "" : "disabled"}>⧉</button></div></div>`;
      detailMetrics.querySelector(".creator-category-field")?.insertAdjacentElement("afterend", movedFields) ?? detailMetrics.children[6]?.insertAdjacentElement("afterend", movedFields);
      movedFields.querySelectorAll<HTMLButtonElement>(".copy-contact").forEach((button) => button.addEventListener("click", async () => {
        const value = button.dataset.copy;
        if (!value) return;
        await navigator.clipboard.writeText(value);
        notify(`${button.getAttribute("aria-label")?.replace("复制", "")}已复制`, "success");
      }));
      const statusField = Array.from(detailMetrics.children).find((field) => field.querySelector("small")?.textContent === "建联状态");
      if (statusField) {
        const currentStatus = getOutreachStage(detailCreator);
        statusField.innerHTML = `<small>建联状态</small><strong><span class="history-tag ${currentStatus === "未建联" ? "empty" : ""}">${currentStatus}</span></strong>`;
      }
    }
    const drawerHeader = document.querySelector<HTMLElement>(".creator-detail-drawer > header p");
    if (drawerHeader) drawerHeader.textContent = `${detailCreator.uid} · ${detailCreator.type}`;
    panel.querySelectorAll<HTMLButtonElement>(".copy-contact").forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copy;
        if (!value) return;
        await navigator.clipboard.writeText(value);
        notify(`${button.getAttribute("aria-label")?.replace("复制", "")}已复制`, "success");
      });
    });
    const portraitTitle = Array.from(panel.querySelectorAll("h3")).find((title) => title.textContent === "粉丝画像");
    const portraitText = portraitTitle?.nextElementSibling;
    const female = detailCreator.id === "c0" ? 35 : 48 + (detailCreator.score % 9);
    const male = 100 - female;
    const ages = detailCreator.id === "c0" ? [{ label: "18–23岁", value: 19, color: "#aeb0f5" }, { label: "24–30岁", value: 38, color: "#6d70dd" }, { label: "31–40岁", value: 43, color: "#4246bb" }] : [{ label: "18–23岁", value: 18, color: "#aeb0f5" }, { label: "24–30岁", value: 31, color: "#6d70dd" }, { label: "31–40岁", value: 34, color: "#4246bb" }, { label: "41岁以上", value: 17, color: "#c9cbf8" }];
    const ageStops = ages.reduce((result, age, index) => { const previous = index ? result[index - 1].end : 0; result.push({ ...age, start: previous, end: previous + age.value }); return result; }, [] as Array<{ label: string; value: number; color: string; start: number; end: number }>);
    if (portraitText) portraitText.outerHTML = `<div class="creator-portrait-charts"><section><div class="portrait-chart-title"><strong>性别占比</strong><small>粉丝性别结构</small></div><div class="portrait-chart-content"><div class="portrait-donut gender" style="background:conic-gradient(#6769db 0 ${female}%,#e5e6fa ${female}% 100%)"><span><strong>${female}%</strong><small>女性</small></span></div><div class="portrait-legend"><span><i style="background:#6769db"></i>女性 ${female}%</span><span><i style="background:#e5e6fa"></i>男性 ${male}%</span></div></div></section><section><div class="portrait-chart-title"><strong>年龄占比</strong><small>粉丝年龄结构</small></div><div class="portrait-chart-content"><div class="portrait-donut age" style="background:conic-gradient(${ageStops.map((age) => `${age.color} ${age.start}% ${age.end}%`).join(",")})"><span><strong>${ages.reduce((best, age) => age.value > best.value ? age : best).value}%</strong><small>主力年龄</small></span></div><div class="portrait-legend">${ages.map((age) => `<span><i style="background:${age.color}"></i>${age.label} ${age.value}%</span>`).join("")}</div></div></section><section class="core-audience-chart"><div class="portrait-chart-title"><strong>核心人群</strong><small>兴趣与生活方式标签</small></div><div class="core-audience-bars"><div><span>精致居家人群</span><i><b style="width:46%"></b></i><strong>46%</strong></div><div><span>新锐白领</span><i><b style="width:32%"></b></i><strong>32%</strong></div><div><span>${detailCreator.category}兴趣人群</span><i><b style="width:22%"></b></i><strong>22%</strong></div></div></section></div>`;
    drawerBody.append(panel);
    return () => panel.remove();
  }, [detailCreator, detailTab, outreachOverrides]);

  useEffect(() => {
    // 历史采集记录只属于“竞品与来源”Tab；切换到建联状态时必须清理，避免与建联历史混在一起。
    if (!detailCreator || detailTab !== "relations") {
      document.querySelector(".creator-detail-drawer .creator-acquisition-history")?.remove();
      return;
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".creator-detail-drawer .drawer-body .detail-section"));
    const sourceSection = sections.find((section) => section.querySelector("h3")?.textContent === "数据来源");
    const competitorSection = sections.find((section) => section.querySelector("h3")?.textContent === "关联竞品");
    const sourceType = detailCreator.acquisitionSource;
    const configName = sourceType === "竞品直播间抓取" ? `竞品达人·${detailCreator.category}` : sourceType === "直播达人抓取" ? `直播达人·${detailCreator.category}` : `短视频达人·${detailCreator.category}`;
    const taskId = `CT20260818${detailCreator.id.replace("c", "").padStart(3, "0")}`;
    const history = creatorAcquisitionHistory[detailCreator.id] ?? [];
    const currentSourceLabel = sourceType;
    if (sourceSection) sourceSection.innerHTML = `<h3>当前来源</h3><p class="creator-source-summary">达人当前归属按竞品达人 ＞ 直播达人 ＞ 短视频达人确定；每次采集均保留独立历史记录。</p><div class="creator-source-detail"><div><small>当前达人类型</small><strong>${detailCreator.type}</strong></div><div><small>当前主要采集来源</small><strong>${currentSourceLabel}</strong></div><div><small>当前采集配置</small><strong>${configName}</strong></div><div><small>最近采集任务</small><button type="button" class="creator-source-task" data-task-id="${taskId}">${taskId}</button></div><div><small>最近更新时间</small><strong>${detailCreator.update.startsWith("2026-") ? detailCreator.update : `2026-08-18 ${detailCreator.update}`}</strong></div></div>`;
    sourceSection?.querySelectorAll<HTMLButtonElement>(".creator-source-task").forEach((button) => button.addEventListener("click", () => notify(`已打开抓取任务 ${button.dataset.taskId}`, "success")));
    const stores = competitorStores[detailCreator.id] ?? [];
    if (!competitorSection) return;
    if (!stores.length) {
      competitorSection.innerHTML = `<h3>关联竞品</h3><div class="competitor-empty-note"><span>i</span><p>该达人不属于竞品店铺达人范围。</p></div>`;
    } else {
      competitorSection.innerHTML = `<h3>关联竞品</h3><p class="competitor-section-note">该达人出现于以下竞品店铺的抓取来源中：</p><div class="competitor-store-detail-list">${stores.map((store) => `<div><strong>${store}</strong><button type="button" data-copy-store="${store}">复制</button></div>`).join("")}</div>`;
      competitorSection.querySelectorAll<HTMLButtonElement>("[data-copy-store]").forEach((button) => button.addEventListener("click", async () => {
        await navigator.clipboard.writeText(button.dataset.copyStore ?? "");
        notify("竞品店铺名称已复制", "success");
      }));
    }
    document.querySelector(".creator-detail-drawer .creator-acquisition-history")?.remove();
    const storesForCurrentSource = competitorStores[detailCreator.id] ?? [];
    const currentRecord = { collectedAt: detailCreator.update.startsWith("2026-") ? detailCreator.update : `2026-08-18 ${detailCreator.update}`, sourceType: currentSourceLabel, sourceObject: storesForCurrentSource.length ? `来源店铺：${storesForCurrentSource.join("、")}` : configName, taskId };
    const records = [currentRecord, ...history].sort((a, b) => b.collectedAt.localeCompare(a.collectedAt));
    const historySection = document.createElement("section");
    historySection.className = "detail-section creator-acquisition-history";
    historySection.innerHTML = `<h3>历史采集记录</h3><p class="creator-acquisition-note">一次采集保留一条记录；达人类型迁移不会覆盖或删除既有来源。</p><div class="creator-acquisition-list"><div class="creator-acquisition-head"><span>采集时间</span><span>来源类型</span><span>来源对象 / 采集配置</span><span>采集任务</span></div>${records.map((item) => `<article><span>${item.collectedAt}</span><span>${item.sourceType}</span><strong>${item.sourceObject}</strong><button type="button" class="creator-source-task" data-task-id="${item.taskId}">${item.taskId}</button></article>`).join("")}</div>`;
    competitorSection.insertAdjacentElement("afterend", historySection);
    historySection.querySelectorAll<HTMLButtonElement>(".creator-source-task").forEach((button) => button.addEventListener("click", () => notify(`已打开抓取任务 ${button.dataset.taskId}`, "success")));
  }, [detailCreator, detailTab]);

  useEffect(() => {
    if (!detailCreator || detailTab !== "history") return;
    const taskHero = document.querySelector<HTMLElement>(".creator-detail-drawer .outreach-status-hero");
    const taskName = taskHero?.querySelector("strong");
    if (taskName) {
      taskName.textContent = `任务编号：${outreach?.taskId ?? "—"}`;
      if (!taskHero?.querySelector("[data-current-outreach-task]")) taskName.insertAdjacentHTML("beforebegin", "<small data-current-outreach-task>当前建联任务</small>");
      if (taskName.nextElementSibling?.tagName === "SMALL") taskName.nextElementSibling.remove();
    }
    const currentSummary = getTaskSummary(outreach);
    const hasCurrentTask = processStages.includes(currentSummary as OutreachProcessStage);
    if (outreach && !hasCurrentTask && currentSummary !== "未建联" && taskHero) {
      taskHero.className = "outreach-no-current";
      taskHero.innerHTML = `<div><small>当前建联情况</small><strong>当前暂无进行中的建联任务</strong><p>最近一次结果：<b class="${currentSummary === "未达成" ? "failed" : "success"}">${currentSummary}</b></p></div>`;
      document.querySelector(".creator-detail-drawer .outreach-stepper")?.remove();
      Array.from(document.querySelectorAll<HTMLElement>(".creator-detail-drawer .detail-section")).forEach((item) => {
        const heading = item.querySelector("h3")?.textContent;
        if (["分配信息", "当前分配批次", "流转记录"].includes(heading ?? "")) item.remove();
      });
    }
    const section = Array.from(document.querySelectorAll<HTMLElement>(".creator-detail-drawer .detail-section")).find((item) => item.querySelector("h3")?.textContent === "分配信息");
    section?.querySelectorAll<HTMLElement>(".task-detail-grid > div").forEach((item) => {
      if (item.querySelector("small")?.textContent === "推广商品") item.remove();
    });
    const stepper = document.querySelector<HTMLElement>(".creator-detail-drawer .outreach-stepper");
    document.querySelector(".creator-detail-drawer .outreach-result-section")?.remove();
    if (stepper && outreach) {
      const result = document.createElement("section");
      result.className = `detail-section outreach-result-section ${outreach.stage === "未达成" ? "failed" : outreach.stage === "达成意向" ? "success" : ""}`;
      result.innerHTML = outreach.stage === "未达成"
        ? `<h3>最终结果</h3><div class="outreach-result-card"><strong>未达成</strong><div><small>未达成阶段</small><span>${outreach.unreachedStage ?? "—"}</span></div><div><small>未达成原因</small><span>${outreach.unreachedReason ?? "—"}</span></div></div>`
        : outreach.stage === "达成意向"
          ? `<h3>最终结果</h3><div class="outreach-result-card"><strong>达成意向</strong><p>已完成建联流程，可进入后续合作准备。</p></div>`
          : `<h3>最终结果</h3><div class="outreach-result-card pending"><strong>尚未形成最终结果</strong><p>请继续推进当前建联过程。</p></div>`;
      stepper.insertAdjacentElement("afterend", result);
      document.querySelector(".creator-detail-drawer .outreach-task-history")?.remove();
      if (historicOutreachTasks.length) {
        const history = document.createElement("section");
        history.className = "detail-section outreach-task-history";
        history.innerHTML = `<h3>历史建联记录</h3><p class="outreach-history-note">批次归属建联任务；重新分配会创建新任务，原任务及其流转记录继续保留。</p><div class="outreach-history-list"><div class="outreach-history-head"><span>任务编号</span><span>分配批次</span><span>分配时间</span><span>商务</span><span>最终结果</span><span>结束时间</span></div>${historicOutreachTasks.map((task) => { const summary = getTaskSummary(task); const result = task.finalResult ?? "未形成结果"; const endedAt = task.intentAt ?? task.unreachedAt ?? "—"; return `<article><strong>${task.taskId ?? "—"}</strong><span>${task.batch ?? "—"}</span><span>${task.assignedAt ?? "—"}</span><span>${task.owner ?? "—"}</span><em class="${summary === "未达成" ? "failed" : summary === "达成意向" ? "success" : ""}">${result}</em><span>${endedAt}</span></article>`; }).join("")}</div>`;
        result.insertAdjacentElement("afterend", history);
      }
    }
    if (outreach && !hasCurrentTask && currentSummary !== "未建联") {
      document.querySelector(".creator-detail-drawer .outreach-task-history")?.remove();
      const tasks = [outreach, ...historicOutreachTasks].sort((a, b) => String(b.assignedAt ?? "").localeCompare(String(a.assignedAt ?? "")));
      const history = document.createElement("section");
      history.className = "detail-section outreach-task-history";
      history.innerHTML = `<h3>历史建联记录</h3><p class="outreach-history-note">当前没有进行中的建联任务；以下为该达人已结束的建联任务。</p><div class="outreach-history-list"><div class="outreach-history-head"><span>任务编号</span><span>分配批次</span><span>分配时间</span><span>商务</span><span>最终结果</span><span>结束时间</span></div>${tasks.map((task, index) => `<button type="button" data-history-task="${index}"><strong>${task.taskId ?? "—"}</strong><span>${task.batch ?? "—"}</span><span>${task.assignedAt ?? "—"}</span><span>${task.owner ?? "—"}</span><em class="${getTaskSummary(task) === "未达成" ? "failed" : "success"}">${task.finalResult ?? getTaskSummary(task)}</em><span>${task.intentAt ?? task.unreachedAt ?? "—"}</span></button>`).join("")}</div>`;
      taskHero?.insertAdjacentElement("afterend", history);
      history.querySelectorAll<HTMLButtonElement>("[data-history-task]").forEach((button) => button.addEventListener("click", () => setHistoryTaskDetail(tasks[Number(button.dataset.historyTask)])));
    }
    const footer = document.querySelector<HTMLElement>(".creator-detail-drawer > footer");
    footer?.querySelector(".set-unreached-button")?.remove();
    if (footer && outreach && !["未建联", "未达成", "达成意向"].includes(outreach.stage)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ghost-button set-unreached-button";
      button.textContent = "设置未达成";
      button.onclick = () => setUnreachedOpen(true);
      footer.append(button);
    }
  }, [detailCreator, detailTab, historicOutreachTasks, outreachOverrides]);

  useEffect(() => {
    document.getElementById("creator-unreached-modal")?.remove();
    if (!unreachedOpen || !detailCreator || !outreach) return;
    const overlay = document.createElement("div");
    overlay.id = "creator-unreached-modal";
    overlay.className = "modal-overlay creator-unreached-modal";
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="设置未达成"><header><div><small>建联最终结果</small><h2>设置未达成</h2><p>${detailCreator.name} · ${outreach.taskId ?? "—"}</p></div><button type="button" data-close aria-label="关闭">×</button></header><form><p class="unreached-tip">设置后会保留已发生的建联过程，仅补充最终未达成信息。</p><label>未达成阶段<select name="stage"><option>添加阶段</option><option>同意阶段</option><option>沟通阶段</option></select></label><label>未达成原因<select name="reason"><option>未通过好友申请</option><option>长时间未回复</option><option>明确拒绝合作</option><option>合作条件不匹配</option><option>暂无合作意愿</option><option>其他</option></select></label><footer><button type="button" data-close>取消</button><button type="submit" class="primary-button">确认设置</button></footer></form></section>`;
    const close = () => setUnreachedOpen(false);
    overlay.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((button) => button.onclick = close);
    overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) close(); });
    overlay.querySelector<HTMLFormElement>("form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      setOutreachOverrides((current) => ({ ...current, [detailCreator.id]: { finalResult: "未达成", stage: "未达成", unreachedAt: "今天 11:30", unreachedStage: String(form.get("stage")), unreachedReason: String(form.get("reason")) } }));
      setUnreachedOpen(false);
      notify("已设置未达成阶段与原因，历史流程已保留", "success");
    });
    document.body.append(overlay);
    return () => overlay.remove();
  }, [detailCreator, outreach, unreachedOpen]);

  useEffect(() => {
    document.getElementById("outreach-history-task-modal")?.remove();
    if (!historyTaskDetail) return;
    const task = historyTaskDetail;
    const process = processStages.map((stage) => ({ stage, done: processStages.indexOf(stage) <= processStages.indexOf(task.processStage ?? "已分配") }));
    const overlay = document.createElement("div");
    overlay.id = "outreach-history-task-modal";
    overlay.className = "modal-overlay outreach-history-task-modal";
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="历史建联任务详情"><header><div><small>历史建联任务</small><h2>${task.taskId ?? "—"}</h2><p>${task.assignedAt ?? "—"} · ${task.owner ?? "—"}</p></div><button type="button" data-close aria-label="关闭">×</button></header><div class="history-task-detail-body"><div class="history-task-summary"><span>${task.finalResult ?? "—"}</span><strong>分配批次：${task.batch ?? "—"}</strong></div><section><h3>任务流程</h3><div class="history-task-steps">${process.map((item) => `<span class="${item.done ? "done" : ""}">${item.done ? "✓" : "○"} ${item.stage}</span>`).join("")}</div></section><section><h3>最终结果</h3><p>${task.finalResult ?? "暂无"}</p>${task.finalResult === "未达成" ? `<p>未达成阶段：${task.unreachedStage ?? "—"}<br/>未达成原因：${task.unreachedReason ?? "—"}</p>` : ""}</section><section><h3>备注</h3><p>${task.note ?? "暂无备注"}</p></section><section><h3>流转记录</h3><div class="contact-timeline"><div><span>已分配建联任务</span><small>${task.assignedAt ?? "—"} · ${task.assignedBy ?? "—"} 分配给 ${task.owner ?? "—"}</small></div>${task.addedAt ? `<div><span>已添加达人</span><small>${task.addedAt} · ${task.owner ?? "—"}</small></div>` : ""}${task.agreedAt ? `<div><span>达人已同意</span><small>${task.agreedAt} · ${task.owner ?? "—"}</small></div>` : ""}${task.repliedAt ? `<div><span>达人已回复</span><small>${task.repliedAt} · ${task.owner ?? "—"}</small></div>` : ""}${task.unreachedAt ? `<div><span>最终未达成</span><small>${task.unreachedAt} · ${task.unreachedReason ?? "—"}</small></div>` : ""}${task.intentAt ? `<div><span>达成合作意向</span><small>${task.intentAt} · ${task.owner ?? "—"}</small></div>` : ""}</div></section></div><footer><button type="button" data-close>关闭</button></footer></section>`;
    const close = () => setHistoryTaskDetail(null);
    overlay.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((button) => button.onclick = close);
    overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) close(); });
    document.body.append(overlay);
    return () => overlay.remove();
  }, [historyTaskDetail]);

  useEffect(() => {
    const filterBar = document.querySelector<HTMLElement>(".library-filter-bar");
    if (!filterBar) return;
    filterBar.querySelector(".competitor-store-filter")?.remove();
    // 竞品店铺属于主筛选区：由下方的 priority-library-filters 在“数据更新时间”右侧统一渲染。
  }, [creatorType, competitorStoreFilter]);

  useEffect(() => {
    const note = document.querySelector<HTMLElement>(".library-summary-note p");
    if (note) note.textContent = "同一达人按“平台 + 达人UID”建立唯一主档，并只归属一个类型；后续命中更高优先级采集时自动迁移：竞品达人 > 直播达人 > 短视频达人。";
    const summaries = document.querySelectorAll<HTMLElement>(".library-summary > button");
    if (summaries[1]?.querySelector("em")) summaries[1].querySelector("em")!.textContent = "今日新增 542";
    if (summaries[2]?.querySelector("em")) summaries[2].querySelector("em")!.textContent = "今日新增 439";
  }, []);

  useEffect(() => {
    const table = document.querySelector<HTMLElement>(".creator-table table");
    if (!table) return;
    const sourceHeader = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th")).find((cell) => cell.textContent === "来源");
    if (sourceHeader) sourceHeader.textContent = "采集来源";
    const sourceColumn = sourceHeader ? Array.from(sourceHeader.parentElement?.children ?? []).indexOf(sourceHeader) : -1;
    const typeHeader = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th")).find((cell) => cell.textContent === "达人类型 / 类目");
    const typeColumn = typeHeader ? Array.from(typeHeader.parentElement?.children ?? []).indexOf(typeHeader) : -1;
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      const creator = pageCreators[index];
      const cell = sourceColumn >= 0 ? row.children[sourceColumn] : null;
      if (!creator) return;
      if (cell) {
        cell.innerHTML = `<span class="source-tag">${creator.acquisitionSource}</span>`;
      }
      const typeCell = typeColumn >= 0 ? row.children[typeColumn] : null;
      if (typeCell) typeCell.innerHTML = `<div class="category-cell"><span>${creator.type}</span><small>${creator.category}</small></div>`;
    });
    table.querySelectorAll("[data-competitor-store]").forEach((item) => item.remove());
    if (creatorType !== "竞品达人") return;
    const header = table.querySelector("thead tr");
    if (header) {
      const cell = document.createElement("th");
      cell.dataset.competitorStore = "true";
      cell.textContent = "竞品店铺";
      header.insertBefore(cell, header.lastElementChild);
    }
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      const creator = pageCreators[index];
      if (!creator) return;
      const stores = competitorStores[creator.id] ?? [];
      const cell = document.createElement("td");
      cell.dataset.competitorStore = "true";
      if (stores.length <= 1) {
        cell.textContent = stores[0] ?? "—";
      } else {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "competitor-store-count";
        button.textContent = `${stores[0]} · 共 ${stores.length} 家`;
        button.addEventListener("click", () => setStoreListCreatorId(creator.id));
        cell.append(button);
      }
      row.insertBefore(cell, row.lastElementChild);
    });
  }, [creatorType, pageCreators]);

  useEffect(() => {
    const table = document.querySelector<HTMLElement>(".creator-table table");
    if (!table) return;
    const statusHeader = Array.from(table.querySelectorAll<HTMLTableCellElement>("thead th")).find((cell) => cell.textContent === "建联状态");
    const statusColumn = statusHeader ? Array.from(statusHeader.parentElement?.children ?? []).indexOf(statusHeader) : -1;
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      const creator = pageCreators[index];
      const checkbox = row.querySelector<HTMLInputElement>("input[type=checkbox]");
      if (!creator || !checkbox) return;
      const stage = getOutreachStage(creator);
      const statusCell = statusColumn >= 0 ? row.children[statusColumn] : null;
      if (statusCell) statusCell.innerHTML = `<span class="history-tag ${stage === "未建联" ? "empty" : ""}">${stage}</span>`;
      const enabled = canAssignCreator(creator);
      checkbox.disabled = !enabled;
      checkbox.setAttribute("aria-disabled", String(!enabled));
      const hint = enabled ? (getOutreachStage(creator) === "未达成" ? "历史建联未达成，可重新分配" : "当前无进行中建联任务，可分配") : assignBlockMessage(creator);
      checkbox.title = hint;
      checkbox.closest("td")?.setAttribute("title", hint);
      row.classList.toggle("creator-not-assignable", !enabled);
    });
  }, [pageCreators, outreachOverrides]);

  useEffect(() => {
    if (!detailCreator || outreach?.stage !== "未达成") return;
    const footer = document.querySelector<HTMLElement>(".creator-detail-drawer > footer");
    if (!footer || footer.querySelector(".reassign-creator")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "primary-button reassign-creator";
    button.textContent = "重新分配建联";
    button.addEventListener("click", () => {
      setReassignCreatorId(detailCreator.id);
    });
    footer.append(button);
    return () => button.remove();
  }, [detailCreator, outreach, selected]);

  useEffect(() => {
    document.getElementById("competitor-store-list-modal")?.remove();
    if (!storeListCreator) return;
    const stores = competitorStores[storeListCreator.id] ?? [];
    const overlay = document.createElement("div");
    overlay.id = "competitor-store-list-modal";
    overlay.className = "modal-overlay competitor-store-modal";
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="竞品店铺列表"><header><div><small>达人来源</small><h2>${storeListCreator.name} 出现于 ${stores.length} 家竞品店铺</h2><p>以下店铺均记录为该达人的竞品抓取来源。</p></div><button type="button" data-close aria-label="关闭">×</button></header><div class="competitor-store-list">${stores.map((store) => `<div><strong>${store}</strong><button type="button" data-copy-store="${store}">复制</button></div>`).join("")}</div><footer><button type="button" data-close>关闭</button></footer></section>`;
    overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) setStoreListCreatorId(null); });
    overlay.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((button) => button.addEventListener("click", () => setStoreListCreatorId(null)));
    overlay.querySelectorAll<HTMLButtonElement>("[data-copy-store]").forEach((button) => button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copyStore ?? "");
      notify("竞品店铺名称已复制", "success");
    }));
    document.body.append(overlay);
    return () => overlay.remove();
  }, [storeListCreator]);

  useEffect(() => {
    if (!assignOpen) return;
    document.querySelectorAll<HTMLElement>(".assign-modal-body > label").forEach((field) => {
      if (field.childNodes[0]?.textContent === "推广商品") field.remove();
    });
    const selectedCreators = selected.map((id) => creatorRows.find((creator) => creator.id === id)).filter((creator): creator is typeof creatorRows[number] => Boolean(creator));
    const assignableCreators = selectedCreators.filter(canAssignCreator);
    const blockedCreators = selectedCreators.filter((creator) => !canAssignCreator(creator));
    const assignWarning = document.querySelector<HTMLElement>(".assign-modal-body .assign-warning");
    if (assignWarning) assignWarning.innerHTML = `<span>i</span><div class="assign-validation"><p><strong>可分配 ${assignableCreators.length} 人</strong><strong>不可分配 ${blockedCreators.length} 人</strong></p>${assignConflictNames.length ? `<div class="assign-submit-conflict"><strong>以下达人已存在进行中的建联任务，无法分配：</strong><span>${assignConflictNames.join("、")}</span><small>已自动从本次分配中移除，请确认剩余达人后再次提交。</small></div>` : ""}${blockedCreators.length ? `<div class="assign-blocked-list"><small>不可分配原因：存在进行中的建联任务</small>${blockedCreators.map((creator) => `<article><strong>${creator.name}</strong><span>当前状态：${getOutreachStage(creator)}</span><em>${hasActiveOutreachTask(creator) ? "当前已有商务正在建联，无法重复分配" : "已达成合作意向，暂不支持再次分配"}</em></article>`).join("")}</div>` : `<small>仅可分配当前无进行中建联任务的达人；历史未达成达人可重新分配。</small>`}</div>`;
    const assigneeField = Array.from(document.querySelectorAll<HTMLElement>(".assign-modal-body > label")).find((field) => field.childNodes[0]?.textContent === "负责商务");
    if (!assigneeField) return;
    const assignees = [
      { name: "陈小雨", workload: "在手 206 人 · 2 批次", result: "已回复 76 · 意向 12（15.8%）" },
      { name: "林晓婷", workload: "在手 154 人 · 2 批次", result: "已回复 58 · 意向 9（15.5%）" },
      { name: "张文豪", workload: "在手 231 人 · 2 批次", result: "已回复 94 · 意向 21（22.3%）" },
      { name: "赵明轩", workload: "在手 87 人 · 1 批次", result: "已回复 33 · 意向 8（24.2%）" },
    ];
    assigneeField.innerHTML = `<span>负责商务</span><small>优先参考在手任务量；意向转化用于辅助判断分配效果。</small><div class="assignee-picker">${assignees.map((assignee, index) => `<button type="button" class="${index === 0 ? "active" : ""}"><strong>${assignee.name}</strong><span>${assignee.workload}</span><small>${assignee.result}</small></button>`).join("")}</div>`;
    assigneeField.querySelectorAll<HTMLButtonElement>(".assignee-picker button").forEach((button) => button.addEventListener("click", () => {
      assigneeField.querySelectorAll(".assignee-picker button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    }));
  }, [assignConflictNames, assignOpen, outreachOverrides, selected]);

  useEffect(() => {
    const filterBar = document.querySelector<HTMLElement>(".library-filter-bar");
    if (!filterBar) return;
    filterBar.querySelectorAll<HTMLSelectElement>(":scope > select").forEach((select) => { select.style.display = "none"; });
    let priority = filterBar.querySelector<HTMLElement>(".priority-library-filters");
    if (!priority) {
      priority = document.createElement("div");
      priority.className = "priority-library-filters";
      const moreButton = filterBar.querySelector(".filter-more");
      filterBar.insertBefore(priority, moreButton);
    }
    priority.innerHTML = `<select data-priority="score" aria-label="AI匹配度"><option value="不限">AI匹配度：不限</option><option value="90">AI匹配度：90分及以上</option><option value="80">AI匹配度：80分及以上</option></select><select data-priority="history" aria-label="建联状态"><option value="不限">建联状态：不限</option><option>有建联记录</option><option>无建联记录</option></select><select data-priority="update" aria-label="数据更新时间"><option value="不限">数据更新时间：不限</option><option>近24小时</option><option>近7天</option></select>${creatorType === "竞品达人" ? `<select data-priority="competitor-store" aria-label="竞品店铺"><option value="全部竞品店铺">竞品店铺：全部</option>${competitorStoreOptions.map((store) => `<option value="${store}">${store}</option>`).join("")}</select>` : ""}`;
    const priorityValues: Record<string, string> = { score: minScore, history: historyFilter, update: updateFilter, "competitor-store": competitorStoreFilter };
    priority.querySelectorAll<HTMLSelectElement>("select").forEach((select) => {
      select.value = priorityValues[select.dataset.priority ?? ""];
      select.addEventListener("change", () => {
        if (select.dataset.priority === "score") setMinScore(select.value);
        if (select.dataset.priority === "history") setHistoryFilter(select.value);
        if (select.dataset.priority === "update") setUpdateFilter(select.value);
        if (select.dataset.priority === "competitor-store") setCompetitorStoreFilter(select.value);
        resetPage();
      });
    });
    const clearButton = document.querySelector<HTMLButtonElement>(".filter-tags .clear-filter");
    if (clearButton) clearButton.onclick = () => { setUpdateFilter("不限"); setFollowersFilter("不限"); setSettlementFilter("不限"); setProductCountFilter("不限"); setStoreCountFilter("不限"); };
    if (!showAdvanced) return;
    const advanced = document.querySelector<HTMLElement>(".advanced-filters");
    if (!advanced) return;
    advanced.innerHTML = `<label>采集来源<select data-advanced="source"><option>全部来源</option><option>短视频达人抓取</option><option>直播达人抓取</option><option>竞品直播达人抓取</option></select></label><label>带货类目<select data-advanced="category"><option>全部类目</option><option>3C数码家电</option><option>家电测评</option><option>清洁收纳</option><option>居家生活</option><option>家居百货</option><option>数码家电</option></select></label><label>粉丝量<select data-advanced="followers"><option>不限</option><option value="50">50万及以上</option><option value="100">100万及以上</option></select></label><label>近30天结算金额<select data-advanced="settlement"><option>不限</option><option value="50">50万及以上</option><option value="100">100万及以上</option></select></label><label>推广品数量<select data-advanced="products"><option>不限</option><option value="100">100个及以上</option><option value="150">150个及以上</option></select></label><label>合作店数<select data-advanced="stores"><option>不限</option><option value="40">40家及以上</option><option value="60">60家及以上</option></select></label><button type="button" data-advanced-reset>重置筛选</button>`;
    const legacySourceOption = Array.from(advanced.querySelectorAll<HTMLOptionElement>("option")).find((option) => option.textContent === "竞品直播达人抓取");
    if (legacySourceOption) legacySourceOption.textContent = "竞品直播间抓取";
    const advancedValues: Record<string, string> = { source: sourceFilter, category: categoryFilter, followers: followersFilter, settlement: settlementFilter, products: productCountFilter, stores: storeCountFilter };
    advanced.querySelectorAll<HTMLSelectElement>("select").forEach((select) => {
      select.value = advancedValues[select.dataset.advanced ?? ""];
      select.addEventListener("change", () => {
        const value = select.value;
        if (select.dataset.advanced === "source") setSourceFilter(value);
        if (select.dataset.advanced === "category") setCategoryFilter(value);
        if (select.dataset.advanced === "followers") setFollowersFilter(value);
        if (select.dataset.advanced === "settlement") setSettlementFilter(value);
        if (select.dataset.advanced === "products") setProductCountFilter(value);
        if (select.dataset.advanced === "stores") setStoreCountFilter(value);
        resetPage();
      });
    });
    advanced.querySelector<HTMLButtonElement>("[data-advanced-reset]")?.addEventListener("click", () => { setSourceFilter("全部来源"); setCategoryFilter("全部类目"); setFollowersFilter("不限"); setSettlementFilter("不限"); setProductCountFilter("不限"); setStoreCountFilter("不限"); resetPage(); });
  }, [categoryFilter, competitorStoreFilter, creatorType, followersFilter, historyFilter, minScore, productCountFilter, settlementFilter, showAdvanced, sourceFilter, storeCountFilter, updateFilter]);

  function resetPage() { setPage(1); }
  function changeCreatorType(type: "短视频" | "直播" | "竞品达人") { setCreatorType(type); setSelected([]); setCompetitorStoreFilter("全部竞品店铺"); resetPage(); }

  useEffect(() => {
    if (!detailCreator) return;
    const togglePool = () => {
      if (!canAssignCreator(detailCreator)) {
        notify(assignBlockMessage(detailCreator), "warning");
        return;
      }
      const alreadyInPool = selected.includes(detailCreator.id);
      setSelected((current) => alreadyInPool ? current.filter((id) => id !== detailCreator.id) : [...current, detailCreator.id]);
      notify(alreadyInPool ? "已移出待分配池" : "已加入待分配池", "success");
    };
    const createPoolButton = () => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "primary-button detail-pool-action";
      button.textContent = selected.includes(detailCreator.id) ? "移出待分配池" : "加入待分配池";
      button.addEventListener("click", togglePool);
      return button;
    };
    const footer = document.querySelector<HTMLElement>(".creator-detail-drawer > footer");
    let footerAction: HTMLButtonElement | null = null;
    if (footer && canAssignCreator(detailCreator)) {
      Array.from(footer.querySelectorAll<HTMLButtonElement>("button")).find((button) => /待分配/.test(button.textContent ?? ""))?.remove();
      footerAction = createPoolButton();
      footer.append(footerAction);
    }
    const historyAction = document.querySelector<HTMLButtonElement>(".creator-detail-drawer .outreach-empty-state .primary-button");
    let historyPoolAction: HTMLButtonElement | null = null;
    if (historyAction && canAssignCreator(detailCreator)) {
      historyPoolAction = createPoolButton();
      historyAction.replaceWith(historyPoolAction);
    }
    return () => {
      footerAction?.remove();
      historyPoolAction?.remove();
    };
  }, [detailCreator, detailTab, outreachOverrides, selected]);

  function toggleCreator(id: string) {
    const creator = creatorRows.find((item) => item.id === id);
    if (!creator || !canAssignCreator(creator)) { notify(creator ? assignBlockMessage(creator) : "当前达人不可分配", "warning"); return; }
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function openAssignment() {
    setAssignConflictNames([]);
    setAssignOpen(true);
  }

  function confirmAssignment() {
    // 待分配池是暂存选择；提交时必须按当前建联状态重新校验，避免选中后被其他商务建联而重复分配。
    const selectedCreators = selected.map((id) => creatorRows.find((creator) => creator.id === id)).filter((creator): creator is typeof creatorRows[number] => Boolean(creator));
    const expectedType = creatorType === "短视频" ? "短视频达人" : creatorType === "直播" ? "直播达人" : "竞品达人";
    const mixedTypeCreators = selectedCreators.filter((creator) => creator.type !== expectedType);
    if (mixedTypeCreators.length) {
      notify(`当前批次只能包含${expectedType}，请拆分后分别创建批次`, "warning");
      setSelected((current) => current.filter((id) => !mixedTypeCreators.some((creator) => creator.id === id)));
      return;
    }
    const activeConflicts = selectedCreators.filter(hasActiveOutreachTask);
    const otherBlocked = selectedCreators.filter((creator) => !canAssignCreator(creator) && !hasActiveOutreachTask(creator));
    const blockedIds = new Set([...activeConflicts, ...otherBlocked].map((creator) => creator.id));
    if (blockedIds.size) {
      setSelected((current) => current.filter((id) => !blockedIds.has(id)));
      if (activeConflicts.length) {
        const names = activeConflicts.map((creator) => creator.name);
        setAssignConflictNames(names);
        notify(`以下达人已存在进行中的建联任务，无法分配：${names.join("、")}。已自动从本次分配中移除。`, "warning");
      } else {
        setAssignConflictNames([]);
        notify("不可分配达人已自动从本次分配中移除，请确认剩余达人后再次提交", "warning");
      }
      return;
    }
    if (!selectedCreators.length) {
      notify("待分配池中暂无可分配达人", "warning");
      return;
    }
    const batchId = `FP20260820${String(sharedOutreachTasks.length + 1).padStart(3, "0")}`;
    const createdAt = "今天 14:20";
    const newTasks: SharedOutreachTask[] = selectedCreators.map((creator, index) => ({ taskId: `CT20260820${String(sharedOutreachTasks.length + index + 1).padStart(3, "0")}`, creatorId: creator.id, batchId, owner: "陈小雨", processStage: "已分配", createdAt, updatedAt: createdAt, assignedBy: "陈旭光" }));
    publishSharedOutreachTasks([...sharedOutreachTasks, ...newTasks]);
    setOutreachOverrides((current) => {
      const next = { ...current };
      selectedCreators.forEach((creator, index) => { next[creator.id] = { processStage: "已分配", stage: "已分配", taskId: newTasks[index].taskId, assignedAt: createdAt, assignedBy: "陈旭光", owner: "陈小雨", batch: batchId, batchSize: selectedCreators.length, batchCreatedAt: createdAt, addedAt: undefined, agreedAt: undefined, repliedAt: undefined, intentAt: undefined, finalResult: undefined }; });
      return next;
    });
    setAssignOpen(false);
    setAssignConflictNames([]);
    setSelected([]);
    notify(`已创建分配批次 ${batchId}，并生成 ${newTasks.length} 条建联任务`, "success");
  }

  function confirmReassignment() {
    if (!reassignCreator) return;
    const previousTask = { ...reassignCreator.outreach, ...outreachOverrides[reassignCreator.id] };
    if (!previousTask || getTaskSummary(previousTask) !== "未达成") {
      setReassignCreatorId(null);
      notify("该达人当前不满足重新分配条件", "warning");
      return;
    }
    const taskId = `CT20260820${reassignCreator.id.replace("c", "").padStart(4, "0")}R`;
    const reassignedTask: SharedOutreachTask = { taskId, creatorId: reassignCreator.id, batchId: "FP20260820001", owner: "陈小雨", processStage: "已分配", createdAt: "今天 14:20", updatedAt: "今天 14:20", assignedBy: "陈旭光" };
    publishSharedOutreachTasks([...sharedOutreachTasks, reassignedTask]);
    setOutreachTaskHistory((current) => ({ ...current, [reassignCreator.id]: [...(current[reassignCreator.id] ?? []), previousTask] }));
    setOutreachOverrides((current) => ({
      ...current,
      [reassignCreator.id]: {
        processStage: "已分配",
        finalResult: undefined,
        stage: "已分配",
        taskId,
        assignedAt: "今天 14:20",
        assignedBy: "陈旭光",
        owner: "陈小雨",
        batch: "FP20260820001",
        batchSize: 1,
        batchCreatedAt: "今天 14:20",
        note: "原任务未达成，已重新创建建联任务并分配跟进。",
        addedAt: undefined,
        agreedAt: undefined,
        repliedAt: undefined,
        intentAt: undefined,
        unreachedAt: undefined,
        unreachedStage: undefined,
        unreachedReason: undefined,
      },
    }));
    setReassignCreatorId(null);
    notify(`已创建新的建联任务 ${taskId}，原任务记录已保留`, "success");
  }

  function toggleAll() {
    setSelected((current) => allVisibleSelected ? current.filter((id) => !assignablePageCreators.some((creator) => creator.id === id)) : Array.from(new Set([...current, ...assignablePageCreators.map((creator) => creator.id)])));
  }

  return <>
    <header className="page-header library-head">
      <div><h1>达人库</h1><p>统一沉淀可筛选、可复用的达人资产，批量选择后创建建联任务。</p></div>
      <div className="header-actions"><button className="primary-button" onClick={() => selected.length ? openAssignment() : notify("请先选择需要建联的达人", "warning")}>＋ 分配建联</button></div>
    </header>

    <section className="library-summary">
      <button onClick={() => changeCreatorType("短视频")} className={creatorType === "短视频" ? "active" : ""}><span className="library-summary-icon video">短</span><div><small>短视频达人</small><strong>83,426</strong><em>今日新增 846</em></div><i>→</i></button>
      <button onClick={() => changeCreatorType("直播")} className={creatorType === "直播" ? "active" : ""}><span className="library-summary-icon live">播</span><div><small>直播达人</small><strong>45,216</strong><em>其中竞品带货 3,284</em></div><i>→</i></button>
      <button onClick={() => changeCreatorType("竞品达人")} className={creatorType === "竞品达人" ? "active" : ""}><span className="library-summary-icon competitor">竞</span><div><small>竞品达人</small><strong>3,284</strong><em>仅展示直播类型达人</em></div><i>→</i></button>
      <div className="library-summary-note"><span>i</span><p>同一达人按“平台 + 达人UID”建立统一主档，不同抓取来源会合并保留。</p></div>
    </section>

    <section className="panel library-panel">
      <div className="library-tabs"><div className="tabs"><button className={creatorType === "短视频" ? "active" : ""} onClick={() => changeCreatorType("短视频")}>短视频达人 <span>83,426</span></button><button className={creatorType === "直播" ? "active" : ""} onClick={() => changeCreatorType("直播")}>直播达人 <span>45,216</span></button><button className={creatorType === "竞品达人" ? "active" : ""} onClick={() => changeCreatorType("竞品达人")}>竞品达人 <span>3,284</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>
      <div className="library-filter-bar">
        <div className="search-field"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="搜索达人昵称、UID或带货类目" /></div>
        <select aria-label="数据来源" value={sourceFilter} onChange={(event) => { setSourceFilter(event.target.value); resetPage(); }}><option>全部来源</option><option>精选联盟</option><option>蝉妈妈</option><option>竞品抓取</option></select>
        <select aria-label="带货类目" value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); resetPage(); }}><option>全部类目</option><option>3C数码家电</option><option>家电测评</option><option>清洁收纳</option><option>居家生活</option><option>家居百货</option><option>数码家电</option></select>
        <button className={`filter-more ${showAdvanced ? "active" : ""}`} onClick={() => setShowAdvanced((value) => !value)}>⌘ 更多筛选</button>
      </div>
      {showAdvanced && <div className="advanced-filters"><label>AI匹配度<select value={minScore} onChange={(event) => { setMinScore(event.target.value); resetPage(); }}><option>不限</option><option value="90">90分及以上</option><option value="80">80分及以上</option></select></label><label>建联状态<select value={historyFilter} onChange={(event) => { setHistoryFilter(event.target.value); resetPage(); }}><option>不限</option><option>有建联记录</option><option>无建联记录</option></select></label><label>数据更新时间<select><option>不限</option><option>近24小时</option><option>近7天</option></select></label><button onClick={() => { setSourceFilter("全部来源"); setCategoryFilter("全部类目"); setMinScore("不限"); setHistoryFilter("不限"); setQuery(""); resetPage(); }}>重置筛选</button></div>}
      <div className="filter-tags"><span>已选条件</span>{sourceFilter !== "全部来源" && <button onClick={() => { setSourceFilter("全部来源"); resetPage(); }}>{sourceFilter} <i>×</i></button>}{categoryFilter !== "全部类目" && <button onClick={() => { setCategoryFilter("全部类目"); resetPage(); }}>{categoryFilter} <i>×</i></button>}{minScore !== "不限" && <button onClick={() => { setMinScore("不限"); resetPage(); }}>AI匹配度 ≥ {minScore} <i>×</i></button>}{historyFilter !== "不限" && <button onClick={() => { setHistoryFilter("不限"); resetPage(); }}>{historyFilter} <i>×</i></button>}{sourceFilter === "全部来源" && categoryFilter === "全部类目" && minScore === "不限" && historyFilter === "不限" && <small>暂未设置筛选条件</small>}<button className="clear-filter" onClick={() => { setSourceFilter("全部来源"); setCategoryFilter("全部类目"); setMinScore("不限"); setHistoryFilter("不限"); setQuery(""); resetPage(); }}>清空</button></div>
      <div className="library-toolbar"><label><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} /> 全选本页</label><span>筛选结果 <strong>{visibleCreators.length}</strong> 位达人</span><div><button onClick={() => notify(`已导出当前 ${visibleCreators.length} 位达人`, "success")}>⇩ 导出</button><select aria-label="排序方式" value={sortKey} onChange={(event) => { setSortKey(event.target.value as typeof sortKey); resetPage(); }}><option>AI匹配度</option><option>粉丝量</option><option>近30天结算</option></select></div></div>
      <div className="table-wrap creator-table"><table><thead><tr><th><input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="全选" /></th><th>达人</th><th>达人类型 / 类目</th><th>粉丝量</th><th>近30天结算</th><th>直播</th><th>视频</th><th>推广品</th><th>合作店</th><th>AI匹配度</th><th>来源</th><th>建联状态</th><th>数据更新</th><th>操作</th></tr></thead><tbody>{pageCreators.map((creator) => <tr key={creator.id}><td><input type="checkbox" checked={selected.includes(creator.id)} onChange={() => toggleCreator(creator.id)} aria-label={`选择${creator.name}`} /></td><td><div className="creator-cell"><span className={`creator-avatar ${creator.avatar}`}>{creator.initials}</span><div><strong>{creator.name}</strong><small>{creator.uid}</small></div></div></td><td><div className="category-cell"><span>{creator.type}</span><small>{creator.category}</small></div></td><td>{creator.followers}</td><td><strong>{creator.settlement}</strong></td><td>{creator.live}</td><td>{creator.video}</td><td>{creator.products}</td><td>{creator.stores}</td><td><span className="score-circle" title={`AI匹配度 ${creator.score}`}>{creator.score}</span></td><td><span className="source-tag">{creator.source}</span></td><td><span className={`history-tag ${creator.contactStatus === "未建联" ? "empty" : ""}`}>{creator.contactStatus}</span></td><td><span className="update-time">今天 {creator.update}</span></td><td><button className="row-action" onClick={() => { setDetailId(creator.id); setDetailTab("overview"); }}>查看</button></td></tr>)}</tbody></table></div>
      {!visibleCreators.length && <div className="library-empty"><span>⌕</span><strong>没有找到匹配的达人</strong><small>试试调整搜索词或筛选条件</small></div>}
      <div className="library-pagination"><span>显示 {visibleCreators.length ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, visibleCreators.length)} 条，共 {visibleCreators.length} 条</span><div><button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} className={number === currentPage ? "active" : ""} onClick={() => setPage(number)}>{number}</button>)}<button disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>›</button></div></div>
    </section>

    {selected.length > 0 && <div className="selection-bar"><div><span className="selection-count">{selected.length}</span><strong>已选择 {selected.length} 位达人</strong><small>可跨筛选条件保留选择结果</small></div><div><button className="ghost-button" onClick={() => setSelected([])}>清空选择</button><button className="primary-button" onClick={openAssignment}>分配建联 <span>→</span></button></div></div>}

    {detailCreator && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="creator-detail-drawer" role="dialog" aria-modal="true" aria-label="达人详情"><header><div><span className={`creator-avatar ${detailCreator.avatar}`}>{detailCreator.initials}</span><div><small>达人详情</small><h2>{detailCreator.name}</h2><p>{detailCreator.uid} · {detailCreator.type}</p></div></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-tabs"><button className={detailTab === "overview" ? "active" : ""} onClick={() => setDetailTab("overview")}>基础信息</button><button className={detailTab === "relations" ? "active" : ""} onClick={() => setDetailTab("relations")}>竞品与来源</button><button className={detailTab === "history" ? "active" : ""} onClick={() => setDetailTab("history")}>建联状态</button></div><div className="drawer-body">{detailTab === "overview" && <><div className="drawer-score"><div className="drawer-score-heading"><span>AI匹配度</span><span className="score-circle large">{detailCreator.score}</span></div><p>基于公开数据表现生成，供业务优先建联参考。</p></div><div className="detail-metrics"><div><small>粉丝量</small><strong>{detailCreator.followers}</strong></div><div><small>近30天结算</small><strong>{detailCreator.settlement}</strong></div><div><small>直播</small><strong>{detailCreator.live}</strong></div><div><small>视频</small><strong>{detailCreator.video}</strong></div><div><small>推广品</small><strong>{detailCreator.products}</strong></div><div><small>合作店</small><strong>{detailCreator.stores}</strong></div><div><small>达人类型 / 类目</small><strong>{detailCreator.type} / {detailCreator.category}</strong></div><div><small>建联状态</small><strong><span className={`history-tag ${detailCreator.contactStatus === "未建联" ? "empty" : ""}`}>{detailCreator.contactStatus}</span></strong></div></div></>}{detailTab === "relations" && <><section className="detail-section"><h3>数据来源</h3><p><span className="source-tag">{detailCreator.source}</span> 已同步达人基础信息和公开带货数据。</p></section><section className="detail-section"><h3>关联竞品</h3><p>{detailCreator.source === "竞品抓取" ? "已命中 2 个竞品商品，可作为优先建联参考。" : "当前未发现竞品商品关联。"}</p></section></>}{detailTab === "history" && outreach && <>{outreach.stage === "未建联" ? <section className="outreach-empty-state"><span>○</span><div><h3>暂未发起建联</h3><p>该达人暂无公司内部建联记录。加入待分配清单后，可在建联管理中创建分配批次并生成任务。</p></div><button className="primary-button" onClick={() => { if (!selected.includes(detailCreator.id)) toggleCreator(detailCreator.id); notify("已加入待分配清单，可继续分配建联", "success"); }}>{selected.includes(detailCreator.id) ? "已在待分配清单" : "加入待分配清单"}</button></section> : <><section className="outreach-status-hero"><div><span className="history-tag">{outreach.stage}</span><strong>{outreach.product}</strong><small>建联任务 {outreach.taskId}</small></div><p>{outreach.note}</p></section><div className="outreach-stepper">{outreachStages.map((stage, index) => <div className={index <= currentOutreachStage ? "done" : ""} key={stage}><i>{index < currentOutreachStage ? "✓" : index + 1}</i><span>{stage}</span></div>)}</div><section className="detail-section"><h3>分配信息</h3><div className="task-detail-grid outreach-detail-grid"><div><small>分配时间</small><strong>{outreach.assignedAt}</strong></div><div><small>分配人</small><strong>{outreach.assignedBy}</strong></div><div><small>负责商务</small><strong>{outreach.owner}</strong></div><div><small>推广商品</small><strong>{outreach.product}</strong></div></div></section><section className="detail-section"><h3>当前分配批次</h3><div className="outreach-batch-card"><div><strong>{outreach.batch}</strong><small>批量分配 · 共 {outreach.batchSize} 位达人</small></div><span>创建于 {outreach.batchCreatedAt}</span></div></section><section className="detail-section"><h3>流转记录</h3><div className="contact-timeline">{outreachTimeline.map((item) => <div key={item.label}><span>{item.label}</span><small>{item.detail}</small></div>)}</div></section></>}</>}</div><footer><button className="ghost-button" onClick={() => setDetailId(null)}>关闭</button>{detailCreator.contactStatus === "未建联" && <button className="primary-button" onClick={() => { toggleCreator(detailCreator.id); notify(`已${selected.includes(detailCreator.id) ? "移出" : "加入"}待分配清单`, "success"); }}>{selected.includes(detailCreator.id) ? "移出待分配清单" : "加入待分配清单"}</button>}</footer></aside></div>}

    {assignOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAssignOpen(false); }}><section className="assign-modal" role="dialog" aria-modal="true" aria-labelledby="assign-title"><header><div><small>创建分配批次</small><h2 id="assign-title">将 {selected.length} 位达人分配给商务</h2><p>系统将按“一达人一条建联任务”生成独立任务。</p></div><button onClick={() => setAssignOpen(false)} aria-label="关闭">×</button></header><div className="assign-modal-body"><label>推广商品<select defaultValue=""><option value="" disabled>请选择推广商品</option><option>创维循环扇</option><option>小熊破壁机</option><option>苏泊尔空气炸锅</option></select></label><label>负责商务<select defaultValue=""><option value="" disabled>请选择负责商务</option><option>陈小雨</option><option>林晓婷</option><option>张文豪</option><option>赵明轩</option></select></label><label className="assign-note">备注<textarea placeholder="可选，填写本次建联的补充说明" /></label><div className="assign-warning"><span>i</span><p>已选择的达人中，有 <strong>{selected.filter((id) => creatorRows.find((creator) => creator.id === id)?.contactStatus !== "未建联").length}</strong> 位存在建联记录，提交前可在建联管理中继续核查。</p></div></div><footer><button className="ghost-button" onClick={() => setAssignOpen(false)}>取消</button><button className="primary-button" onClick={confirmAssignment}>确认创建</button></footer></section></div>}
    {reassignCreator && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setReassignCreatorId(null); }}><section className="reassign-modal" role="dialog" aria-modal="true" aria-labelledby="reassign-title"><header><div><small>重新分配建联</small><h2 id="reassign-title">为 {reassignCreator.name} 创建新的建联任务</h2><p>原任务不会被修改或覆盖。</p></div><button onClick={() => setReassignCreatorId(null)} aria-label="关闭">×</button></header><div className="reassign-modal-body"><div className="reassign-notice"><span>i</span><div><strong>重新分配将创建新的建联任务。</strong><p>原任务记录将继续保留。</p></div></div><div className="reassign-task-preview"><div><small>原任务</small><strong>{reassignCreator.outreach?.taskId ?? "—"}</strong></div><div><small>原任务结果</small><strong>未达成</strong></div><div><small>新任务负责商务</small><strong>陈小雨</strong></div></div></div><footer><button className="ghost-button" onClick={() => setReassignCreatorId(null)}>取消</button><button className="primary-button" onClick={confirmReassignment}>确认创建新任务</button></footer></section></div>}
  </>;
}

function CreatorCollection({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [tab, setTab] = useState<"configs" | "tasks">("configs");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [configType, setConfigType] = useState<"短视频达人" | "直播达人" | "竞品达人">("短视频达人");
  const [configSource, setConfigSource] = useState("蝉妈妈");
  const [configNameTouched, setConfigNameTouched] = useState(false);
  const [creatorTypes, setCreatorTypes] = useState<Array<"视频达人" | "直播达人">>(["视频达人"]);
  const [timeRange, setTimeRange] = useState("近1个月");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [videoGmvOperator, setVideoGmvOperator] = useState<"不限" | "大于等于">("不限");
  const [videoGmvValue, setVideoGmvValue] = useState("");
  const [liveGmvOperator, setLiveGmvOperator] = useState<"不限" | "大于等于">("大于等于");
  const [liveGmvValue, setLiveGmvValue] = useState("");
  const [competitorStoreText, setCompetitorStoreText] = useState("");
  const [competitorStores, setCompetitorStores] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<"手动执行" | "每日执行" | "每周执行">("手动执行");
  const [dailyTimes, setDailyTimes] = useState(["08:00"]);
  const [weeklySchedules, setWeeklySchedules] = useState([{ day: "周一", time: "09:00" }]);
  const [taskFilter, setTaskFilter] = useState("全部");
  const [configPage, setConfigPage] = useState(1);
  const [collectionTaskPage, setCollectionTaskPage] = useState(1);
  const [detailTask, setDetailTask] = useState<string | null>(null);
  const [rerunConfirmTaskId, setRerunConfirmTaskId] = useState<string | null>(null);
  const [configs, setConfigs] = useState([
    { id: "PC202608001", name: "短视频达人·家居生活", type: "短视频达人", source: "蝉妈妈", scope: "家居生活 / 清洁电器", frequency: "每日 08:00", lastRun: "今天 08:00", status: "启用" },
    { id: "PC202608002", name: "直播达人全量更新", type: "直播达人", source: "精选联盟", scope: "直播达人", frequency: "每日 06:00", lastRun: "今天 06:03", status: "启用" },
    { id: "PC202608003", name: "循环扇竞品达人", type: "竞品达人", source: "蝉妈妈", scope: "创维循环扇 · 3 个竞品", frequency: "每周一 09:00", lastRun: "2026-08-17 09:18", status: "启用" },
    { id: "PC202607018", name: "短视频达人·厨房小电", type: "短视频达人", source: "精选联盟", scope: "厨房电器", frequency: "手动执行", lastRun: "2026-08-15 17:42", status: "停用" },
  ].map((config) => ({
    ...config,
    timeRange: config.type === "直播达人" ? "近1个月" : "近30天",
    creatorTypes: [config.type],
    creatorType: config.type,
    videoGmv: config.type === "短视频达人" ? "≥ 10万" : "不限",
    liveGmv: config.type === "直播达人" ? "≥ 25万" : "不限",
    competitorStores: config.type.includes("竞品") ? ["美的生活电器旗舰店", "米家官方旗舰店", "小熊官方旗舰店"] : [],
  })));
  const [tasks, setTasks] = useState([
    { id: "CT20260818026", type: "短视频达人", config: "短视频达人·家居生活", source: "蝉妈妈", start: "今天 08:00", result: "新增 846 · 更新 1,732", failed: 0, status: "已完成" },
    { id: "CT20260818025", type: "直播达人", config: "直播达人全量更新", source: "精选联盟", start: "今天 06:03", result: "新增 337 · 更新 674", failed: 0, status: "已完成" },
    { id: "CT20260818024", type: "竞品达人", config: "循环扇竞品达人", source: "蝉妈妈", start: "今天 02:00", result: "新增 94 · 更新 218", failed: 32, status: "部分失败" },
    { id: "CT20260817021", type: "短视频达人", config: "短视频达人·厨房小电", source: "精选联盟", start: "昨天 17:42", result: "接口请求超时", failed: 0, status: "执行失败" },
    { id: "CT20260818027", type: "短视频达人", config: "短视频达人·家居生活", source: "蝉妈妈", start: "今天 14:00", result: "计划于今天 14:00 自动执行", failed: 0, status: "待执行" },
    { id: "CT20260818028", type: "直播达人", config: "直播达人全量更新", source: "精选联盟", start: "今天 18:00", result: "计划于今天 18:00 自动执行", failed: 0, status: "待执行" },
    { id: "CT20260818029", type: "竞品达人", config: "循环扇竞品达人", source: "蝉妈妈", start: "今天 11:30", result: "正在拉取竞品达人数据", failed: 0, status: "执行中" },
    { id: "CT20260817020", type: "短视频达人", config: "短视频达人·厨房小电", source: "精选联盟", start: "今天 07:00", result: "任务在计划执行前已取消，未产生抓取结果", failed: 0, status: "已取消" },
    { id: "CT20260817019", type: "直播达人", config: "直播达人全量更新", source: "精选联盟", start: "昨天 18:00", result: "执行中被主管停止，已保留新增 126、更新 218 条数据", failed: 0, status: "已停止" },
  ].map((task) => ({
    ...task,
    // 任务是配置产生的一次执行实例；配置本身不承担任何执行状态或结果。
    configId: configs.find((config) => config.name === task.config)?.id ?? "PC-UNKNOWN",
    plannedAt: task.status === "待执行" ? task.start : `计划 ${task.start}`,
    actualStartedAt: task.status === "待执行" ? "—" : task.start,
    endedAt: ["已完成", "部分失败", "执行失败", "已停止"].includes(task.status) ? task.start : "—",
    // 成功数据按批实时写入达人库；仅未开始或整体执行失败时没有成功写入记录。部分失败、停止不回滚此前已写入的数据。
    addedCount: task.status === "待执行" || task.status === "已取消" || task.status === "执行失败" ? 0 : task.status === "已停止" ? 126 : task.type.includes("竞品") ? 94 : task.type.includes("直播") ? 337 : 846,
    updatedCount: task.status === "待执行" || task.status === "已取消" || task.status === "执行失败" ? 0 : task.status === "已停止" ? 218 : task.type.includes("竞品") ? 218 : task.type.includes("直播") ? 674 : 1732,
    executionRecords: [{ attempt: 1, plannedAt: task.start, startedAt: task.status === "待执行" || task.status === "已取消" ? "—" : task.start, status: task.status, result: task.result, added: task.status === "待执行" || task.status === "已取消" || task.status === "执行失败" ? 0 : task.status === "已停止" ? 126 : task.type.includes("竞品") ? 94 : task.type.includes("直播") ? 337 : 846, updated: task.status === "待执行" || task.status === "已取消" || task.status === "执行失败" ? 0 : task.status === "已停止" ? 218 : task.type.includes("竞品") ? 218 : task.type.includes("直播") ? 674 : 1732, failed: task.failed }],
    timeRange: task.type === "直播达人" ? "近1个月" : "近30天",
    creatorTypes: [task.type],
    creatorType: task.type,
    videoGmv: task.type === "短视频达人" ? "≥ 10万" : "不限",
    liveGmv: task.type === "直播达人" ? "≥ 25万" : "不限",
    frequency: task.type.includes("竞品") ? "每周 周一 09:00" : task.type.includes("直播") ? "每日 06:00" : "每日 08:00",
    competitorStores: task.type.includes("竞品") ? ["美的生活电器旗舰店", "米家官方旗舰店", "小熊官方旗舰店"] : [],
  })));

  // “待执行”表示某个启用配置按计划生成的下一次执行实例：每个配置只保留最近的一条，
  // 到执行时间后该实例流转为“执行中/已完成”，再生成下一次待执行；不为每日、每周配置预生成无限多条未来任务。
  // 手动执行的配置不生成待执行实例，只有用户点击“立即执行”时才创建执行任务。
  const visibleTasks = tasks.filter((task) => taskFilter === "全部" || task.status === taskFilter);
  const currentTask = tasks.find((task) => task.id === detailTask) ?? null;

  useEffect(() => { setConfigPage(1); }, [configs.length]);
  useEffect(() => { setCollectionTaskPage(1); }, [taskFilter, tasks.length]);

  useEffect(() => {
    const stats = document.querySelectorAll<HTMLElement>(".collection-stat-grid article");
    const hitLabel = stats[1]?.querySelector("small");
    const hitDetail = stats[1]?.querySelector("em");
    if (hitLabel) hitLabel.textContent = "今日采集命中";
    if (hitDetail) hitDetail.textContent = "新增 1,183 · 合并更新 2,406";
    const panel = document.querySelector<HTMLElement>(".collection-panel");
    if (!panel || panel.querySelector(".collection-dedup-note")) return;
    const note = document.createElement("div");
    note.className = "collection-dedup-note";
    note.innerHTML = "<span>i</span><p>采集结果按“平台 + 达人UID”匹配唯一达人主档。命中同一达人时，按竞品达人 &gt; 直播达人 &gt; 短视频达人判断归属；仅当新采集优先级更高时迁移类型，并以本次配置、任务、时间覆盖旧采集信息。</p>";
    panel.querySelector(".collection-tabs")?.insertAdjacentElement("afterend", note);
  }, [tab]);

  useEffect(() => {
    if (!createOpen && editingConfigId) setEditingConfigId(null);
  }, [createOpen, editingConfigId]);

  useEffect(() => {
    if (tab !== "configs") return;
    document.querySelectorAll<HTMLElement>(".config-card").forEach((card) => {
      card.querySelector("[data-config-competitor-stores]")?.remove();
      card.querySelector("[data-config-disabled-note]")?.remove();
      const config = configs.find((item) => item.name === card.querySelector(".config-main h2")?.textContent);
      if (!config) return;
      const isDisabled = config.status === "停用";
      card.classList.toggle("is-disabled", isDisabled);
      card.setAttribute("aria-disabled", String(isDisabled));
      const runButton = Array.from(card.querySelectorAll<HTMLButtonElement>(".config-actions button")).find((button) => button.textContent === "立即执行");
      if (runButton) runButton.title = isDisabled ? "该配置已停用，无法立即执行" : "根据此配置创建一条新的抓取任务";
      const latestTask = tasks.find((task) => task.configId === config.id);
      const meta = card.querySelectorAll<HTMLElement>(".config-meta span");
      if (meta[1]) meta[1].innerHTML = `最近任务：<strong>${latestTask ? `${latestTask.id} · ${latestTask.status}` : "暂未生成任务"}</strong>`;
      if (isDisabled) {
        const note = document.createElement("span");
        note.dataset.configDisabledNote = "true";
        note.className = "config-disabled-note";
        note.textContent = "已停用：不再生成新的自动抓取任务；历史任务保留";
        card.querySelector(".config-meta")?.append(note);
      }
      if (!config.competitorStores?.length) return;
      const item = document.createElement("span");
      item.dataset.configCompetitorStores = "true";
      item.className = "config-competitor-stores";
      item.textContent = `竞品店铺：${config.competitorStores.join("、")}`;
      card.querySelector(".collection-condition-list")?.append(item);
    });
  }, [tab, configs, tasks]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const filterGroup = document.querySelector<HTMLElement>(".task-filter > div");
    if (!filterGroup) return;
    let button = filterGroup.querySelector<HTMLButtonElement>("[data-stopped-filter]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.stoppedFilter = "true";
      button.textContent = "已停止";
      button.addEventListener("click", () => setTaskFilter("已停止"));
      filterGroup.append(button);
    }
    button.classList.toggle("active", taskFilter === "已停止");
    let cancelledButton = filterGroup.querySelector<HTMLButtonElement>("[data-cancelled-filter]");
    if (!cancelledButton) {
      cancelledButton = document.createElement("button");
      cancelledButton.type = "button";
      cancelledButton.dataset.cancelledFilter = "true";
      cancelledButton.textContent = "已取消";
      cancelledButton.addEventListener("click", () => setTaskFilter("已取消"));
      filterGroup.append(cancelledButton);
    }
    cancelledButton.classList.toggle("active", taskFilter === "已取消");
  }, [tab, taskFilter]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const table = document.querySelector<HTMLElement>(".task-table table");
    if (!table) return;
    const header = table.querySelector("thead tr");
    if (header && !header.querySelector("[data-schedule-column]")) {
      const cell = document.createElement("th");
      cell.dataset.scheduleColumn = "true";
      cell.textContent = "执行计划";
      header.insertBefore(cell, header.lastElementChild);
    }
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      row.querySelector("[data-schedule-cell]")?.remove();
      const cell = document.createElement("td");
      cell.dataset.scheduleCell = "true";
      cell.textContent = visibleTasks[index]?.frequency ?? "手动执行";
      row.insertBefore(cell, row.lastElementChild);
      const task = visibleTasks[index];
      const competitorCell = document.createElement("td");
      competitorCell.dataset.competitorStoreCell = "true";
      row.querySelector("[data-competitor-store-cell]")?.remove();
      competitorCell.textContent = task?.competitorStores?.length ? `${task.competitorStores[0]}${task.competitorStores.length > 1 ? ` 等 ${task.competitorStores.length} 家` : ""}` : "—";
      row.insertBefore(competitorCell, row.lastElementChild);
      const actionCell = row.lastElementChild;
      actionCell?.querySelector("[data-task-action]")?.remove();
      if (!task) return;
      const actions = task.status === "待执行" ? [{ label: "立即执行", run: () => startCollectionTask(task.id) }, { label: "取消任务", run: () => cancelCollectionTask(task.id), tone: "stop" }]
        : task.status === "执行中" ? [{ label: "停止", run: () => stopCollectionTask(task.id), tone: "stop" }]
        : task.status === "部分失败" ? [{ label: "重新执行", run: () => requestCollectionRerun(task.id) }]
        : task.status === "执行失败" ? [{ label: "重新执行", run: () => requestCollectionRerun(task.id) }]
        : task.status === "已停止" ? [{ label: "重新启动", run: () => startCollectionTask(task.id) }]
        : [];
      actions.forEach((action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `row-action task-retry-action ${action.tone ?? ""}`;
        button.dataset.taskAction = task.id;
        button.textContent = action.label;
        button.addEventListener("click", action.run);
        actionCell?.append(button);
      });
    });
    if (header && !header.querySelector("[data-competitor-store-column]")) {
      const cell = document.createElement("th");
      cell.dataset.competitorStoreColumn = "true";
      cell.textContent = "竞品店铺";
      header.insertBefore(cell, header.lastElementChild);
    }
  }, [tab, tasks, taskFilter]);

  useEffect(() => {
    if (tab !== "configs") return;
    const list = document.querySelector<HTMLElement>(".config-list");
    if (!list) return;
    const pageSize = 3;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(":scope > .config-card"));
    const pageCount = Math.max(1, Math.ceil(cards.length / pageSize));
    const activePage = Math.min(configPage, pageCount);
    if (activePage !== configPage) { setConfigPage(activePage); return; }
    cards.forEach((card, index) => { card.hidden = index < (activePage - 1) * pageSize || index >= activePage * pageSize; });
    list.parentElement?.querySelector("[data-collection-config-pagination]")?.remove();
    const pager = document.createElement("div");
    pager.dataset.collectionConfigPagination = "true";
    pager.className = "collection-pagination";
    pager.innerHTML = `<span>显示 ${cards.length ? (activePage - 1) * pageSize + 1 : 0}–${Math.min(activePage * pageSize, cards.length)} 条，共 ${cards.length} 条</span><div><button type="button" data-page="prev" ${activePage === 1 ? "disabled" : ""}>‹</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${activePage === index + 1 ? "active" : ""}">${index + 1}</button>`).join("")}<button type="button" data-page="next" ${activePage === pageCount ? "disabled" : ""}>›</button></div>`;
    pager.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => button.addEventListener("click", () => {
      const target = button.dataset.page;
      setConfigPage(target === "prev" ? Math.max(1, activePage - 1) : target === "next" ? Math.min(pageCount, activePage + 1) : Number(target));
    }));
    list.insertAdjacentElement("afterend", pager);
    return () => pager.remove();
  }, [tab, configs, configPage]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const view = document.querySelector<HTMLElement>(".task-view");
    const table = view?.querySelector<HTMLElement>(".task-table table");
    if (!view || !table) return;
    const pageSize = 5;
    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const activePage = Math.min(collectionTaskPage, pageCount);
    if (activePage !== collectionTaskPage) { setCollectionTaskPage(activePage); return; }
    rows.forEach((row, index) => { row.hidden = index < (activePage - 1) * pageSize || index >= activePage * pageSize; });
    view.querySelector("[data-collection-task-pagination]")?.remove();
    const pager = document.createElement("div");
    pager.dataset.collectionTaskPagination = "true";
    pager.className = "collection-pagination";
    pager.innerHTML = `<span>显示 ${rows.length ? (activePage - 1) * pageSize + 1 : 0}–${Math.min(activePage * pageSize, rows.length)} 条，共 ${rows.length} 条</span><div><button type="button" data-page="prev" ${activePage === 1 ? "disabled" : ""}>‹</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${activePage === index + 1 ? "active" : ""}">${index + 1}</button>`).join("")}<button type="button" data-page="next" ${activePage === pageCount ? "disabled" : ""}>›</button></div>`;
    pager.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => button.addEventListener("click", () => {
      const target = button.dataset.page;
      setCollectionTaskPage(target === "prev" ? Math.max(1, activePage - 1) : target === "next" ? Math.min(pageCount, activePage + 1) : Number(target));
    }));
    view.querySelector(".task-table")?.insertAdjacentElement("afterend", pager);
    return () => pager.remove();
  }, [tab, tasks, taskFilter, collectionTaskPage]);

  useEffect(() => {
    if (!currentTask) return;
    const conditionSection = Array.from(document.querySelectorAll<HTMLElement>(".task-detail-drawer .detail-section")).find((item) => item.querySelector("h3")?.textContent === "抓取条件");
    Array.from(conditionSection?.querySelectorAll<HTMLElement>(".task-detail-grid > div") ?? []).find((item) => item.querySelector("small")?.textContent === "时间范围")?.remove();
    const conditionGrid = conditionSection?.querySelector<HTMLElement>(".task-detail-grid");
    conditionGrid?.querySelector("[data-competitor-stores-detail]")?.remove();
    if (currentTask.competitorStores?.length) {
      const storeDetail = document.createElement("div");
      storeDetail.dataset.competitorStoresDetail = "true";
      storeDetail.innerHTML = `<small>竞品店铺</small><strong>${currentTask.competitorStores.join("、")}</strong>`;
      conditionGrid?.append(storeDetail);
    }
    const section = Array.from(document.querySelectorAll<HTMLElement>(".task-detail-drawer .detail-section")).find((item) => item.querySelector("h3")?.textContent === "执行信息");
    const grid = section?.querySelector<HTMLElement>(".task-detail-grid");
    if (!grid) return;
    Array.from(grid.querySelectorAll<HTMLElement>(":scope > div")).find((detail) => detail.querySelector("small")?.textContent === "开始时间")?.remove();
    Array.from(grid.querySelectorAll<HTMLElement>(":scope > div")).find((detail) => detail.querySelector("small")?.textContent === "失败数量")?.remove();
    grid.querySelector("[data-schedule-detail]")?.remove();
    const item = document.createElement("div");
    item.dataset.scheduleDetail = "true";
    item.innerHTML = `<small>来源配置</small><strong>${currentTask.config} · ${currentTask.configId ?? "—"}</strong>`;
    grid.appendChild(item);
    [
      ["计划执行时间", currentTask.plannedAt ?? "—"],
      ["实际开始时间", currentTask.actualStartedAt ?? currentTask.start ?? "—"],
      ["结束时间", currentTask.endedAt ?? "—"],
      ["新增 / 更新数量", `${currentTask.addedCount ?? 0} / ${currentTask.updatedCount ?? 0}`],
      ["失败数量", ["待执行", "已取消"].includes(currentTask.status) ? "—" : String(currentTask.failed ?? 0)],
    ].forEach(([label, value]) => {
      const detail = document.createElement("div");
      detail.dataset.scheduleDetail = "true";
      detail.innerHTML = `<small>${label}</small><strong>${value}</strong>`;
      grid.appendChild(detail);
    });
    const drawerBody = document.querySelector<HTMLElement>(".task-detail-drawer .drawer-body");
    drawerBody?.querySelector("[data-execution-history]")?.remove();
    const executionHistory = document.createElement("section");
    executionHistory.dataset.executionHistory = "true";
    executionHistory.className = "detail-section execution-history";
    executionHistory.innerHTML = `<h3>执行记录 <small>共 ${currentTask.executionRecords?.length ?? 0} 次</small></h3><div class="execution-record-list">${(currentTask.executionRecords ?? []).map((record: { attempt: number; startedAt: string; status: string; result: string; added: number; updated: number; failed: number }) => `<article><div><strong>第 ${record.attempt} 次执行</strong><small>${record.startedAt}</small></div><span class="${record.status.includes("失败") ? "failed" : record.status === "执行中" ? "running" : ""}">${record.status}</span><p>${record.result}</p><small>新增 ${record.added} · 更新 ${record.updated}${record.failed ? ` · 失败 ${record.failed}` : ""}</small></article>`).join("")}</div>`;
    const executionSection = Array.from(drawerBody?.querySelectorAll<HTMLElement>(".detail-section") ?? []).find((section) => section.querySelector("h3")?.textContent === "执行信息");
    executionSection?.insertAdjacentElement("afterend", executionHistory);

    const taskResultSection = Array.from(drawerBody?.querySelectorAll<HTMLElement>(".detail-section") ?? []).find((item) => item.querySelector("h3")?.textContent === "任务结果");
    if (taskResultSection) {
      const notExecuted = ["待执行", "已取消"].includes(currentTask.status);
      const added = currentTask.addedCount ?? 0;
      const updated = currentTask.updatedCount ?? 0;
      const failed = currentTask.failed ?? 0;
      const resultLabel = currentTask.status.includes("失败") ? "成功处理" : "采集命中";
      taskResultSection.classList.add("task-result-section");
      taskResultSection.innerHTML = `<h3>任务结果</h3>${notExecuted
        ? `<p class="task-result-empty">${currentTask.status === "待执行" ? "任务尚未执行，暂无本次采集结果。" : "任务已在执行前取消，未产生采集结果。"}</p>`
        : `<div class="task-result-grid"><div><small>${resultLabel}</small><strong>${(added + updated).toLocaleString()}</strong></div><div><small>新增达人</small><strong>${added.toLocaleString()}</strong></div><div><small>合并更新</small><strong>${updated.toLocaleString()}</strong></div><div><small>失败数量</small><strong class="${failed ? "failed" : ""}">${failed.toLocaleString()}</strong></div></div><p class="task-result-write-note">本次成功处理的数据已实时写入达人库；后续失败、停止不会回滚。</p>`}<p class="storage-rule-note"><strong>入库规则说明</strong>达人按“平台 + 达人UID”进行唯一识别，已存在达人执行合并更新，不重复创建主档。</p>`;
    }
  }, [currentTask]);

  useEffect(() => {
    if (!currentTask?.status.includes("失败")) return;
    const button = Array.from(document.querySelectorAll<HTMLButtonElement>(".task-detail-drawer footer button")).find((item) => item.textContent === "重新执行");
    if (!button) return;
    const retryFromDetail = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      requestCollectionRerun(currentTask.id);
      setDetailTask(null);
    };
    button.addEventListener("click", retryFromDetail, true);
    return () => button.removeEventListener("click", retryFromDetail, true);
  }, [currentTask]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!modalBody) return;
    modalBody.querySelector<HTMLElement>(".collection-config-group")?.style.setProperty("display", "none");
    const amountLabel = Array.from(modalBody.querySelectorAll<HTMLElement>("label")).find((label) => label.textContent?.includes("近30天") && label.textContent?.includes("带货总额"));
    const competitorFields = modalBody.querySelector<HTMLElement>(".collection-gmv-grid");
    if (competitorFields) competitorFields.style.display = "none";
    if (configType === "直播达人") {
      setLiveGmvOperator("大于等于");
      amountLabel?.style.removeProperty("display");
      amountLabel?.classList.add("live-threshold");
    } else {
      amountLabel?.style.setProperty("display", "none");
      amountLabel?.classList.remove("live-threshold");
    }
  }, [configType, createOpen]);

  useEffect(() => {
    if (!createOpen || editingConfigId || configNameTouched) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    const nameInput = Array.from(modalBody?.querySelectorAll<HTMLLabelElement>("label") ?? []).find((label) => label.textContent?.includes("配置名称"))?.querySelector<HTMLInputElement>("input");
    if (!nameInput) return;
    const defaultName = `${configType}-新建配置`;
    nameInput.value = defaultName;
    const markTouched = () => { if (nameInput.value !== defaultName) setConfigNameTouched(true); };
    nameInput.addEventListener("input", markTouched);
    return () => nameInput.removeEventListener("input", markTouched);
  }, [configNameTouched, configType, createOpen, editingConfigId]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!modalBody) return;
    const sourceLabel = Array.from(modalBody.querySelectorAll<HTMLLabelElement>("label")).find((label) => label.textContent?.includes("数据来源"));
    const sourceSelect = sourceLabel?.querySelector<HTMLSelectElement>("select");
    if (!sourceLabel || !sourceSelect) return;
    sourceSelect.value = configSource;
    sourceLabel.querySelector(".source-independence-note")?.remove();
    const note = document.createElement("small");
    note.className = "source-independence-note";
    note.textContent = "数据来源独立选择，不随抓取类型自动固定。";
    sourceLabel.append(note);
    const onSourceChange = () => setConfigSource(sourceSelect.value);
    sourceSelect.addEventListener("change", onSourceChange);
    return () => sourceSelect.removeEventListener("change", onSourceChange);
  }, [createOpen, configSource]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!modalBody) return;
    const gmvLabel = Array.from(modalBody.querySelectorAll<HTMLLabelElement>("label")).find((label) => /近30天.*带货总额/.test(label.textContent ?? ""));
    if (!gmvLabel) return;
    const title = configType === "直播达人" ? "近30天直播带货总额" : "近30天短视频带货总额";
    const requiredTitle = gmvLabel.querySelector<HTMLElement>(":scope > .required-label");
    if (requiredTitle) {
      requiredTitle.childNodes[0].textContent = title;
    } else {
      const textNode = Array.from(gmvLabel.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.includes("近30天"));
      if (textNode) textNode.textContent = title;
    }
  }, [configType, createOpen]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!modalBody) return;
    const typeSelect = Array.from(modalBody.querySelectorAll<HTMLLabelElement>("label")).find((label) => label.textContent?.includes("抓取类型"))?.querySelector<HTMLSelectElement>("select");
    const legacyCompetitorOption = Array.from(typeSelect?.options ?? []).find((option) => option.value === "竞品直播达人");
    if (legacyCompetitorOption) { legacyCompetitorOption.value = "竞品达人"; legacyCompetitorOption.textContent = "竞品达人"; }
    modalBody.querySelector(".competitor-store-entry")?.remove();
    if (configType !== "竞品达人") return;
    const sourceLabel = Array.from(modalBody.querySelectorAll<HTMLLabelElement>("label")).find((label) => label.textContent?.includes("数据来源"));
    if (!sourceLabel) return;
    const entry = document.createElement("section");
    entry.className = "competitor-store-entry";
    entry.innerHTML = `<div class="competitor-store-entry-head"><span>竞品店铺 <i>*</i></span><small>支持一次粘贴多个店铺名称，使用换行、逗号或分号分隔</small></div><textarea placeholder="请输入竞品店铺名称，如：美的生活电器旗舰店、米家官方旗舰店">${competitorStoreText}</textarea><div class="competitor-store-entry-actions"><button type="button" data-parse-stores>解析店铺</button><span>已添加 ${competitorStores.length} 家</span></div><div class="competitor-store-chips">${competitorStores.map((store, index) => `<span>${store}<button type="button" data-remove-store="${index}" aria-label="删除${store}">×</button></span>`).join("") || `<small>尚未添加店铺</small>`}</div>`;
    const textarea = entry.querySelector<HTMLTextAreaElement>("textarea")!;
    textarea.addEventListener("input", () => setCompetitorStoreText(textarea.value));
    entry.querySelector<HTMLButtonElement>("[data-parse-stores]")?.addEventListener("click", () => {
      const next = Array.from(new Set(textarea.value.split(/\n|；|;|，|,/).map((item) => item.trim()).filter(Boolean)));
      setCompetitorStores((current) => Array.from(new Set([...current, ...next])));
      setCompetitorStoreText("");
    });
    entry.querySelectorAll<HTMLButtonElement>("[data-remove-store]").forEach((button) => button.addEventListener("click", () => setCompetitorStores((current) => current.filter((_, index) => index !== Number(button.dataset.removeStore)))));
    sourceLabel.insertAdjacentElement("afterend", entry);
    return () => entry.remove();
  }, [createOpen, competitorStoreText, competitorStores, configType]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!modalBody) return;
    modalBody.querySelectorAll<HTMLLabelElement>("label").forEach((label) => {
      if (label.querySelector(":scope > .required-label")) return;
      const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim());
      const title = textNode?.textContent?.trim();
      if (!textNode || !title) return;
      const marker = document.createElement("span");
      marker.className = "required-label";
      marker.textContent = title;
      const star = document.createElement("i");
      star.textContent = "*";
      marker.appendChild(star);
      label.replaceChild(marker, textNode);
    });
  }, [createOpen, configType]);

  useEffect(() => {
    if (!createOpen) return;
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    const frequencyLabel = Array.from(modalBody?.querySelectorAll<HTMLLabelElement>("label") ?? []).find((label) => label.textContent?.includes("执行频率"));
    const select = frequencyLabel?.querySelector<HTMLSelectElement>("select");
    if (!frequencyLabel || !select) return;
    select.value = frequency;
    const onChange = () => setFrequency(select.value as typeof frequency);
    select.addEventListener("change", onChange);
    let editor = modalBody?.querySelector<HTMLElement>(".schedule-editor");
    if (!editor) {
      editor = document.createElement("div");
      editor.className = "schedule-editor";
      frequencyLabel.insertAdjacentElement("afterend", editor);
    }
    if (frequency === "手动执行") {
      editor.replaceChildren();
    } else if (frequency === "每日执行") {
      editor.innerHTML = `<p>每日执行时间 <small>可添加多个时间点</small></p><div class="schedule-time-list">${dailyTimes.map((time, index) => `<div><input type="time" value="${time}" data-time-index="${index}" /><button type="button" data-remove-time="${index}" ${dailyTimes.length === 1 ? "disabled" : ""}>移除</button></div>`).join("")}<button type="button" class="schedule-add" data-add-time>＋ 添加执行时间</button></div>`;
      editor.querySelectorAll<HTMLInputElement>("[data-time-index]").forEach((input) => input.addEventListener("change", () => setDailyTimes((current) => current.map((time, index) => index === Number(input.dataset.timeIndex) ? input.value : time))));
      editor.querySelectorAll<HTMLButtonElement>("[data-remove-time]").forEach((button) => button.addEventListener("click", () => setDailyTimes((current) => current.filter((_, index) => index !== Number(button.dataset.removeTime)))));
      editor.querySelector<HTMLButtonElement>("[data-add-time]")?.addEventListener("click", () => setDailyTimes((current) => [...current, "18:00"]));
    } else {
      editor.innerHTML = `<p>每周执行安排 <small>可为不同日期分别设置时间</small></p><div class="schedule-time-list">${weeklySchedules.map((item, index) => `<div><select data-weekday-index="${index}">${["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((day) => `<option ${item.day === day ? "selected" : ""}>${day}</option>`).join("")}</select><input type="time" value="${item.time}" data-week-time-index="${index}" /><button type="button" data-remove-week="${index}" ${weeklySchedules.length === 1 ? "disabled" : ""}>移除</button></div>`).join("")}<button type="button" class="schedule-add" data-add-week>＋ 添加执行安排</button></div>`;
      editor.querySelectorAll<HTMLSelectElement>("[data-weekday-index]").forEach((input) => input.addEventListener("change", () => setWeeklySchedules((current) => current.map((item, index) => index === Number(input.dataset.weekdayIndex) ? { ...item, day: input.value } : item))));
      editor.querySelectorAll<HTMLInputElement>("[data-week-time-index]").forEach((input) => input.addEventListener("change", () => setWeeklySchedules((current) => current.map((item, index) => index === Number(input.dataset.weekTimeIndex) ? { ...item, time: input.value } : item))));
      editor.querySelectorAll<HTMLButtonElement>("[data-remove-week]").forEach((button) => button.addEventListener("click", () => setWeeklySchedules((current) => current.filter((_, index) => index !== Number(button.dataset.removeWeek)))));
      editor.querySelector<HTMLButtonElement>("[data-add-week]")?.addEventListener("click", () => setWeeklySchedules((current) => [...current, { day: "周三", time: "09:00" }]));
    }
    return () => select.removeEventListener("change", onChange);
  }, [createOpen, frequency, dailyTimes, weeklySchedules]);

  function openConfigEditor(config: typeof configs[number]) {
    setEditingConfigId(config.id);
    setConfigNameTouched(true);
    setConfigType(config.type as typeof configType);
    setTimeRange(config.timeRange);
    setCompetitorStores(config.competitorStores ?? []);
    setCompetitorStoreText("");
    const parseGmv = (value: string) => value.startsWith("≥")
      ? { operator: "大于等于" as const, amount: value.replace(/[^0-9.]/g, "") }
      : { operator: "不限" as const, amount: "" };
    const videoGmv = parseGmv(config.videoGmv);
    const liveGmv = parseGmv(config.liveGmv);
    setVideoGmvOperator(videoGmv.operator);
    setVideoGmvValue(videoGmv.amount);
    setLiveGmvOperator(liveGmv.operator);
    setLiveGmvValue(liveGmv.amount);
    const weeklyMatches = Array.from(config.frequency.matchAll(/(周[一二三四五六日])\s+(\d{2}:\d{2})/g)).map((match) => ({ day: match[1], time: match[2] }));
    const dailyMatches = Array.from(config.frequency.matchAll(/\d{2}:\d{2}/g));
    if (weeklyMatches.length) {
      setFrequency("每周执行");
      setWeeklySchedules(weeklyMatches);
    } else if (config.frequency.startsWith("每日") && dailyMatches.length) {
      setFrequency("每日执行");
      setDailyTimes(dailyMatches);
    } else {
      setFrequency("手动执行");
    }
    setCreateOpen(true);
  }

  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".config-card .config-actions button")).filter((button) => button.textContent === "编辑");
    const handlers = buttons.map((button) => {
      const handler = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        const name = button.closest<HTMLElement>(".config-card")?.querySelector(".config-main h2")?.textContent;
        const config = configs.find((item) => item.name === name);
        if (config) openConfigEditor(config);
      };
      button.addEventListener("click", handler, true);
      return { button, handler };
    });
    return () => handlers.forEach(({ button, handler }) => button.removeEventListener("click", handler, true));
  }, [configs]);

  useEffect(() => {
    if (!createOpen || !editingConfigId) return;
    const config = configs.find((item) => item.id === editingConfigId);
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    if (!config || !modalBody) return;
    const labels = Array.from(modalBody.querySelectorAll<HTMLLabelElement>("label"));
    const nameInput = labels.find((label) => label.textContent?.includes("配置名称"))?.querySelector<HTMLInputElement>("input");
    const sourceSelect = labels.find((label) => label.textContent?.includes("数据来源"))?.querySelector<HTMLSelectElement>("select");
    if (nameInput) nameInput.value = config.name;
    if (sourceSelect) sourceSelect.value = config.source;
    setConfigSource(config.source);
  }, [createOpen, editingConfigId, configs]);

  function toggleConfig(id: string) {
    const item = configs.find((config) => config.id === id);
    if (!item) return;
    const isDisabling = item.status === "启用";
    setConfigs((current) => current.map((config) => config.id === id ? { ...config, status: isDisabling ? "停用" : "启用" } : config));
    if (isDisabling) {
      const pendingCount = tasks.filter((task) => task.configId === id && task.status === "待执行").length;
      // 停用配置仅阻止后续调度，并取消尚未执行的实例；运行中的任务必须由任务级“停止”单独处理。
      setTasks((current) => current.map((task) => task.configId === id && task.status === "待执行" ? { ...task, status: "已取消", actualStartedAt: "—", addedCount: 0, updatedCount: 0, failed: 0, result: "来源配置已停用，待执行任务自动取消，未产生抓取结果" } : task));
      notify(`${item.name}已停用${pendingCount ? `，已取消 ${pendingCount} 条待执行任务` : "，后续不再生成自动任务"}`, "success");
      return;
    }
    notify(`${item.name}已启用，后续将按执行计划生成新任务`, "success");
  }

  function runConfig(configId: string) {
    const config = configs.find((item) => item.id === configId);
    if (!config) return;
    // “立即执行”只创建一条新的任务实例，不修改配置，也不复用配置上的执行结果。
    // 抓取不等待整条任务结束：每个成功批次立刻按“平台 + 达人UID”写入或合并更新达人主档。
    const task = { id: `CT20260818${String(tasks.length + 27).padStart(3, "0")}`, configId: config.id, type: config.type, config: config.name, source: config.source, plannedAt: "今天 10:35（立即执行）", actualStartedAt: "刚刚", start: "刚刚", result: "正在获取达人数据，已实时写入首批结果", addedCount: 72, updatedCount: 164, failed: 0, status: "执行中", executionRecords: [{ attempt: 1, plannedAt: "今天 10:35（立即执行）", startedAt: "刚刚", status: "执行中", result: "正在获取达人数据，已实时写入首批结果", added: 72, updated: 164, failed: 0 }], timeRange: config.timeRange, creatorTypes: config.creatorTypes, creatorType: config.creatorTypes.join("、"), videoGmv: config.videoGmv, liveGmv: config.liveGmv, frequency: config.frequency, competitorStores: config.competitorStores };
    ingestCollectionResults(task);
    setTasks((current) => [task, ...current]);
    setTab("tasks");
    notify("抓取任务已创建，命中更高优先级类型时将迁移达人归属并覆盖采集信息", "success");
  }

  function requestCollectionRerun(taskId: string) {
    setRerunConfirmTaskId(taskId);
  }

  function retryCollectionTask(taskId: string) {
    const sourceTask = tasks.find((task) => task.id === taskId);
    if (sourceTask) ingestCollectionResults(sourceTask);
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const attempt = (task.executionRecords?.length ?? 0) + 1;
      // 重跑会再次完整抓取；已存在的达人走合并更新，之前任一次已成功写入的数据不会回滚。
      const record = { attempt, plannedAt: "重新执行", startedAt: "刚刚", status: "执行中", result: "已重新发起完整抓取，成功数据将实时写入或合并更新", added: 0, updated: 0, failed: 0 };
      return { ...task, status: "执行中", failed: 0, actualStartedAt: "刚刚", endedAt: "—", start: "刚刚", result: record.result, addedCount: 0, updatedCount: 0, executionRecords: [...(task.executionRecords ?? []), record] };
    }));
    setRerunConfirmTaskId(null);
    notify("已按原任务配置重新完整执行；此前成功数据保留，再次命中将合并更新", "success");
  }

  function startCollectionTask(taskId: string) {
    // 进入执行中即模拟首批成功结果入库，之后停止或部分失败都只影响未处理数据，不撤回这里的成功结果。
    const sourceTask = tasks.find((task) => task.id === taskId);
    if (sourceTask) ingestCollectionResults(sourceTask);
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const records = task.executionRecords ?? [];
      const last = records[records.length - 1];
      const isRestart = task.status === "已停止";
      const attempt = records.reduce((max, record) => Math.max(max, record.attempt), 0) + (isRestart ? 1 : 0);
      const nextRecord = { attempt: isRestart ? attempt : (last?.attempt ?? 1), plannedAt: last?.plannedAt ?? task.start, startedAt: "刚刚", status: "执行中", result: "已提前执行，首批结果已实时写入达人库", added: 68, updated: 142, failed: 0 };
      // 首次执行只推进第1条计划记录；停止后重新启动则追加新的执行次数，旧记录不变。
      const nextRecords = isRestart || !last ? [...records, nextRecord] : [...records.slice(0, -1), nextRecord];
      return { ...task, status: "执行中", actualStartedAt: "刚刚", endedAt: "—", start: "刚刚", result: nextRecord.result, addedCount: 68, updatedCount: 142, executionRecords: nextRecords };
    }));
    notify("已提前执行抓取任务，正在同步执行状态", "success");
  }

  function stopCollectionTask(taskId: string) {
    if (tasks.find((task) => task.id === taskId)?.status !== "执行中") { notify("只有执行中的任务可以停止", "warning"); return; }
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const records = task.executionRecords ?? [];
      const last = records[records.length - 1];
      const stoppedRecord = { ...(last ?? { attempt: 1, plannedAt: task.start, startedAt: "刚刚", added: task.addedCount ?? 0, updated: task.updatedCount ?? 0, failed: task.failed ?? 0 }), status: "已停止", result: "执行中被主管停止，已成功处理的数据保留", added: task.addedCount ?? last?.added ?? 0, updated: task.updatedCount ?? last?.updated ?? 0 };
      return { ...task, status: "已停止", endedAt: "刚刚", result: stoppedRecord.result, executionRecords: [...records, stoppedRecord] };
    }));
    notify("抓取任务已停止；停止前成功处理的数据已保留在达人库", "success");
  }

  function cancelCollectionTask(taskId: string) {
    if (tasks.find((task) => task.id === taskId)?.status !== "待执行") { notify("只有待执行任务可以取消", "warning"); return; }
    setTasks((current) => current.map((task) => {
      if (task.id !== taskId) return task;
      const records = task.executionRecords ?? [];
      const last = records[records.length - 1];
      const cancelledRecord = { ...(last ?? { attempt: 1, plannedAt: task.start, startedAt: "—" }), status: "已取消", result: "任务在开始执行前已取消，未产生抓取结果", added: 0, updated: 0, failed: 0 };
      return { ...task, status: "已取消", actualStartedAt: "—", addedCount: 0, updatedCount: 0, failed: 0, result: cancelledRecord.result, executionRecords: [...records, cancelledRecord] };
    }));
    notify("待执行抓取任务已取消，未产生任何抓取结果", "success");
  }

  function createConfig() {
    if (configType === "竞品达人" && competitorStores.length === 0) { notify("请至少添加一家竞品店铺", "warning"); return; }
    const savedTimeRange = timeRange === "自定义" && customStart && customEnd ? `${customStart} 至 ${customEnd}` : timeRange;
    const formatGmv = (operator: "不限" | "大于等于", value: string) => operator === "大于等于" && value ? `≥ ${value}万` : "不限";
    const selectedCreatorTypes = [configType];
    const scheduleText = frequency === "每日执行" ? `每日 ${dailyTimes.join("、")}` : frequency === "每周执行" ? `每周 ${weeklySchedules.map((item) => `${item.day} ${item.time}`).join("、")}` : "手动执行";
    const modalBody = document.querySelector<HTMLElement>(".collection-modal-body");
    const name = Array.from(modalBody?.querySelectorAll<HTMLLabelElement>("label") ?? []).find((label) => label.textContent?.includes("配置名称"))?.querySelector<HTMLInputElement>("input")?.value || `${configType}·新建配置`;
    const source = Array.from(modalBody?.querySelectorAll<HTMLLabelElement>("label") ?? []).find((label) => label.textContent?.includes("数据来源"))?.querySelector<HTMLSelectElement>("select")?.value || configSource;
    const next = { id: editingConfigId ?? `PC20260800${configs.length + 4}`, name, type: configType, source, scope: selectedCreatorTypes.join("、"), frequency: scheduleText, lastRun: editingConfigId ? configs.find((item) => item.id === editingConfigId)?.lastRun ?? "暂未执行" : "暂未执行", status: editingConfigId ? configs.find((item) => item.id === editingConfigId)?.status ?? "启用" : "启用", timeRange: savedTimeRange, creatorTypes: selectedCreatorTypes, creatorType: selectedCreatorTypes.join("、"), videoGmv: configType === "直播达人" ? "不限" : formatGmv(videoGmvOperator, videoGmvValue), liveGmv: configType === "直播达人" ? formatGmv(liveGmvOperator, liveGmvValue) : "不限" };
    const nextWithStores = { ...next, competitorStores: configType === "竞品达人" ? competitorStores : [] };
    setConfigs((current) => editingConfigId ? current.map((item) => item.id === editingConfigId ? nextWithStores : item) : [nextWithStores, ...current]);
    setCreateOpen(false);
    setEditingConfigId(null);
    notify(editingConfigId ? "采集配置已更新" : "采集配置已创建", "success");
  }

  useEffect(() => {
    document.getElementById("collection-rerun-confirm")?.remove();
    const task = tasks.find((item) => item.id === rerunConfirmTaskId);
    if (!task) return;
    const overlay = document.createElement("div");
    overlay.id = "collection-rerun-confirm";
    overlay.className = "modal-overlay collection-rerun-confirm";
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-label="确认重新执行"><header><div><small>重新执行抓取任务</small><h2>${task.id}</h2><p>保留原任务编号，并新增一次执行记录。</p></div><button type="button" data-close aria-label="关闭">×</button></header><div class="rerun-confirm-body"><div><span>i</span><p><strong>重新执行将根据当前任务配置重新进行完整抓取，本次不是仅重试失败数据。</strong><br/>系统按“平台 + 达人UID”合并：已命中的达人会更新，不会重复创建达人主档。</p></div><dl><dt>来源配置</dt><dd>${task.config} · ${task.configId ?? "—"}</dd><dt>抓取条件</dt><dd>${task.creatorType} · ${task.creatorType === "直播达人" ? task.liveGmv : task.videoGmv}</dd></dl></div><footer><button type="button" data-close>取消</button><button type="button" class="primary-button" data-confirm>确认完整重新执行</button></footer></section>`;
    const close = () => setRerunConfirmTaskId(null);
    overlay.querySelectorAll<HTMLButtonElement>("[data-close]").forEach((button) => button.onclick = close);
    overlay.querySelector<HTMLButtonElement>("[data-confirm]")?.addEventListener("click", () => retryCollectionTask(task.id));
    overlay.addEventListener("mousedown", (event) => { if (event.target === overlay) close(); });
    document.body.append(overlay);
    return () => overlay.remove();
  }, [rerunConfirmTaskId, tasks]);

  return <>
    <header className="page-header collection-head"><div><h1>达人采集</h1><p>管理抓取配置与执行任务，将外部达人数据持续沉淀到达人库。</p></div><div className="header-actions"><button className="primary-button" onClick={() => { setEditingConfigId(null); setConfigNameTouched(false); setCreateOpen(true); }}>＋ 新建采集配置</button></div></header>
    <section className="collection-stat-grid"><article><span className="collection-stat-icon violet">配</span><div><small>启用中的配置</small><strong>{configs.filter((config) => config.status === "启用").length}</strong><em>覆盖 3 类达人采集</em></div></article><article><span className="collection-stat-icon cyan">今</span><div><small>今日抓取达人</small><strong>3,589</strong><em>新增 1,183 · 更新 2,406</em></div></article><article><span className="collection-stat-icon orange">异</span><div><small>待处理异常</small><strong>{tasks.filter((task) => task.status.includes("失败")).length}</strong><em>建议优先检查数据源</em></div></article></section>
    <section className="panel collection-panel"><div className="collection-tabs"><div className="tabs"><button className={tab === "configs" ? "active" : ""} onClick={() => setTab("configs")}>抓取配置 <span>{configs.length}</span></button><button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>抓取任务 <span>{tasks.length}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>
      {tab === "configs" ? <div className="config-list">{configs.map((config) => <article className="config-card" key={config.id}><div className={`config-type type-${config.type.includes("直播") ? "live" : config.type.includes("竞品") ? "competitor" : "video"}`}>{config.type === "短视频达人" ? "短" : config.type === "直播达人" ? "播" : "竞"}</div><div className="config-main"><div><h2>{config.name}</h2><span className={`config-status ${config.status === "启用" ? "on" : "off"}`}>{config.status}</span></div><p><span>{config.source}</span><i>·</i>{config.scope}</p><div className="collection-condition-list"><span>类型：<strong>{config.creatorType}</strong></span><span>时间：<strong>{config.timeRange}</strong></span><span>{config.creatorType === "直播达人" ? "近30天直播带货总额" : "近30天短视频带货总额"}：<strong>{config.creatorType === "直播达人" ? config.liveGmv : config.videoGmv}</strong></span></div><div className="config-meta"><span>执行频率：<strong>{config.frequency}</strong></span><span>最近执行：<strong>{config.lastRun}</strong></span></div></div><div className="config-actions"><button onClick={() => notify(`已打开 ${config.name} 的配置编辑页`)}>编辑</button><button onClick={() => runConfig(config.id)} disabled={config.status === "停用"}>立即执行</button><button className={config.status === "启用" ? "danger" : ""} onClick={() => toggleConfig(config.id)}>{config.status === "启用" ? "停用" : "启用"}</button></div></article>)}</div> : <div className="task-view"><div className="task-filter"><div>{["全部", "待执行", "执行中", "已完成", "部分失败", "执行失败"].map((status) => <button key={status} className={taskFilter === status ? "active" : ""} onClick={() => setTaskFilter(status)}>{status}{status === "全部" ? ` ${tasks.length}` : ""}</button>)}</div><button onClick={() => notify("任务列表已刷新", "success")}>↻ 刷新</button></div><div className="table-wrap task-table"><table><thead><tr><th>任务编号</th><th>抓取类型</th><th>使用配置</th><th>数据来源</th><th>时间范围</th><th>达人类型</th><th>近30天带货总额</th><th>开始时间</th><th>抓取结果</th><th>失败数</th><th>状态</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><button className="table-link" onClick={() => setDetailTask(task.id)}>{task.id}</button></td><td>{task.type}</td><td><strong>{task.config}</strong></td><td><span className="source-tag">{task.source}</span></td><td>{task.timeRange}</td><td>{task.creatorType}</td><td>{task.creatorType === "直播达人" ? task.liveGmv : task.videoGmv}</td><td>{task.start}</td><td>{task.result}</td><td>{task.failed ? <span className="task-failed-count">{task.failed}</span> : "—"}</td><td><span className={`task-status ${task.status.includes("失败") ? "failed" : task.status === "执行中" ? "running" : "success"}`}>{task.status}</span></td><td><button className="row-action" onClick={() => setDetailTask(task.id)}>查看</button></td></tr>)}</tbody></table></div>{!visibleTasks.length && <div className="library-empty"><span>✓</span><strong>当前没有此状态的抓取任务</strong><small>任务执行后会在这里显示</small></div>}</div>}
    </section>
    {createOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="collection-modal" role="dialog" aria-modal="true" aria-labelledby="collection-title"><header><div><small>新建采集配置</small><h2 id="collection-title">配置要抓取的达人数据</h2><p>抓取负责数据进入达人库，业务筛选在达人库内完成。</p></div><button onClick={() => setCreateOpen(false)} aria-label="关闭">×</button></header><div className="collection-modal-body"><label>抓取类型<select value={configType} onChange={(event) => { const nextType = event.target.value as typeof configType; setConfigType(nextType); setCreatorTypes(nextType === "直播达人" ? ["直播达人"] : ["视频达人"]); }}><option>短视频达人</option><option>直播达人</option><option>竞品直播达人</option></select></label><label>配置名称<input defaultValue={`${configType}·新建配置`} /></label><label>数据来源<select><option>{configType === "直播达人" ? "精选联盟" : "蝉妈妈"}</option><option>精选联盟</option><option>蝉妈妈</option></select></label><div className="collection-config-group"><span className="collection-config-label">时间范围</span><div className="collection-choice-row"><button type="button" className={timeRange === "近1个月" ? "active" : ""} onClick={() => setTimeRange("近1个月")}>近1个月</button><button type="button" className={timeRange === "近7天" ? "active" : ""} onClick={() => setTimeRange("近7天")}>近7天</button><button type="button" className={timeRange === "近3个月" ? "active" : ""} onClick={() => setTimeRange("近3个月")}>近3个月</button><button type="button" className={timeRange === "自定义" ? "active" : ""} onClick={() => setTimeRange("自定义")}>自定义</button></div>{timeRange === "自定义" && <div className="collection-date-row"><input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} aria-label="开始日期" /><span>至</span><input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} aria-label="结束日期" /></div>}</div>{configType === "直播达人" ? <label>近30天直播带货总额<div className="collection-gmv-input"><select value={liveGmvOperator} onChange={(event) => setLiveGmvOperator(event.target.value as typeof liveGmvOperator)}><option>不限</option><option>大于等于</option></select>{liveGmvOperator === "大于等于" && <input value={liveGmvValue} onChange={(event) => setLiveGmvValue(event.target.value)} placeholder="填写金额，如 25" inputMode="decimal" />}<span>万</span></div></label> : <label>近30天短视频带货总额<div className="collection-gmv-input"><select value={videoGmvOperator} onChange={(event) => setVideoGmvOperator(event.target.value as typeof videoGmvOperator)}><option>不限</option><option>大于等于</option></select>{videoGmvOperator === "大于等于" && <input value={videoGmvValue} onChange={(event) => setVideoGmvValue(event.target.value)} placeholder="填写金额，如 10" inputMode="decimal" />}<span>万</span></div></label>}{configType === "竞品直播达人" && <div className="collection-gmv-grid"><label>我方商品<select><option>请选择商品</option><option>创维循环扇</option><option>小熊破壁机</option></select></label><label>竞品商品<input placeholder="输入竞品商品ID、链接或平台标识" /></label></div>}<label>执行频率<select><option>手动执行</option><option>每日执行</option><option>每周执行</option></select></label></div><footer><button className="ghost-button" onClick={() => setCreateOpen(false)}>取消</button><button className="primary-button" onClick={createConfig}>确认创建</button></footer></section></div>}
    {currentTask && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailTask(null); }}><aside className="task-detail-drawer" role="dialog" aria-modal="true" aria-label="抓取任务详情"><header><div><small>抓取任务详情</small><h2>{currentTask.id}</h2><p>{currentTask.type} · {currentTask.config}</p></div><button onClick={() => setDetailTask(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className={`task-result-hero ${currentTask.status.includes("失败") ? "failed" : currentTask.status === "执行中" ? "running" : "success"}`}><span>{currentTask.status === "执行中" ? "◌" : currentTask.status.includes("失败") ? "!" : "✓"}</span><div><strong>{currentTask.status}</strong><small>{currentTask.result}</small></div></div><section className="detail-section"><h3>抓取条件</h3><div className="task-detail-grid"><div><small>时间范围</small><strong>{currentTask.timeRange}</strong></div><div><small>达人类型</small><strong>{currentTask.creatorType}</strong></div><div><small>{currentTask.creatorType === "直播达人" ? "近30天直播带货总额" : "近30天短视频带货总额"}</small><strong>{currentTask.creatorType === "直播达人" ? currentTask.liveGmv : currentTask.videoGmv}</strong></div></div></section><section className="detail-section"><h3>执行信息</h3><div className="task-detail-grid"><div><small>数据来源</small><strong>{currentTask.source}</strong></div><div><small>开始时间</small><strong>{currentTask.start}</strong></div><div><small>失败数量</small><strong>{currentTask.failed || "0"}</strong></div><div><small>使用配置</small><strong>{currentTask.config}</strong></div></div></section>{currentTask.failed > 0 && <section className="detail-section"><h3>失败原因</h3><div className="failure-box"><strong>部分数据解析失败</strong><p>32 条达人数据缺少稳定UID或字段格式不符合当前采集规则。可查看失败明细后重试。</p><button onClick={() => notify("失败明细已导出", "success")}>导出失败明细</button></div></section>}<section className="detail-section"><h3>任务结果</h3><p>抓取结果会根据“平台 + 达人UID”与已有达人主档匹配；命中相同达人时更新动态数据，不重复创建达人。</p></section></div><footer><button className="ghost-button" onClick={() => setDetailTask(null)}>关闭</button>{currentTask.status.includes("失败") && <button className="primary-button" onClick={() => { setDetailTask(null); notify("已创建重试任务", "success"); }}>重新执行</button>}</footer></aside></div>}
  </>;
}

function ContactManagement({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [view, setView] = useState<"tasks" | "batches">("tasks");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [contactTaskPage, setContactTaskPage] = useState(1);
  const [batchPage, setBatchPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDetailId, setBatchDetailId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importReady, setImportReady] = useState(false);
  const [importValidated, setImportValidated] = useState(false);
  const [importHistoryOpen, setImportHistoryOpen] = useState(false);
  const [importExceptionsOpen, setImportExceptionsOpen] = useState(false);
  const [importRecordId, setImportRecordId] = useState<string | null>(null);

  const [importRecords, setImportRecords] = useState([{ id: "IR20260818001", file: "商务回填表 · FP20260818007.xlsx", batch: "FP20260818007", operator: "陈旭光", importedAt: "2026-08-18 17:32", total: 120, updated: 115, success: 115, skipped: 5, unchanged: 20, status: "已完成" }]);
  const importExceptions = [{ id: "EX20260818001", file: "商务回填表 · FP20260818007.xlsx", batch: "FP20260818007", count: 5, reason: "2 条缺少建联任务编号，3 条状态字段格式异常", status: "待处理" }];
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [statusUpdater, setStatusUpdater] = useState("");
  const [statusOccurredAt, setStatusOccurredAt] = useState("");
  const [statusNext, setStatusNext] = useState("");
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [statusConfirmation, setStatusConfirmation] = useState<{ updater: string; occurredAt: string; nextStatus: string; note: string; reason: string } | null>(null);
  const [statusUpdates, setStatusUpdates] = useState<Record<string, { status: string; updater: string; occurredAt: string; note: string; reason?: string }>>({});
  const [tasks, setTasks] = useState([
    { id: "BL202608180321", creator: "小家电研究所", uid: "dy_86541972", avatar: "blue", product: "创维循环扇", owner: "陈小雨", batch: "FP20260818007", added: "是", agreed: "否", replied: "否", intent: "否", status: "已添加待同意", updated: "今天 10:12" },
    { id: "BL202608180320", creator: "洁净生活家", uid: "dy_10376294", avatar: "pink", product: "创维循环扇", owner: "陈小雨", batch: "FP20260818007", added: "是", agreed: "是", replied: "是", intent: "是", status: "已达成合作意向", updated: "今天 09:58" },
    { id: "BL202608180319", creator: "懒人厨房", uid: "dy_59724081", avatar: "orange", product: "小熊破壁机", owner: "林晓婷", batch: "FP20260818006", added: "是", agreed: "是", replied: "否", intent: "否", status: "已同意待回复", updated: "今天 09:43" },
    { id: "BL202608180318", creator: "暖暖的居家日记", uid: "dy_31562099", avatar: "yellow", product: "小熊破壁机", owner: "林晓婷", batch: "FP20260818006", added: "否", agreed: "否", replied: "否", intent: "否", status: "待添加", updated: "今天 09:21" },
    { id: "BL202608170287", creator: "家居好物直播间", uid: "dy_77510684", avatar: "purple", product: "苏泊尔空气炸锅", owner: "张文豪", batch: "FP20260817012", added: "是", agreed: "是", replied: "是", intent: "否", status: "沟通中", updated: "昨天 18:36" },
    { id: "BL202608170286", creator: "阿阳测评", uid: "dy_42917835", avatar: "green", product: "苏泊尔空气炸锅", owner: "张文豪", batch: "FP20260817012", added: "是", agreed: "否", replied: "否", intent: "否", status: "未达成", updated: "昨天 16:18" },
  ]);
  const batches = [
    { id: "FP20260818007", product: "创维循环扇", owner: "陈小雨", type: "短视频达人", count: 120, added: 86, agreed: 48, replied: 31, intent: 12, unreached: 20, created: "今天 09:15" },
    { id: "FP20260818006", product: "小熊破壁机", owner: "林晓婷", type: "短视频达人", count: 80, added: 72, agreed: 42, replied: 28, intent: 9, unreached: 12, created: "今天 08:42" },
    { id: "FP20260817012", product: "苏泊尔空气炸锅", owner: "张文豪", type: "直播达人", count: 150, added: 146, agreed: 91, replied: 63, intent: 21, unreached: 18, created: "昨天 16:05" },
  ];
  batches.forEach((batch) => { delete (batch as typeof batch & { product?: string }).product; });
  const statusTabs = ["全部", "待添加", "已添加待同意", "已同意待回复", "沟通中", "已达成合作意向", "未达成"];
  const visibleTasks = tasks.filter((task) => statusFilter === "全部" || task.status === statusFilter);
  const detail = tasks.find((task) => task.id === detailId) ?? null;

  const batchDetail = batches.find((batch) => batch.id === batchDetailId) ?? null;
  const importRecord = importRecords.find((record) => record.id === importRecordId) ?? null;
  const allSelected = visibleTasks.length > 0 && visibleTasks.every((task) => selected.includes(task.id));
  const statusTimeMax = new Date().toISOString().slice(0, 16);

  useEffect(() => {
    const syncSharedTasks = () => {
      setTasks((current) => {
        const existing = new Set(current.map((task) => task.id));
        const additions = sharedOutreachTasks.filter((task) => !existing.has(task.taskId)).map((task) => ({ id: task.taskId, creator: task.creatorId, uid: task.creatorId, avatar: "blue", owner: task.owner, batch: task.batchId, added: "否", agreed: "否", replied: "否", intent: "否", status: task.processStage ?? "已分配", updated: task.updatedAt }));
        return additions.length ? [...additions, ...current] : current;
      });
    };
    window.addEventListener("outreach-tasks-updated", syncSharedTasks);
    syncSharedTasks();
    return () => window.removeEventListener("outreach-tasks-updated", syncSharedTasks);
  }, []);

  useEffect(() => {
    setTasks((current) => current.map((task) => {
      const sanitized = { ...task } as typeof task & { product?: string; productId?: string };
      delete sanitized.product;
      delete sanitized.productId;
      return sanitized;
    }));
  }, []);

  useEffect(() => { setContactTaskPage(1); }, [statusFilter, tasks.length]);
  useEffect(() => { if (view === "batches") setBatchPage(1); }, [view]);

  useEffect(() => {
    if (view !== "tasks") return;
    const total = document.querySelector<HTMLElement>(".contact-toolbar > span");
    if (total) total.innerHTML = `共 <strong>${visibleTasks.length}</strong> 条任务`;
  }, [view, visibleTasks.length]);

  useEffect(() => {
    if (!importRecord) return;
    const drawer = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='导入记录详情']");
    if (!drawer) return;
    const info = Array.from(drawer.querySelectorAll<HTMLElement>(".detail-section")).find((section) => section.querySelector("h3")?.textContent === "导入信息");
    const grid = info?.querySelector<HTMLElement>(".task-detail-grid");
    grid?.querySelector("[data-import-stats]")?.remove();
    if (grid) {
      const stats = document.createElement("div");
      stats.dataset.importStats = "true";
      stats.innerHTML = `<small>导入结果</small><strong>成功更新 ${importRecord.success ?? importRecord.updated} · 异常跳过 ${importRecord.skipped ?? 0} · 无变化 ${importRecord.unchanged ?? 0}</strong>`;
      grid.append(stats);
    }
    const result = Array.from(drawer.querySelectorAll<HTMLElement>(".detail-section")).find((section) => section.querySelector("h3")?.textContent === "回写结果");
    if (result) result.innerHTML = `<h3>导入结果统计</h3><div class="import-result-summary"><div><small>总人数</small><strong>${importRecord.total}</strong></div><div><small>成功更新</small><strong class="success">${importRecord.success ?? importRecord.updated}</strong></div><div><small>异常跳过</small><strong class="warning">${importRecord.skipped ?? 0}</strong></div><div><small>无变化</small><strong>${importRecord.unchanged ?? 0}</strong></div></div><div class="import-outcome-detail"><p><strong>成功记录</strong>${importRecord.success ?? importRecord.updated} 条已按任务编号完成状态更新。</p><p><strong>异常记录</strong>${importRecord.skipped ?? 0} 条已跳过，未影响成功数据。</p><p><strong>异常原因</strong>任务编号缺失、无法匹配或状态字段格式异常。</p></div><p>正常数据已覆盖更新；异常数据已进入异常记录，后续可单独核查。</p>`;
  }, [importRecord]);

  useEffect(() => {
    if (!importHistoryOpen) return;
    const records = Array.from(document.querySelectorAll<HTMLElement>(".import-record-list > button"));
    records.forEach((button, index) => {
      const record = importRecords[index];
      if (!record) return;
      button.querySelector("[data-import-record-meta]")?.remove();
      const meta = document.createElement("div");
      meta.dataset.importRecordMeta = "true";
      meta.className = "import-record-meta";
      meta.innerHTML = `<span>批次 ${record.batch}</span><span>总 ${record.total}</span><span class="success">成功 ${record.success ?? record.updated}</span><span class="warning">异常 ${record.skipped ?? 0}</span><span>无变化 ${record.unchanged ?? 0}</span>`;
      button.querySelector("div")?.append(meta);
    });
  }, [importHistoryOpen, importRecords]);

  useEffect(() => {
    if (!importOpen) { setImportValidated(false); return; }
    const modal = document.querySelector<HTMLElement>(".import-modal");
    const action = modal?.querySelector<HTMLButtonElement>("footer .primary-button");
    const body = modal?.querySelector<HTMLElement>(".import-modal-body");
    if (!modal || !action || !body) return;
    action.textContent = importValidated ? "确认导入" : "解析并校验";
    body.querySelector("[data-import-validation-preview]")?.remove();
    if (importReady) {
      const preview = document.createElement("div");
      preview.dataset.importValidationPreview = "true";
      preview.className = `import-validation-preview ${importValidated ? "validated" : ""}`;
      preview.innerHTML = `<h3>${importValidated ? "校验结果" : "待校验数据"}</h3><div><span>总数据<strong>120</strong></span><span>可更新<strong class="success">115</strong></span><span>异常<strong class="warning">5</strong></span><span>无变化<strong>20</strong></span></div><p>${importValidated ? "校验完成，请确认后更新建联状态。异常数据将跳过，不影响正常数据。" : "点击“解析并校验”后查看导入数据检查结果。"}</p>`;
      body.insertBefore(preview, body.querySelector(".import-fields"));
    }
    if (importValidated || !importReady) return;
    const intercept = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      setImportValidated(true);
      notify("Excel 已解析，校验结果已生成，请确认导入", "success");
    };
    action.addEventListener("click", intercept, true);
    return () => action.removeEventListener("click", intercept, true);
  }, [importOpen, importReady, importValidated]);

  useEffect(() => {
    const tableSelector = view === "tasks" ? ".contact-table table" : ".batch-table table";
    const table = document.querySelector<HTMLElement>(tableSelector);
    if (!table) return;
    const pageSize = view === "tasks" ? 5 : 2;
    const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const currentPage = view === "tasks" ? contactTaskPage : batchPage;
    const setPage = view === "tasks" ? setContactTaskPage : setBatchPage;
    const activePage = Math.min(currentPage, pageCount);
    if (activePage !== currentPage) { setPage(activePage); return; }
    rows.forEach((row, index) => { row.hidden = index < (activePage - 1) * pageSize || index >= activePage * pageSize; });
    const panel = table.closest<HTMLElement>(".contact-panel");
    panel?.querySelector("[data-contact-pagination]")?.remove();
    const pager = document.createElement("div");
    pager.dataset.contactPagination = "true";
    pager.className = "collection-pagination contact-pagination";
    pager.innerHTML = `<span>显示 ${rows.length ? (activePage - 1) * pageSize + 1 : 0}–${Math.min(activePage * pageSize, rows.length)} 条，共 ${rows.length} 条</span><div><button type="button" data-page="prev" ${activePage === 1 ? "disabled" : ""}>‹</button>${Array.from({ length: pageCount }, (_, index) => `<button type="button" data-page="${index + 1}" class="${activePage === index + 1 ? "active" : ""}">${index + 1}</button>`).join("")}<button type="button" data-page="next" ${activePage === pageCount ? "disabled" : ""}>›</button></div>`;
    pager.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => button.addEventListener("click", () => {
      const target = button.dataset.page;
      setPage(target === "prev" ? Math.max(1, activePage - 1) : target === "next" ? Math.min(pageCount, activePage + 1) : Number(target));
    }));
    table.closest<HTMLElement>(".table-wrap")?.insertAdjacentElement("afterend", pager);
    return () => pager.remove();
  }, [view, visibleTasks, batches, contactTaskPage, batchPage]);

  useEffect(() => {
    const pageDescription = document.querySelector<HTMLElement>(".contact-head p");
    if (pageDescription) pageDescription.textContent = "围绕“达人 × 商务”管理建联任务、分配批次和跟进状态。";
    if (view !== "tasks") return;
    const searchInput = document.querySelector<HTMLInputElement>(".contact-filter-row input");
    if (searchInput) searchInput.placeholder = "搜索达人、商务或任务编号";
    const toolbar = document.querySelector<HTMLElement>(".contact-toolbar");
    document.querySelectorAll<HTMLElement>(".contact-panel .contact-master-note:not(.detail)").forEach((item) => item.remove());
    if (!toolbar) return;
    const note = document.createElement("p");
    note.className = "contact-master-note";
    note.innerHTML = "<span>i</span> 建联任务按达人主档创建。同一达人来自短视频、直播或多个竞品店铺时，仅保留一条建联任务与一条流转状态。";
    toolbar.insertAdjacentElement("afterend", note);
  }, [view]);

  useEffect(() => {
    if (view !== "tasks") return;
    const importButton = document.querySelector<HTMLButtonElement>(".contact-import-action .primary-button");
    const searchActions = document.querySelector<HTMLDivElement>(".contact-filter-row > div:last-child");
    const originalParent = importButton?.parentElement;
    if (importButton && searchActions && originalParent !== searchActions) {
      searchActions.append(importButton);
      return () => { if (importButton.parentElement !== originalParent) originalParent?.append(importButton); };
    }
  }, [view]);

  // 建联分配以“达人 × 商务 × 批次”为主，不在任务与批次视图重复展示商品信息。
  useEffect(() => {
    const removeColumnByName = (selector: string, label: string) => {
      const table = document.querySelector<HTMLElement>(`${selector} table`);
      const header = Array.from(table?.querySelectorAll<HTMLTableCellElement>("thead th") ?? []).find((cell) => cell.textContent === label);
      const index = header ? Array.from(header.parentElement?.children ?? []).indexOf(header) : -1;
      if (index >= 0) table?.querySelectorAll<HTMLTableRowElement>("tr").forEach((row) => row.children[index]?.remove());
    };
    if (view === "tasks") removeColumnByName(".contact-table", "推广商品");
    if (view === "batches") removeColumnByName(".batch-table", "推广商品");

    const removeDetailField = (label: string) => document.querySelectorAll<HTMLElement>(`.contact-detail-drawer[aria-label="${label}"] .task-detail-grid > div`).forEach((item) => {
      if (item.querySelector("small")?.textContent === "推广商品") item.remove();
    });
    if (detail) {
      const headerText = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='建联任务详情'] header p");
      if (headerText) headerText.textContent = `${detail.id} · ${detail.owner}`;
      removeDetailField("建联任务详情");
    }
    if (batchDetail) {
      const headerText = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='分配批次详情'] header p");
      if (headerText) headerText.textContent = `负责商务 · ${batchDetail.owner}`;
      removeDetailField("分配批次详情");
    }
    document.querySelectorAll<HTMLElement>(".batch-modal-body > label").forEach((item) => {
      if (item.childNodes[0]?.textContent === "推广商品") item.remove();
    });
  }, [batchDetail, batchOpen, detail, view]);

  useEffect(() => {
    if (view !== "tasks") return;
    const table = document.querySelector<HTMLElement>(".contact-table table");
    const checkboxHeader = Array.from(table?.querySelectorAll<HTMLTableCellElement>("thead th") ?? []).find((cell) => Boolean(cell.querySelector("input[type=checkbox]")));
    const checkboxIndex = checkboxHeader ? Array.from(checkboxHeader.parentElement?.children ?? []).indexOf(checkboxHeader) : -1;
    if (checkboxIndex >= 0) table?.querySelectorAll<HTMLTableRowElement>("tr").forEach((row) => row.children[checkboxIndex]?.remove());
    document.querySelector<HTMLElement>(".contact-toolbar > label")?.remove();
  }, [view, visibleTasks.length, contactTaskPage]);

  useEffect(() => {
    if (view !== "batches") return;
    const batchTable = document.querySelector<HTMLTableElement>(".batch-table table");
    const batchToolbar = document.querySelector<HTMLDivElement>(".batch-toolbar");
    if (!batchTable || !batchToolbar) return;
    const exportButton = batchToolbar.querySelector<HTMLButtonElement>("button");
    if (exportButton) {
      exportButton.textContent = "⇧ 导入商务回填表";
      exportButton.className = "primary-button batch-import-button";
      exportButton.onclick = () => setImportOpen(true);
    }
    if (!batchToolbar.querySelector(".batch-import-history")) {
      const historyButton = document.createElement("button");
      historyButton.className = "batch-import-history";
      historyButton.textContent = "导入记录";
      historyButton.onclick = () => setImportHistoryOpen(true);
      batchToolbar.append(historyButton);
    }
    batchTable.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row) => {
      const batchId = row.querySelector<HTMLButtonElement>(".table-link")?.textContent;
      const actionCell = row.querySelector<HTMLTableCellElement>("td:last-child");
      if (!batchId || !actionCell || actionCell.querySelector(".batch-export-action")) return;
      const exportAction = document.createElement("button");
      exportAction.className = "row-action batch-export-action";
      exportAction.textContent = "导出回填表";
      exportAction.onclick = () => notify(`已导出 ${batchId} 的商务建联回填表`, "success");
      actionCell.append(exportAction);
      actionCell.querySelector<HTMLButtonElement>(".row-action:not(.batch-export-action)")?.addEventListener("click", () => setBatchDetailId(batchId));
    });
  }, [view, notify]);

  useEffect(() => {
    if (!batchDetail) return;
    const drawer = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='分配批次详情'] .drawer-body");
    const progressSection = Array.from(drawer?.querySelectorAll<HTMLElement>(":scope > .detail-section") ?? []).find((section) => section.querySelector("h3")?.textContent === "建联进度");
    if (!drawer || !progressSection) return;

    drawer.querySelector("[data-batch-funnel]")?.remove();
    const pendingCount = batchDetail.count - batchDetail.added;
    const funnel = document.createElement("section");
    funnel.dataset.batchFunnel = "true";
    funnel.className = "detail-section batch-funnel-section";
    funnel.innerHTML = `<h3>建联进度漏斗</h3><div class="batch-funnel"><div class="batch-funnel-step"><strong>${batchDetail.count}</strong><span>总人数</span></div><i>↓</i><div class="batch-funnel-step"><strong>${batchDetail.added}</strong><span>已添加</span></div><i>↓</i><div class="batch-funnel-step"><strong>${batchDetail.agreed}</strong><span>已同意</span></div><i>↓</i><div class="batch-funnel-step"><strong>${batchDetail.replied}</strong><span>已回复</span></div><i>↓</i><div class="batch-funnel-step emphasis"><strong>${batchDetail.intent}</strong><span>达成合作意向</span></div></div><div class="batch-funnel-outcomes"><div><small>未达成</small><strong>${batchDetail.unreached ?? 0}</strong></div><div><small>待跟进</small><strong>${pendingCount}</strong></div></div>`;
    drawer.querySelector(".batch-detail-hero")?.insertAdjacentElement("afterend", funnel);

    const names = ["小家电研究所", "洁净生活家", "懒人厨房", "暖暖的居家日记", "家居好物直播间", "阿阳测评", "乐妈家居直播", "收纳研究员", "极简生活实验室", "小鹿的家", "家电观察员", "居家好物笔记"];
    const unreachedCount = batchDetail.unreached ?? 0;
    const members = Array.from({ length: batchDetail.count }, (_, index) => {
      const rank = index + 1;
      const status = rank <= batchDetail.intent ? "达成意向" : rank <= batchDetail.replied ? "已回复" : rank <= batchDetail.agreed ? "已同意" : rank <= batchDetail.added ? "已添加" : "待添加";
      return { name: rank <= names.length ? names[rank - 1] : `${batchDetail.type.replace("达人", "")}达人 ${String(rank).padStart(3, "0")}`, uid: `dy_${String(86541972 + rank * 173).padStart(8, "0")}`, status, finalResult: rank > batchDetail.count - unreachedCount ? "未达成" : undefined, updated: status === "待添加" ? "等待商务处理" : `今天 ${String(8 + (rank % 10)).padStart(2, "0")}:${String(10 + (rank * 7) % 50).padStart(2, "0")}` };
    });
    const counts: Record<string, number> = { "全部": batchDetail.count, "待添加": batchDetail.count - batchDetail.added, "已添加": batchDetail.added, "已同意": batchDetail.agreed, "已回复": batchDetail.replied, "达成意向": batchDetail.intent, "未达成": unreachedCount };
    let activeFilter = "全部";
    let currentPage = 1;
    const pageSize = 10;
    drawer.querySelector(".batch-member-list")?.remove();
    const listSection = document.createElement("section");
    listSection.className = "detail-section batch-member-list";

    const renderMembers = () => {
      const filtered = activeFilter === "全部" ? members : activeFilter === "未达成" ? members.filter((member) => member.finalResult === "未达成") : members.filter((member) => member.status === activeFilter);
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      currentPage = Math.min(currentPage, totalPages);
      const displayed = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      listSection.innerHTML = `<h3>${activeFilter === "全部" ? "批次内达人" : `${activeFilter}达人`}</h3><p>共 ${filtered.length} 位达人${activeFilter === "全部" ? "，已完整纳入本批次" : "，来自当前进度状态"}。</p><div class="batch-member-filters">${Object.entries(counts).map(([label, count]) => `<button type="button" data-batch-member-filter="${label}" class="${activeFilter === label ? "active" : ""}">${label} <strong>${count}</strong></button>`).join("")}</div><div class="batch-member-table"><div class="batch-member-head"><span>达人</span><span>达人UID</span><span>当前进度</span><span>最终结果</span><span>最近更新</span></div>${displayed.map((member) => `<div class="batch-member-row"><strong>${member.name}</strong><code>${member.uid}</code><span class="batch-member-status ${member.status === "达成意向" ? "success" : member.status === "待添加" ? "pending" : ""}">${member.status}</span><span class="batch-member-final ${member.finalResult === "未达成" ? "failed" : ""}">${member.finalResult ?? "—"}</span><small>${member.updated}</small></div>`).join("")}</div><div class="batch-member-pagination"><span>显示 ${filtered.length ? (currentPage - 1) * pageSize + 1 : 0}–${Math.min(currentPage * pageSize, filtered.length)} 位，共 ${filtered.length} 位</span><div><button type="button" data-batch-member-page="prev" ${currentPage === 1 ? "disabled" : ""}>‹</button><b>${currentPage} / ${totalPages}</b><button type="button" data-batch-member-page="next" ${currentPage === totalPages ? "disabled" : ""}>›</button></div></div>`;
      listSection.querySelectorAll<HTMLButtonElement>("[data-batch-member-filter]").forEach((button) => button.onclick = () => { activeFilter = button.dataset.batchMemberFilter ?? "全部"; currentPage = 1; renderMembers(); });
      listSection.querySelector<HTMLButtonElement>("[data-batch-member-page='prev']")?.addEventListener("click", () => { currentPage--; renderMembers(); });
      listSection.querySelector<HTMLButtonElement>("[data-batch-member-page='next']")?.addEventListener("click", () => { currentPage++; renderMembers(); });
    };
    const progressList = progressSection.querySelector<HTMLElement>(".batch-progress-list");
    if (progressList && !progressList.querySelector("[data-unreached-progress]")) {
      const item = document.createElement("div");
      item.dataset.unreachedProgress = "true";
      item.innerHTML = `<span>未达成</span><strong>${unreachedCount} / ${batchDetail.count}</strong>`;
      progressList.append(item);
    }
    progressSection.querySelectorAll<HTMLElement>(".batch-progress-list > div").forEach((item) => {
      const label = item.querySelector("span")?.textContent ?? "";
      item.classList.add("batch-progress-drilldown");
      item.title = `查看${label}达人`;
      item.onclick = () => { activeFilter = label; currentPage = 1; renderMembers(); listSection.scrollIntoView({ behavior: "smooth", block: "start" }); };
      const value = item.querySelector("strong");
      if (value && !item.querySelector("button")) value.insertAdjacentHTML("afterend", "<button type=\"button\">查看</button>");
    });
    renderMembers();
    progressSection.after(listSection);
    return () => listSection.remove();
  }, [batchDetail]);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(".contact-stat-grid article");
    const cardData = [
      { className: "flow-export", label: "待导出回填表", value: "2", description: "2 个批次等待下发给商务", action: "去导出", onClick: () => { setView("batches"); notify("请在批次操作列逐批导出回填表"); } },
      { className: "flow-collect", label: "已下发待跟进", value: "3", description: "其中 17 条任务已超 3 天未更新", action: "查看超时", onClick: () => { setStatusFilter("全部"); setView("tasks"); notify("已筛选需关注任务"); } },
      { className: "flow-import", label: "导入异常待处理", value: String(importExceptions.length), description: `${importExceptions.length} 份已上传回填表存在字段校验异常`, action: "查看异常", onClick: () => setImportExceptionsOpen(true) },
      { className: "flow-result", label: "本周达成意向", value: "89", description: "较上周提升 4.8%，可进入合作准备" },
    ];
    cards.forEach((card, index) => {
      const item = cardData[index];
      if (!item) return;
      card.className = item.className;
      card.innerHTML = `<small>${item.label}</small><strong>${item.value}</strong><span>${item.description}</span>${item.action ? `<button type="button">${item.action}</button>` : ""}`;
      const button = card.querySelector<HTMLButtonElement>("button");
      if (button && item.onClick) button.onclick = item.onClick;
      if (item.className === "flow-import" && item.onClick) {
        const count = card.querySelector<HTMLElement>("strong");
        if (count) {
          count.setAttribute("role", "button");
          count.tabIndex = 0;
          count.title = "点击查看导入异常列表";
          count.onclick = item.onClick;
          count.onkeydown = (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); item.onClick?.(); } };
        }
      }
    });
  });

  function openStatusUpdate() {
    document.querySelector<HTMLElement>(".inline-status-update")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function saveInlineStatusUpdate(updater: string, occurredAt: string, nextStatus: string, note: string, reason = "") {
    if (!detail || !updater.trim() || !occurredAt || !nextStatus) return notify("请完整填写状态更新信息", "warning");
    if (new Date(occurredAt).getTime() > Date.now()) return notify("更新时间不能晚于当前时间", "warning");
    setStatusConfirmation({ updater, occurredAt, nextStatus, note, reason });
  }

  function commitStatusUpdate(payload: { updater: string; occurredAt: string; nextStatus: string; note: string; reason: string }) {
    if (!detail) return;
    const stageValues: Record<string, Pick<typeof tasks[number], "added" | "agreed" | "replied" | "intent">> = {
      "待添加": { added: "否", agreed: "否", replied: "否", intent: "否" }, "已添加待同意": { added: "是", agreed: "否", replied: "否", intent: "否" }, "已同意待回复": { added: "是", agreed: "是", replied: "否", intent: "否" }, "沟通中": { added: "是", agreed: "是", replied: "是", intent: "否" }, "已达成合作意向": { added: "是", agreed: "是", replied: "是", intent: "是" }, "未达成": { added: "是", agreed: "否", replied: "否", intent: "否" },
    };
    setTasks((current) => current.map((task) => task.id === detail.id ? { ...task, ...stageValues[payload.nextStatus], status: payload.nextStatus, updated: payload.occurredAt.replace("T", " ") } : task));
    setStatusUpdates((current) => ({ ...current, [detail.id]: { status: payload.nextStatus, updater: payload.updater, occurredAt: payload.occurredAt.replace("T", " "), note: payload.note, reason: payload.reason } }));
    publishSharedOutreachTasks(sharedOutreachTasks.map((task) => task.taskId === detail.id ? { ...task, processStage: ["已添加待同意", "已同意待回复", "沟通中"].includes(payload.nextStatus) ? ({ "已添加待同意": "已添加", "已同意待回复": "已同意", "沟通中": "已回复" } as Record<string, OutreachProcessStage>)[payload.nextStatus] : task.processStage, finalResult: payload.nextStatus === "已达成合作意向" ? "达成意向" : payload.nextStatus === "未达成" ? "未达成" : undefined, updatedAt: payload.occurredAt.replace("T", " ") } : task));
    setStatusConfirmation(null);
    setStatusUpdateOpen(false);
    notify(`已由 ${payload.updater} 更新建联状态`, "success");
  }

  function saveStatusUpdate() {
    if (!detail || !statusUpdater.trim() || !statusOccurredAt || !statusNext) return notify("请完整填写状态更新信息", "warning");
    if (new Date(statusOccurredAt).getTime() > Date.now()) return notify("更新时间不能晚于当前时间", "warning");
    setStatusConfirmation({ updater: statusUpdater, occurredAt: statusOccurredAt, nextStatus: statusNext, note: statusUpdateNote, reason: "" });
  }

  useEffect(() => {
    if (!detail) return;
    const updateButton = document.querySelector<HTMLButtonElement>(".contact-detail-drawer > footer .primary-button");
    updateButton?.remove();
  }, [detail, statusTimeMax]);

  useEffect(() => {
    if (!detail) return;
    const infoSection = Array.from(document.querySelectorAll<HTMLElement>(".contact-detail-drawer .detail-section")).find((section) => section.querySelector("h3")?.textContent === "任务信息");
    if (!infoSection || infoSection.querySelector(".contact-master-note")) return;
    const note = document.createElement("p");
    note.className = "contact-master-note detail";
    note.innerHTML = "<span>i</span> 此任务关联唯一达人主档；后续新增采集来源不会重复创建建联任务。";
    infoSection.append(note);
  }, [detail]);

  useEffect(() => {
    if (!detail) return;
    const drawer = document.querySelector<HTMLElement>(".contact-detail-drawer .drawer-body");
    const sections = drawer?.querySelectorAll<HTMLElement>(":scope > .detail-section");
    if (!drawer || !sections?.[0]) return;
    drawer.querySelector(".inline-status-update")?.remove();
    const panel = document.createElement("section");
    panel.className = "detail-section inline-status-update";
    panel.innerHTML = `<h3>更新建联状态</h3><p>按实际发生时间补录或更正状态；更新记录会保留更新人、时间与备注。</p><form><label>更新后状态<select name="status"><option>待添加</option><option>已添加待同意</option><option>已同意待回复</option><option>沟通中</option><option>已达成合作意向</option><option>未达成</option></select></label><div><label>状态更新人<input name="updater" value="${detail.owner}" /></label><label>状态发生时间<input name="occurredAt" type="datetime-local" value="${statusTimeMax}" max="${statusTimeMax}" /></label></div><label>更新备注<textarea name="note" placeholder="选填，记录来源、沟通结论或更正原因"></textarea></label><button class="primary-button" type="submit">确认更新状态</button></form>`;
    const reasonLabel = document.createElement("label");
    reasonLabel.innerHTML = `<span>未达成原因</span><select name="reason"><option>未通过好友申请</option><option>长时间未回复</option><option>明确拒绝合作</option><option>合作条件不匹配</option><option>暂无合作意愿</option><option>其他</option></select>`;
    panel.querySelector("textarea[name=note]")?.closest("label")?.insertAdjacentElement("beforebegin", reasonLabel);
    const statusSelect = panel.querySelector<HTMLSelectElement>("select[name=status]");
    if (statusSelect) statusSelect.value = detail.status;
    panel.querySelector<HTMLFormElement>("form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      saveInlineStatusUpdate(String(form.get("updater") ?? ""), String(form.get("occurredAt") ?? ""), String(form.get("status") ?? ""), String(form.get("note") ?? ""), String(form.get("reason") ?? ""));
    });
    sections[0].after(panel);
    return () => panel.remove();
  }, [detail, statusTimeMax]);

  useEffect(() => {
    if (!detail || !statusUpdates[detail.id]) return;
    const timeline = document.querySelector<HTMLElement>(".contact-detail-drawer .contact-timeline");
    if (!timeline) return;
    timeline.querySelector(".manual-status-update")?.remove();
    const record = statusUpdates[detail.id];
    const entry = document.createElement("div");
    entry.className = "manual-status-update";
    entry.innerHTML = `<span>更新为${record.status}</span><small>${record.occurredAt} · ${record.updater}${record.note ? ` · ${record.note}` : ""}</small>`;
    timeline.append(entry);
  }, [detail, statusUpdates]);

  useEffect(() => {
    if (!detail) return;
    const drawer = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='建联任务详情'] .drawer-body");
    if (!drawer) return;
    drawer.querySelector("[data-unreached-detail]")?.remove();
    if (detail.status !== "未达成") return;
    const update = statusUpdates[detail.id];
    const section = document.createElement("section");
    section.dataset.unreachedDetail = "true";
    section.className = "detail-section unreached-detail-section";
    section.innerHTML = `<h3>未达成信息</h3><div class="task-detail-grid"><div><small>未达成原因</small><strong>${update?.reason || "明确拒绝合作"}</strong></div><div><small>商务备注</small><strong>${update?.note || "暂无备注"}</strong></div></div>`;
    drawer.querySelector(".contact-note")?.insertAdjacentElement("beforebegin", section);
  }, [detail, statusUpdates]);

  useEffect(() => {
    if (!detail) return;
    const timeline = document.querySelector<HTMLElement>(".contact-detail-drawer[aria-label='建联任务详情'] .contact-timeline");
    if (!timeline) return;
    const events: Array<{ name: string; operator: string; time: string; note: string }> = [{ name: "创建任务", operator: "陈旭光", time: "今天 08:42", note: "系统创建建联任务" }];
    if (detail.added === "是") events.push({ name: "已添加待同意", operator: detail.owner, time: detail.updated, note: "已发送好友申请" });
    if (detail.agreed === "是") events.push({ name: "已同意待回复", operator: detail.owner, time: detail.updated, note: "达人已通过好友申请" });
    if (detail.replied === "是") events.push({ name: "沟通中", operator: detail.owner, time: detail.updated, note: "已收到达人回复" });
    const manual = statusUpdates[detail.id];
    if (manual) events.push({ name: `更新为${manual.status}`, operator: manual.updater, time: manual.occurredAt, note: manual.note || manual.reason || "手动更新建联状态" });
    if (detail.status === "未达成" && !manual) events.push({ name: "未达成", operator: detail.owner, time: detail.updated, note: "明确拒绝合作" });
    timeline.innerHTML = events.map((event) => `<div><span>${event.name}</span><small>操作人：${event.operator}<br/>时间：${event.time}<br/>备注：${event.note}</small></div>`).join("");
  }, [detail, statusUpdates]);

  function toggleAll() { setSelected((current) => allSelected ? current.filter((id) => !visibleTasks.some((task) => task.id === id)) : Array.from(new Set([...current, ...visibleTasks.map((task) => task.id)]))); }
  function advanceTask(id: string) {
    setTasks((current) => current.map((task) => {
      if (task.id !== id) return task;
      if (task.status === "待添加") return { ...task, added: "是", status: "已添加待同意", updated: "刚刚" };
      if (task.status === "已添加待同意") return { ...task, agreed: "是", status: "已同意待回复", updated: "刚刚" };
      if (task.status === "已同意待回复") return { ...task, replied: "是", status: "沟通中", updated: "刚刚" };
      if (task.status === "沟通中") return { ...task, intent: "是", status: "已达成合作意向", updated: "刚刚" };
      return task;
    }));
    notify("建联状态已更新", "success");
  }
  function applyImportedStatuses() {
    setTasks((current) => current.map((task, index) => index === 0 ? { ...task, added: "是", agreed: "是", replied: "是", intent: "否", status: "沟通中", updated: "刚刚" } : index === 3 ? { ...task, added: "是", agreed: "是", replied: "否", intent: "否", status: "已同意待回复", updated: "刚刚" } : task));
    setImportOpen(false);
    setImportReady(false);
    setImportValidated(false);
    setImportRecords((current) => [{ id: "IR20260819001", file: "商务回填表 · FP20260818007.xlsx", batch: "FP20260818007", operator: "陈旭光", importedAt: "刚刚", total: 120, updated: 115, success: 115, skipped: 5, unchanged: 20, status: "已完成" }, ...current]);
    notify("导入完成：成功更新 115 条，异常跳过 5 条，无变化 20 条", "success");
  }

  return <>
    <div className="contact-import-action"><div><strong>批量更新状态</strong><small>导出给商务填写状态后，在此导入并统一回写</small></div><button className="primary-button" onClick={() => setImportOpen(true)}>⇧ 导入商务回填表</button></div>
    <header className="page-header contact-head"><div><h1>建联管理</h1><p>围绕“达人 × 商品 × 商务”管理建联任务、分配批次和跟进状态。</p></div></header>
    <section className="contact-stat-grid"><article><small>待添加</small><strong>{tasks.filter((task) => task.status === "待添加").length + 126}</strong><span>需要尽快分发给商务</span></article><article><small>已回复沟通中</small><strong>{tasks.filter((task) => ["沟通中", "已同意待回复"].includes(task.status)).length + 284}</strong><span>建议持续跟进合作意向</span></article><article><small>本周达成意向</small><strong>89</strong><span>较上周提升 4.8%</span></article><article className="contact-attention"><small>超过3天未更新</small><strong>17</strong><button onClick={() => { setStatusFilter("全部"); setView("tasks"); notify("已筛选需关注任务"); }}>查看</button></article></section>
    <section className="panel contact-panel"><div className="contact-tabs"><div className="tabs"><button className={view === "tasks" ? "active" : ""} onClick={() => setView("tasks")}>建联任务 <span>2,486</span></button><button className={view === "batches" ? "active" : ""} onClick={() => setView("batches")}>分配批次 <span>{batches.length}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>{view === "tasks" ? <><div className="contact-filter-row"><div>{statusTabs.map((status) => <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><div><input placeholder="搜索达人、商品、商务或任务编号" /><button onClick={() => notify("更多筛选会在下一轮完善")}>⌘ 筛选</button></div></div><div className="contact-toolbar"><label><input type="checkbox" checked={allSelected} onChange={toggleAll} /> 全选当前结果</label><span>共 <strong>{visibleTasks.length}</strong> 条演示任务</span><button onClick={() => selected.length ? notify(`已为 ${selected.length} 条任务打开批量更新`, "success") : notify("请先选择任务", "warning")}>批量更新状态</button></div><div className="table-wrap contact-table"><table><thead><tr><th><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="全选" /></th><th>建联任务编号</th><th>达人</th><th>推广商品</th><th>负责商务</th><th>所属批次</th><th>是否添加</th><th>是否同意</th><th>是否回复</th><th>合作意向</th><th>当前状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><input type="checkbox" checked={selected.includes(task.id)} onChange={() => setSelected((current) => current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])} aria-label={`选择${task.creator}`} /></td><td><button className="table-link" onClick={() => setDetailId(task.id)}>{task.id}</button></td><td><div className="creator-cell compact"><span className={`creator-avatar ${task.avatar}`}>{task.creator.slice(0, 1)}</span><div><strong>{task.creator}</strong><small>{task.uid}</small></div></div></td><td>{task.product}</td><td>{task.owner}</td><td><button className="batch-link" onClick={() => { setView("batches"); notify(`已定位批次 ${task.batch}`); }}>{task.batch}</button></td><td><StatusDot value={task.added} /></td><td><StatusDot value={task.agreed} /></td><td><StatusDot value={task.replied} /></td><td><StatusDot value={task.intent} /></td><td><span className={`contact-status ${task.status === "已达成合作意向" ? "success" : task.status === "未达成" ? "failed" : ""}`}>{task.status}</span></td><td><span className="update-time">{task.updated}</span></td><td><button className="row-action" onClick={() => setDetailId(task.id)}>查看</button></td></tr>)}</tbody></table></div></> : <div className="batch-view"><div className="batch-toolbar"><span>按批次查看商务分配与整体建联进度</span><button onClick={() => notify("批次数据已导出", "success")}>⇩ 导出批次明细</button></div><div className="table-wrap batch-table"><table><thead><tr><th>分配批次</th><th>推广商品</th><th>负责商务</th><th>达人类型</th><th>达人数量</th><th>已添加</th><th>已同意</th><th>已回复</th><th>达成意向</th><th>创建时间</th><th>操作</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.id}><td><button className="table-link" onClick={() => notify(`已打开 ${batch.id} 的批次详情`)}>{batch.id}</button></td><td><strong>{batch.product}</strong></td><td>{batch.owner}</td><td>{batch.type}</td><td>{batch.count}</td><td>{batch.added}</td><td>{batch.agreed}</td><td>{batch.replied}</td><td><strong>{batch.intent}</strong></td><td>{batch.created}</td><td><button className="row-action" onClick={() => notify(`已打开 ${batch.id} 的批次详情`)}>查看</button></td></tr>)}</tbody></table></div></div>}</section>
    {detail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="建联任务详情"><header><div><small>建联任务详情</small><h2>{detail.creator}</h2><p>{detail.id} · {detail.product} · {detail.owner}</p></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="contact-state-line"><span className={detail.added === "是" ? "done" : ""}>已添加</span><i /> <span className={detail.agreed === "是" ? "done" : ""}>已同意</span><i /> <span className={detail.replied === "是" ? "done" : ""}>已回复</span><i /> <span className={detail.intent === "是" ? "done" : ""}>达成意向</span></div><section className="detail-section"><h3>任务信息</h3><div className="task-detail-grid"><div><small>推广商品</small><strong>{detail.product}</strong></div><div><small>负责商务</small><strong>{detail.owner}</strong></div><div><small>所属批次</small><strong>{detail.batch}</strong></div><div><small>当前状态</small><strong>{detail.status}</strong></div></div></section><section className="detail-section"><h3>状态记录</h3><div className="contact-timeline"><div><span>创建任务</span><small>今天 08:42 · 陈旭光</small></div>{detail.added === "是" && <div><span>已添加微信</span><small>{detail.updated} · {detail.owner}</small></div>}{detail.agreed === "是" && <div><span>达人已同意</span><small>{detail.updated} · {detail.owner}</small></div>}{detail.replied === "是" && <div><span>达人已回复</span><small>{detail.updated} · {detail.owner}</small></div>}</div></section><label className="contact-note">建联备注<textarea placeholder="记录本次沟通的关键内容" /></label></div><footer><button className="ghost-button" onClick={() => setDetailId(null)}>关闭</button>{!["已达成合作意向", "未达成"].includes(detail.status) && <button className="primary-button" onClick={() => advanceTask(detail.id)}>推进到下一状态</button>}</footer></aside></div>}
    {batchOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBatchOpen(false); }}><section className="batch-modal" role="dialog" aria-modal="true" aria-labelledby="batch-title"><header><div><small>创建分配批次</small><h2 id="batch-title">从达人库选择并分配达人</h2><p>支持向无系统登录权限的商务人员分配任务。</p></div><button onClick={() => setBatchOpen(false)} aria-label="关闭">×</button></header><div className="batch-modal-body"><div className="batch-select-summary"><span>0</span><div><strong>暂未选择达人</strong><small>请先从达人库批量选择达人，再进入此流程。</small></div><button onClick={() => { setBatchOpen(false); notify("已进入达人库"); }}>去达人库选择</button></div><label>推广商品<select><option>请选择推广商品</option><option>创维循环扇</option><option>小熊破壁机</option></select></label><label>负责商务<select><option>请选择负责商务</option><option>陈小雨</option><option>林晓婷</option><option>张文豪</option></select></label><label>备注<textarea placeholder="可选，填写本次分配说明" /></label></div><footer><button className="ghost-button" onClick={() => setBatchOpen(false)}>取消</button><button className="primary-button" onClick={() => notify("请先从达人库选择达人", "warning")}>确认创建</button></footer></section></div>}
    {importOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportOpen(false); }}><section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="status-import-title"><header><div><small>批量更新建联状态</small><h2 id="status-import-title">导入商务回填表</h2><p>按任务编号匹配，统一更新是否添加、是否同意、是否回复和合作意向。</p></div><button onClick={() => setImportOpen(false)} aria-label="关闭">×</button></header><div className="import-modal-body"><div className="upload-zone"><span>⇧</span><strong>{importReady ? "商务回填表 · FP20260818007.xlsx" : "选择商务已回填的导出表"}</strong><small>{importReady ? "识别到 120 条记录，其中 2 条状态有变化" : "支持 .xlsx、.csv；必须保留建联任务编号和四个状态列"}</small><button onClick={() => setImportReady(true)}>{importReady ? "已选择" : "选择回填表"}</button></div><div className="import-fields"><h3>系统回写字段</h3><span>建联任务编号</span><span>是否添加</span><span>是否同意</span><span>是否回复</span><span>合作意向</span><span>商务备注</span></div></div><footer><button className="ghost-button" onClick={() => setImportOpen(false)}>取消</button><button className="primary-button" disabled={!importReady} onClick={applyImportedStatuses}>校验并更新状态</button></footer></section></div>}
    {batchDetail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBatchDetailId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="分配批次详情"><header><div><small>分配批次详情</small><h2>{batchDetail.id}</h2><p>{batchDetail.product} · {batchDetail.owner}</p></div><button onClick={() => setBatchDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="batch-detail-hero"><strong>共 {batchDetail.count} 位达人</strong><small>批量分配给 {batchDetail.owner} · {batchDetail.created}</small></div><section className="detail-section"><h3>批次信息</h3><div className="task-detail-grid"><div><small>推广商品</small><strong>{batchDetail.product}</strong></div><div><small>达人类型</small><strong>{batchDetail.type}</strong></div><div><small>负责商务</small><strong>{batchDetail.owner}</strong></div><div><small>创建时间</small><strong>{batchDetail.created}</strong></div></div></section><section className="detail-section"><h3>建联进度</h3><div className="batch-progress-list"><div><span>已添加</span><strong>{batchDetail.added} / {batchDetail.count}</strong></div><div><span>已同意</span><strong>{batchDetail.agreed} / {batchDetail.count}</strong></div><div><span>已回复</span><strong>{batchDetail.replied} / {batchDetail.count}</strong></div><div><span>达成意向</span><strong>{batchDetail.intent} / {batchDetail.count}</strong></div></div></section><section className="detail-section"><h3>业务操作</h3><p>主管导出本批次回填表后发送给商务；商务维护状态，收集后再导入回写达人与批次进度。</p><button className="primary-button" onClick={() => notify(`已导出 ${batchDetail.id} 的商务建联回填表`, "success")}>⇩ 导出本批次回填表</button></section></div><footer><button className="ghost-button" onClick={() => setBatchDetailId(null)}>关闭</button><button className="primary-button" onClick={() => { setBatchDetailId(null); setImportOpen(true); }}>导入商务回填表</button></footer></aside></div>}
    {importExceptionsOpen && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportExceptionsOpen(false); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="导入异常列表"><header><div><small>商务回填导入</small><h2>导入异常列表</h2><p>集中查看待处理的异常文件与校验原因</p></div><button onClick={() => setImportExceptionsOpen(false)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="import-exception-list">{importExceptions.map((exception) => <article key={exception.id}><div className="import-exception-head"><strong>{exception.file}</strong><span className="import-exception-status">{exception.status}</span></div><dl><div><dt>关联批次</dt><dd>{exception.batch}</dd></div><div><dt>异常数量</dt><dd className="warning">{exception.count}</dd></div><div><dt>异常原因</dt><dd>{exception.reason}</dd></div></dl><button className="row-action" type="button" onClick={() => { setImportExceptionsOpen(false); setImportHistoryOpen(true); notify(`已定位异常文件 ${exception.file}`); }}>查看关联导入记录</button></article>)}</div></div><footer><button className="ghost-button" onClick={() => setImportExceptionsOpen(false)}>关闭</button><button className="primary-button" onClick={() => { setImportExceptionsOpen(false); setImportOpen(true); }}>导入新回填表</button></footer></aside></div>}
    {importHistoryOpen && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportHistoryOpen(false); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="商务回填导入记录"><header><div><small>商务回填导入</small><h2>导入记录</h2><p>保留每次回填表的校验与回写结果</p></div><button onClick={() => setImportHistoryOpen(false)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="import-record-list">{importRecords.map((record) => <button key={record.id} onClick={() => setImportRecordId(record.id)}><div><strong>{record.file}</strong><small>{record.id} · {record.importedAt} · {record.operator}</small></div><span>{record.status}</span><i>›</i></button>)}</div></div><footer><button className="ghost-button" onClick={() => setImportHistoryOpen(false)}>关闭</button><button className="primary-button" onClick={() => { setImportHistoryOpen(false); setImportOpen(true); }}>导入新回填表</button></footer></aside></div>}
    {importRecord && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportRecordId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="导入记录详情"><header><div><small>导入记录详情</small><h2>{importRecord.id}</h2><p>{importRecord.file}</p></div><button onClick={() => setImportRecordId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="batch-detail-hero"><strong>{importRecord.status}</strong><small>{importRecord.importedAt} · {importRecord.operator}</small></div><section className="detail-section"><h3>导入信息</h3><div className="task-detail-grid"><div><small>关联批次</small><strong>{importRecord.batch}</strong></div><div><small>导入记录数</small><strong>{importRecord.total}</strong></div><div><small>更新任务数</small><strong>{importRecord.updated}</strong></div><div><small>处理状态</small><strong>{importRecord.status}</strong></div></div></section><section className="detail-section"><h3>回写结果</h3><p>系统已按建联任务编号匹配回填表，并同步更新达人建联状态及所属批次的进度统计。</p></section></div><footer><button className="primary-button" onClick={() => setImportRecordId(null)}>完成</button></footer></aside></div>}
    {statusConfirmation && detail && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setStatusConfirmation(null); }}><section className="status-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="status-confirm-title"><header><div><small>确认状态修改</small><h2 id="status-confirm-title">确认修改建联状态？</h2><p>{detail.creator} · {detail.id}</p></div><button onClick={() => setStatusConfirmation(null)} aria-label="关闭">×</button></header><div className="status-confirm-body"><div><small>当前状态</small><strong>{detail.status}</strong></div><span>↓</span><div><small>修改后</small><strong>{statusConfirmation.nextStatus}</strong></div><p>确认后将按填写的发生时间写入状态记录，允许状态倒退。</p></div><footer><button className="ghost-button" onClick={() => setStatusConfirmation(null)}>取消</button><button className="primary-button" onClick={() => commitStatusUpdate(statusConfirmation)}>确认修改</button></footer></section></div>}
    {statusUpdateOpen && detail && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setStatusUpdateOpen(false); }}><section className="status-update-modal" role="dialog" aria-modal="true" aria-labelledby="status-update-title"><header><div><small>建联任务状态回填</small><h2 id="status-update-title">更新建联状态</h2><p>{detail.creator} · {detail.id}</p></div><button onClick={() => setStatusUpdateOpen(false)} aria-label="关闭">×</button></header><div className="status-update-body"><div className="status-update-tip"><span>i</span><p>状态可按实际发生时间补录或更正；提交后会保留更新人、时间与备注记录。</p></div><label>更新后状态<select value={statusNext} onChange={(event) => setStatusNext(event.target.value)}><option>待添加</option><option>已添加待同意</option><option>已同意待回复</option><option>沟通中</option><option>已达成合作意向</option><option>未达成</option></select></label><div className="status-update-grid"><label>状态更新人<input value={statusUpdater} onChange={(event) => setStatusUpdater(event.target.value)} placeholder="默认负责商务" /></label><label>状态发生时间<input type="datetime-local" value={statusOccurredAt} max={statusTimeMax} onChange={(event) => setStatusOccurredAt(event.target.value)} /></label></div><label>更新备注<textarea value={statusUpdateNote} onChange={(event) => setStatusUpdateNote(event.target.value)} placeholder="选填，记录来源、沟通结论或更正原因" /></label></div><footer><button className="ghost-button" onClick={() => setStatusUpdateOpen(false)}>取消</button><button className="primary-button" onClick={saveStatusUpdate}>确认更新</button></footer></section></div>}
  </>;
}

function StatusDot({ value }: { value: string }) { return <span className={`boolean-status ${value === "是" ? "yes" : ""}`}>{value === "是" ? "✓ 是" : "— 否"}</span>; }

function HistoricalAnalysis({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [tab, setTab] = useState<"data" | "sabc">("data");
  const [importOpen, setImportOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [grade, setGrade] = useState("全部等级");
  const [insightOpen, setInsightOpen] = useState(false);
  const importRows = [
    { id: "HI20260818003", source: "热度云历史成交导出", period: "2023-01 至 2026-07", total: 1082, matched: 1048, unmatched: 17, duplicate: 12, invalid: 5, operator: "陈旭光", time: "今天 08:42", status: "已完成" },
    { id: "HI20260730002", source: "业务部门成交台账", period: "2022-01 至 2022-12", total: 836, matched: 791, unmatched: 28, duplicate: 9, invalid: 8, operator: "陈旭光", time: "2026-07-30 14:20", status: "已完成" },
  ];
  const gradeRows = [
    { name: "小家电研究所", uid: "dy_86541972", grade: "S", gmv: "128.6万", cooperations: 8, category: "家电测评", traits: "高复购、强讲解", avatar: "blue" },
    { name: "乐妈家居直播", uid: "dy_76129840", grade: "S", gmv: "110.2万", cooperations: 6, category: "家居百货", traits: "稳定开播、高转化", avatar: "pink" },
    { name: "洁净生活家", uid: "dy_10376294", grade: "A", gmv: "76.2万", cooperations: 5, category: "清洁收纳", traits: "内容匹配度高", avatar: "purple" },
    { name: "阿阳测评", uid: "dy_42917835", grade: "A", gmv: "61.4万", cooperations: 4, category: "数码家电", traits: "测评可信度高", avatar: "green" },
    { name: "暖暖的居家日记", uid: "dy_31562099", grade: "B", gmv: "21.8万", cooperations: 3, category: "居家生活", traits: "稳定产出", avatar: "yellow" },
    { name: "收纳研究员", uid: "dy_24680137", grade: "C", gmv: "4.6万", cooperations: 1, category: "清洁收纳", traits: "需继续观察", avatar: "orange" },
  ];
  const visibleRows = gradeRows.filter((row) => grade === "全部等级" || row.grade === grade);

  return <>
    <header className="page-header history-head"><div><h1>历史达人分析</h1><p>导入公司真实成交数据，匹配达人主档后查看历史分级与高价值达人共性。</p></div><div className="header-actions"><button className="ghost-button" onClick={() => notify("历史数据导入模板已下载", "success")}>⇩ 下载导入模板</button><button className="primary-button" onClick={() => setImportOpen(true)}>＋ 导入历史数据</button></div></header>
    <section className="history-kpis"><article><small>历史成交达人</small><strong>1,839</strong><span>已匹配达人主档</span></article><article><small>S/A级高价值达人</small><strong>428</strong><span>占历史成交达人 23.3%</span></article><article><small>待处理匹配数据</small><strong>17</strong><span>需要人工确认达人UID</span></article><article><small>累计历史成交GMV</small><strong>2,486.7万</strong><span>基于已导入成交记录</span></article></section>
    <section className="panel history-panel"><div className="history-tabs"><div className="tabs"><button className={tab === "data" ? "active" : ""} onClick={() => setTab("data")}>历史成交数据 <span>{importRows.length}</span></button><button className={tab === "sabc" ? "active" : ""} onClick={() => setTab("sabc")}>SABC达人分析 <span>1,839</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>
      {tab === "data" ? <div className="history-data-view"><div className="history-info"><span>i</span><p>历史成交数据是公司内部真实业务结果，与外部抓取的达人公开数据独立保存；导入时仅进行关联，不覆盖达人基础数据。</p></div><div className="table-wrap history-import-table"><table><thead><tr><th>导入批次</th><th>数据来源</th><th>覆盖时间</th><th>总记录</th><th>成功匹配</th><th>未匹配</th><th>重复</th><th>字段异常</th><th>导入人</th><th>导入时间</th><th>状态</th><th>操作</th></tr></thead><tbody>{importRows.map((row) => <tr key={row.id}><td><button className="table-link" onClick={() => setResultOpen(true)}>{row.id}</button></td><td><strong>{row.source}</strong></td><td>{row.period}</td><td>{row.total}</td><td><span className="import-good">{row.matched}</span></td><td><span className="import-warn">{row.unmatched}</span></td><td>{row.duplicate}</td><td>{row.invalid}</td><td>{row.operator}</td><td>{row.time}</td><td><span className="task-status success">{row.status}</span></td><td><button className="row-action" onClick={() => setResultOpen(true)}>查看结果</button></td></tr>)}</tbody></table></div><div className="history-match-card"><div><span className="history-card-icon">匹</span><div><h2>17 条未匹配达人数据</h2><p>缺少达人UID或平台信息，暂未能关联到现有达人主档。</p></div></div><button className="primary-button" onClick={() => setResultOpen(true)}>去处理</button></div></div> : <div className="sabc-view"><div className="grade-summary"><button className={grade === "S" ? "active s" : "s"} onClick={() => setGrade(grade === "S" ? "全部等级" : "S")}><span>S</span><div><strong>96</strong><small>顶级高价值达人</small></div><em>5.2%</em></button><button className={grade === "A" ? "active a" : "a"} onClick={() => setGrade(grade === "A" ? "全部等级" : "A")}><span>A</span><div><strong>332</strong><small>高价值达人</small></div><em>18.1%</em></button><button className={grade === "B" ? "active b" : "b"} onClick={() => setGrade(grade === "B" ? "全部等级" : "B")}><span>B</span><div><strong>684</strong><small>稳定合作达人</small></div><em>37.2%</em></button><button className={grade === "C" ? "active c" : "c"} onClick={() => setGrade(grade === "C" ? "全部等级" : "C")}><span>C</span><div><strong>727</strong><small>待观察达人</small></div><em>39.5%</em></button></div><div className="sabc-insight"><div><span>AI</span><p><strong>S/A级达人共性洞察</strong><small>高价值达人普遍具备稳定的直播频率、明确的家电/家居垂类定位，以及可验证的讲解型内容能力。</small></p></div><button onClick={() => setInsightOpen(true)}>查看完整分析 →</button></div><div className="sabc-toolbar"><div>{["全部等级", "S", "A", "B", "C"].map((item) => <button key={item} className={grade === item ? "active" : ""} onClick={() => setGrade(item)}>{item}</button>)}</div><span>仅展示存在真实公司历史成交记录的达人</span></div><div className="table-wrap sabc-table"><table><thead><tr><th>达人</th><th>历史等级</th><th>历史成交GMV</th><th>合作次数</th><th>主要类目</th><th>典型特征</th><th>操作</th></tr></thead><tbody>{visibleRows.map((row) => <tr key={row.uid}><td><div className="creator-cell"><span className={`creator-avatar ${row.avatar}`}>{row.name.slice(0, 1)}</span><div><strong>{row.name}</strong><small>{row.uid}</small></div></div></td><td><span className={`grade-pill grade-${row.grade.toLowerCase()}`}>{row.grade}</span></td><td><strong>{row.gmv}</strong></td><td>{row.cooperations}</td><td>{row.category}</td><td>{row.traits}</td><td><button className="row-action" onClick={() => notify(`已打开 ${row.name} 的达人详情`)}>查看达人</button></td></tr>)}</tbody></table></div></div>}
    </section>
    {importOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportOpen(false); }}><section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="import-title"><header><div><small>导入历史成交数据</small><h2 id="import-title">上传内部历史业务数据</h2><p>支持按标准模板导入，并通过平台 + 达人UID匹配达人主档。</p></div><button onClick={() => setImportOpen(false)} aria-label="关闭">×</button></header><div className="import-modal-body"><div className="upload-zone"><span>⇧</span><strong>点击选择文件，或将文件拖拽到这里</strong><small>支持 .xlsx、.csv，单个文件不超过 20MB</small><button onClick={() => notify("已选择演示数据文件", "success")}>选择文件</button></div><div className="import-fields"><h3>建议包含的字段</h3><span>达人UID</span><span>达人平台</span><span>合作商品</span><span>合作时间</span><span>成交GMV</span><span>合作次数</span></div></div><footer><button className="ghost-button" onClick={() => setImportOpen(false)}>取消</button><button className="primary-button" onClick={() => { setImportOpen(false); setResultOpen(true); notify("历史数据已开始导入", "success"); }}>开始导入</button></footer></section></div>}
    {resultOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setResultOpen(false); }}><section className="import-result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title"><header><div><small>导入结果</small><h2 id="result-title">HI20260818003 · 热度云历史成交导出</h2></div><button onClick={() => setResultOpen(false)} aria-label="关闭">×</button></header><div className="result-grid"><div className="result-good"><strong>1,048</strong><span>成功匹配</span></div><div className="result-warn"><strong>17</strong><span>未匹配达人</span></div><div><strong>12</strong><span>重复数据</span></div><div><strong>5</strong><span>字段异常</span></div></div><div className="unmatched-list"><div><h3>未匹配达人</h3><button onClick={() => notify("未匹配数据已导出", "success")}>导出</button></div><p>达人UID 缺失或与当前达人库不一致，可补充稳定标识后重新匹配。</p><ul><li><span>抖音号：好物研究员</span><em>缺少达人UID</em></li><li><span>达人UID：dy_235XXXX</span><em>达人主档不存在</em></li><li><span>平台：未知</span><em>缺少平台信息</em></li></ul></div><footer><button className="ghost-button" onClick={() => setResultOpen(false)}>关闭</button><button className="primary-button" onClick={() => { setResultOpen(false); notify("已进入未匹配数据处理流程", "success"); }}>处理未匹配数据</button></footer></section></div>}
    {insightOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInsightOpen(false); }}><section className="insight-modal" role="dialog" aria-modal="true" aria-labelledby="insight-title"><header><div><small>AI共性特征分析</small><h2 id="insight-title">S/A级高价值达人画像</h2></div><button onClick={() => setInsightOpen(false)} aria-label="关闭">×</button></header><div className="insight-content"><section><h3>典型共性</h3><ul><li>家电/家居垂类内容占比高，受众预期稳定。</li><li>具备持续直播或规律更新能力，近30天活跃度高。</li><li>讲解、实测和场景演示能力突出，内容可解释性强。</li></ul></section><section><h3>业务建议</h3><p>优先沉淀S/A级达人常用的品类、价格带、内容形态和合作节奏；这些是历史事实的总结，不直接作为新达人的SABC等级判断。</p></section></div><footer><button className="primary-button" onClick={() => setInsightOpen(false)}>知道了</button></footer></section></div>}
  </>;
}

function LinkAutomation({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [tab, setTab] = useState<"tasks" | "records">("tasks");
  const [createOpen, setCreateOpen] = useState(false);
  const [retryConfirmTaskId, setRetryConfirmTaskId] = useState<string | null>(null);
  const [stopConfirmTaskId, setStopConfirmTaskId] = useState<string | null>(null);
  const currentOperator = "陈旭光";
  const [statusFilter, setStatusFilter] = useState("全部");
  const [taskPage, setTaskPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [technicalLogOpen, setTechnicalLogOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: "DL202608180038", yidaoId: "TASK-20260818-01128", scheduleUuid: "SCH-DIRECT-LINK-01", creator: "小家电研究所", douyinId: "xiaojd_lab", uid: "dy_86541972", product: "创维循环扇", store: "创维生活电器旗舰店", productId: "100987654321", commission: "25%", remark: "首播专属佣金", created: "今天 10:18", status: "执行中", api: "task/start 已受理" },
    { id: "DL202608180037", yidaoId: "TASK-20260818-01127", scheduleUuid: "SCH-DIRECT-LINK-01", creator: "洁净生活家", douyinId: "clean_life", uid: "dy_10376294", product: "创维循环扇", store: "创维生活电器旗舰店", productId: "100987654321", commission: "22%", remark: "", created: "今天 10:06", status: "创建成功", api: "task/query 正常" },
    { id: "DL202608180036", yidaoId: "TASK-20260818-01126", scheduleUuid: "SCH-DIRECT-LINK-02", creator: "乐妈家居直播", douyinId: "lemama_home", uid: "dy_76129840", product: "小熊破壁机", store: "小熊官方旗舰店", productId: "100678901234", commission: "18%", remark: "晚场直播", created: "今天 09:52", status: "异常", api: "task/query 异常" },
    { id: "DL202608180035", yidaoId: "TASK-20260818-01125", scheduleUuid: "SCH-DIRECT-LINK-03", creator: "阿阳测评", douyinId: "ayang_test", uid: "dy_42917835", product: "苏泊尔空气炸锅", store: "苏泊尔厨电旗舰店", productId: "100112233445", commission: "20%", remark: "", created: "今天 09:36", status: "已停止", api: "task/stop 成功" },
    { id: "DL202608180034", yidaoId: "待 task/newest/list 回查", scheduleUuid: "SCH-DIRECT-LINK-01", creator: "暖暖的居家日记", douyinId: "warm_home", uid: "dy_31562099", product: "创维循环扇", store: "创维生活电器旗舰店", productId: "100987654321", commission: "25%", remark: "新建待确认", created: "今天 09:25", status: "待回查", api: "task/start 已受理" },
    { id: "DL202608180033", yidaoId: "TASK-20260818-01124", scheduleUuid: "SCH-DIRECT-LINK-03", creator: "小周直播选品", douyinId: "xiaozhou_live", uid: "dy_54290168", product: "苏泊尔空气炸锅", store: "苏泊尔厨电旗舰店", productId: "100112233445", commission: "20%", remark: "", created: "今天 09:12", status: "创建成功", api: "task/query 正常" },
    { id: "DL202608180032", yidaoId: "TASK-20260818-01123", scheduleUuid: "SCH-DIRECT-LINK-02", creator: "收纳研究员", douyinId: "storage_lab", uid: "dy_24680137", product: "小熊破壁机", store: "小熊官方旗舰店", productId: "100678901234", commission: "18%", remark: "批量任务排队中", created: "今天 08:58", status: "排队中", api: "task/query 已入队" },
  ]);
  const today = "2026-08-18";
  const [entryMode, setEntryMode] = useState<"ai" | "paste" | "single">("paste");
  const [taskName, setTaskName] = useState(`${today} 第一批`);
  const [bulkText, setBulkText] = useState("");
  const [parsedCreators, setParsedCreators] = useState<Array<{ creator: string; douyinId: string; uid: string }>>([]);
  const [submitConfirmation, setSubmitConfirmation] = useState<{ creators: Array<{ creator: string; douyinId: string; uid: string }>; product: string; store: string; count: number } | null>(null);
  const [form, setForm] = useState({ scheduleUuid: "SCH-DIRECT-LINK-01", creator: "", douyinId: "", uid: "", product: "", store: "", productId: "", remark: "", commission: "" });
  const ownedTasks = tasks.filter((task) => getTaskOwner(task) === currentOperator);
  const filteredTasks = ownedTasks.filter((task) => statusFilter === "全部" || task.status === statusFilter);
  const taskPageSize = 5;
  const taskPageCount = Math.max(1, Math.ceil(filteredTasks.length / taskPageSize));
  const visibleTasks = filteredTasks.slice((Math.min(taskPage, taskPageCount) - 1) * taskPageSize, Math.min(taskPage, taskPageCount) * taskPageSize);
  const detail = ownedTasks.find((task) => task.id === detailId) ?? null;
  const retryTask = ownedTasks.find((task) => task.id === retryConfirmTaskId) ?? null;
  const stopConfirmTask = ownedTasks.find((task) => task.id === stopConfirmTaskId) ?? null;

  useEffect(() => { setTechnicalLogOpen(false); }, [detailId]);

  useEffect(() => { setTaskPage(1); }, [statusFilter]);

  useEffect(() => {
    const description = document.querySelector<HTMLElement>(".link-head p");
    if (description) description.textContent = `当前身份：普通商务 · ${currentOperator}，仅展示本人创建的任务、执行结果与API调用记录。`;
    const taskTabCount = document.querySelector<HTMLElement>(".link-tabs .tabs button:first-child span");
    if (taskTabCount) taskTabCount.textContent = String(ownedTasks.length);
    const recordTabCount = document.querySelector<HTMLElement>(".link-tabs .tabs button:nth-child(2) span");
    if (recordTabCount) recordTabCount.textContent = String(ownedTasks.length + 3);
    const apiNote = document.querySelector<HTMLElement>(".api-record-note p");
    if (apiNote) apiNote.textContent = "自动化任务 → 执行记录 → API调用日志。此处仅展示当前商务有权限查看的调用记录。";
    const kpiValues = document.querySelectorAll<HTMLElement>(".link-kpis article strong");
    if (kpiValues[0]) kpiValues[0].textContent = String(ownedTasks.length + 8);
    if (kpiValues[1]) kpiValues[1].textContent = String(ownedTasks.filter((task) => task.status === "执行中").length);
    if (kpiValues[3]) kpiValues[3].textContent = String(ownedTasks.filter((task) => task.status === "异常").length);
    const kpiCards = document.querySelectorAll<HTMLElement>(".link-kpis article");
    const finished = ownedTasks.filter((task) => ["创建成功", "异常"].includes(task.status));
    const successCount = ownedTasks.filter((task) => task.status === "创建成功").length;
    const successRate = finished.length ? `${Math.round((successCount / finished.length) * 1000) / 10}%` : "—";
    const labels = ["今日执行次数", "成功创建链接数量", "失败任务数量", "成功率"];
    const values = [String(ownedTasks.length + 8), String(successCount), String(ownedTasks.filter((task) => task.status === "异常").length), successRate];
    const details = ["包含已完成、执行中及排队中的任务", "已完成定向链接创建的任务", "需要检查并重新执行的任务", "成功创建链接 ÷ 已结束任务"];
    kpiCards.forEach((card, index) => {
      const label = card.querySelector<HTMLElement>("small");
      const value = card.querySelector<HTMLElement>("strong");
      const detail = card.querySelector<HTMLElement>("em");
      if (label) label.textContent = labels[index];
      if (value) value.textContent = values[index];
      if (detail) detail.textContent = details[index];
    });
  }, [tasks, ownedTasks.length]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const filterGroup = document.querySelector<HTMLElement>(".link-filter > div");
    if (!filterGroup) return;
    let button = filterGroup.querySelector<HTMLButtonElement>("[data-queue-filter]");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.dataset.queueFilter = "true";
      button.textContent = "排队中";
      button.addEventListener("click", () => setStatusFilter("排队中"));
      const running = Array.from(filterGroup.querySelectorAll("button")).find((item) => item.textContent === "执行中");
      running?.before(button);
    }
    button.classList.toggle("active", statusFilter === "排队中");
  }, [tab, statusFilter]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const table = document.querySelector<HTMLElement>(".link-table table");
    if (!table) return;
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      const task = visibleTasks[index];
      const actionCell = row.lastElementChild;
      actionCell?.querySelector("[data-link-task-action]")?.remove();
      if (!task) return;
      const action = task.status === "待回查" ? { label: "立即回查", run: () => checkLinkTask(task.id) }
        : task.status === "排队中" ? { label: "停止", run: () => setStopConfirmTaskId(task.id) }
        : task.status === "执行中" ? { label: "停止", run: () => setStopConfirmTaskId(task.id) }
        : task.status === "异常" ? { label: "重新执行", run: () => setRetryConfirmTaskId(task.id) }
        : task.status === "已停止" ? { label: "重新执行", run: () => retryLinkTask(task.id) }
        : task.status === "创建成功" ? { label: "复制链接", run: () => copyDirectedLink(task.id) }
        : null;
      if (!action) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `row-action link-task-action ${task.status === "执行中" ? "stop" : ""}`;
      button.dataset.linkTaskAction = task.id;
      button.textContent = action.label;
      button.addEventListener("click", action.run);
      actionCell?.append(button);
    });
  }, [tab, tasks, statusFilter]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const table = document.querySelector<HTMLElement>(".link-table table");
    const header = table?.querySelector("thead tr");
    if (!table || !header) return;
    if (!header.querySelector("[data-yidao-queue-column]")) {
      const cell = document.createElement("th");
      cell.dataset.yidaoQueueColumn = "true";
      cell.textContent = "影刀排队";
      header.insertBefore(cell, header.lastElementChild);
    }
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      row.querySelector("[data-yidao-queue-cell]")?.remove();
      const queue = getYidaoQueue(visibleTasks[index]);
      const cell = document.createElement("td");
      cell.dataset.yidaoQueueCell = "true";
      cell.innerHTML = `<div class="yidao-queue-cell ${queue.tone}"><strong>${queue.label}</strong><small>${queue.detail}</small></div>`;
      row.insertBefore(cell, row.lastElementChild);
    });
  }, [tab, tasks, statusFilter]);

  useEffect(() => {
    document.querySelector(".link-task-pagination")?.remove();
    if (tab !== "tasks") return;
    const tableWrap = document.querySelector<HTMLElement>(".link-table");
    if (!tableWrap) return;
    const currentPage = Math.min(taskPage, taskPageCount);
    const pagination = document.createElement("div");
    pagination.className = "link-task-pagination";
    pagination.innerHTML = `<span>显示 ${filteredTasks.length ? (currentPage - 1) * taskPageSize + 1 : 0}–${Math.min(currentPage * taskPageSize, filteredTasks.length)} 条，共 ${filteredTasks.length} 条</span><div><button type="button" data-page-prev ${currentPage === 1 ? "disabled" : ""}>‹</button>${Array.from({ length: taskPageCount }, (_, index) => `<button type="button" data-page="${index + 1}" ${index + 1 === currentPage ? "class=active" : ""}>${index + 1}</button>`).join("")}<button type="button" data-page-next ${currentPage === taskPageCount ? "disabled" : ""}>›</button></div>`;
    pagination.querySelector<HTMLButtonElement>("[data-page-prev]")?.addEventListener("click", () => setTaskPage((value) => Math.max(1, value - 1)));
    pagination.querySelector<HTMLButtonElement>("[data-page-next]")?.addEventListener("click", () => setTaskPage((value) => Math.min(taskPageCount, value + 1)));
    pagination.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((button) => button.addEventListener("click", () => setTaskPage(Number(button.dataset.page))));
    tableWrap.after(pagination);
    return () => pagination.remove();
  }, [filteredTasks.length, tab, taskPage, taskPageCount]);

  useEffect(() => {
    if (tab !== "tasks") return;
    const timer = window.setTimeout(() => {
      const table = document.querySelector<HTMLElement>(".link-table table");
      const header = table?.querySelector("thead tr");
      if (!table || !header) return;
      let queueHeader = header.querySelector<HTMLElement>("[data-yidao-queue-column]");
      if (!queueHeader) {
        queueHeader = document.createElement("th");
        queueHeader.dataset.yidaoQueueColumn = "true";
        queueHeader.textContent = "影刀排队";
        header.insertBefore(queueHeader, header.lastElementChild);
      }
      table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
        const task = visibleTasks[index];
        if (!task) return;
        row.querySelector("[data-yidao-queue-cell]")?.remove();
        const actionCell = row.lastElementChild;
        actionCell?.querySelector("[data-link-task-action]")?.remove();
        const queue = getYidaoQueue(task);
        const queueCell = document.createElement("td");
        queueCell.dataset.yidaoQueueCell = "true";
        queueCell.innerHTML = `<div class="yidao-queue-cell ${queue.tone}"><strong>${queue.label}</strong><small>${queue.detail}</small></div>`;
        row.insertBefore(queueCell, actionCell);
        const action = task.status === "待回查" ? { label: "立即回查", run: () => checkLinkTask(task.id) }
          : task.status === "排队中" ? { label: "停止", run: () => setStopConfirmTaskId(task.id) }
          : task.status === "执行中" ? { label: "停止", run: () => setStopConfirmTaskId(task.id) }
          : task.status === "异常" ? { label: "重新执行", run: () => setRetryConfirmTaskId(task.id) }
          : task.status === "已停止" ? { label: "重新执行", run: () => retryLinkTask(task.id) }
          : task.status === "创建成功" ? { label: "复制链接", run: () => copyDirectedLink(task.id) }
          : null;
        if (!action || !actionCell) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = `row-action link-task-action ${task.status === "执行中" ? "stop" : ""}`;
        button.dataset.linkTaskAction = task.id;
        button.textContent = action.label;
        button.addEventListener("click", action.run);
        actionCell.append(button);
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [tab, tasks, statusFilter, taskPage]);

  useEffect(() => {
    if (tab !== "records") return;
    const timer = window.setTimeout(() => {
      document.querySelectorAll<HTMLTableRowElement>(".api-record-table tbody tr").forEach((row) => {
        const taskId = row.querySelector("td:nth-child(4) button")?.textContent ?? "";
        const task = tasks.find((item) => item.id === taskId);
        if (task && getTaskOwner(task) !== currentOperator) row.remove();
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [tab, tasks]);

  useEffect(() => {
    const openTaskDetail = (event: Event) => setDetailId((event as CustomEvent<string>).detail);
    document.addEventListener("link-task-detail", openTaskDetail);
    return () => document.removeEventListener("link-task-detail", openTaskDetail);
  }, []);

  useEffect(() => {
    if (!createOpen) return;
    const linkForm = document.querySelector<HTMLElement>(".link-create-modal .link-form");
    const fields = linkForm?.querySelectorAll<HTMLElement>(":scope > label");
    if (!linkForm || !fields?.[1] || linkForm.querySelector(".link-product-lookup")) return;
    fields.forEach((field, index) => { if (index >= 2 && index <= 5) field.style.display = "none"; });
    const catalog: Record<string, { product: string; store: string; commission: string }> = {
      "100987654321": { product: "创维循环扇", store: "创维生活电器旗舰店", commission: "25" },
      "100678901234": { product: "小熊破壁机", store: "小熊官方旗舰店", commission: "18" },
      "100112233445": { product: "苏泊尔空气炸锅", store: "苏泊尔厨电旗舰店", commission: "20" },
    };
    const panel = document.createElement("div");
    panel.className = "link-product-lookup full";
    panel.innerHTML = `<label>定向商品ID<span>*</span><input name="productId" placeholder="输入精选联盟商品ID" inputmode="numeric" /><small>输入商品 ID 后自动带出商品信息</small></label><label>商品名称<input name="product" readonly placeholder="输入商品ID后自动带出" /></label><label>所属店铺<select name="store"><option>创维生活电器旗舰店</option><option>小熊官方旗舰店</option><option>苏泊尔厨电旗舰店</option></select><small>如归属有误，可手动修改</small></label><label>佣金<span>*</span><div class="commission-input"><input name="commission" readonly placeholder="自动带出" /><em>%</em></div></label>`;
    const productIdInput = panel.querySelector<HTMLInputElement>("input[name=productId]")!;
    const productInput = panel.querySelector<HTMLInputElement>("input[name=product]")!;
    const storeSelect = panel.querySelector<HTMLSelectElement>("select[name=store]")!;
    const commissionInput = panel.querySelector<HTMLInputElement>("input[name=commission]")!;
    const applyLookup = (id: string) => {
      const product = catalog[id];
      productInput.value = product?.product ?? "";
      commissionInput.value = product?.commission ?? "";
      if (product) storeSelect.value = product.store;
      setForm((current) => ({ ...current, productId: id, product: product?.product ?? "", store: product ? storeSelect.value : current.store, commission: product?.commission ?? "" }));
    };
    productIdInput.addEventListener("input", () => applyLookup(productIdInput.value.trim()));
    storeSelect.addEventListener("change", () => setForm((current) => ({ ...current, store: storeSelect.value })));
    fields[1].after(panel);
    return () => panel.remove();
  }, [createOpen]);

  useEffect(() => {
    if (!createOpen) return;
    setEntryMode("paste");
  }, [createOpen]);

  useEffect(() => {
    if (!createOpen) return;
    const entry = document.querySelector<HTMLElement>(".link-create-modal .creator-entry");
    if (!entry) return;
    Array.from(entry.querySelectorAll<HTMLButtonElement>(".entry-tabs button")).find((button) => button.textContent?.includes("AI整段解析"))?.remove();
    const pasteTab = entry.querySelector<HTMLButtonElement>(".entry-tabs button:first-child");
    if (pasteTab) pasteTab.textContent = "批量粘贴";
    const textarea = entry.querySelector<HTMLTextAreaElement>("textarea");
    if (textarea) textarea.placeholder = "请填写达人UID，支持批量粘贴，请用英文逗号（,）隔开，每次最多支持100个";
    entry.querySelector<HTMLButtonElement>(".entry-actions button:last-child")?.remove();
  }, [createOpen, entryMode]);

  useEffect(() => {
    if (!detail) return;
    const drawerBody = document.querySelector<HTMLElement>(".link-detail-drawer .drawer-body");
    const taskSection = Array.from(drawerBody?.querySelectorAll<HTMLElement>(".detail-section") ?? []).find((section) => section.querySelector("h3")?.textContent === "任务参数");
    if (!drawerBody || !taskSection) return;
    drawerBody.querySelector("[data-link-uid-list]")?.remove();
    Array.from(taskSection.querySelectorAll<HTMLElement>(".task-detail-grid > div")).filter((item) => ["达人昵称", "达人抖音ID", "达人UID"].includes(item.querySelector("small")?.textContent ?? "")).forEach((item) => item.remove());
    const batchDetail = detail as typeof detail & { uidCount?: number; uidList?: string[] };
    const uidCount = batchDetail.uidCount ?? (detail.id.endsWith("038") ? 126 : detail.id.endsWith("037") ? 84 : detail.id.endsWith("036") ? 63 : 42);
    const suffix = detail.uid.replace(/^dy_/, "");
    const uids = batchDetail.uidList?.length ? batchDetail.uidList : Array.from({ length: uidCount }, (_, index) => index === 0 ? detail.uid : `dy_${suffix.slice(0, 5)}${String(index + 1).padStart(5, "0")}`);
    const uidSection = document.createElement("section");
    uidSection.className = "link-uid-list";
    uidSection.dataset.linkUidList = "true";
    uidSection.innerHTML = `<div class="link-uid-list-head"><div><h3>达人UID</h3><small>本次任务共 ${uidCount} 位达人 · 已按 UID 批量提交影刀</small></div><button type="button" data-toggle-uids>展开全部</button></div><div class="link-uid-chips">${uids.map((uid) => `<code>${uid}</code>`).join("")}</div>`;
    uidSection.querySelector<HTMLButtonElement>("[data-toggle-uids]")?.addEventListener("click", (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      uidSection.classList.toggle("expanded");
      button.textContent = uidSection.classList.contains("expanded") ? "收起" : "展开全部";
    });
    taskSection.before(uidSection);
    return () => uidSection.remove();
  }, [detail]);

  useEffect(() => {
    if (!detail) return;
    const section = Array.from(document.querySelectorAll<HTMLElement>(".link-detail-drawer .detail-section")).find((item) => ["影刀执行记录", "技术信息"].includes(item.querySelector("h3")?.textContent ?? ""));
    if (!section) return;
    const hero = document.querySelector<HTMLElement>(".link-detail-drawer .link-result-hero");
    hero?.classList.toggle("queued", detail.status === "排队中" || detail.status === "待回查");
    if (detail.status === "排队中" || detail.status === "待回查") hero?.classList.remove("success");
    section.querySelector("[data-yidao-queue-detail]")?.remove();
    const queue = getYidaoQueue(detail);
    const item = document.createElement("div");
    item.dataset.yidaoQueueDetail = "true";
    item.className = `yidao-queue-detail ${queue.tone}`;
    item.innerHTML = `<span>${queue.tone === "waiting" ? "排" : queue.tone === "running" ? "行" : "✓"}</span><div><strong>${queue.label}</strong><small>${queue.detail}</small></div>`;
    section.querySelector("h3")?.after(item);
  }, [detail]);

  useEffect(() => {
    if (!detail) return;
    const business = getBusinessExecution(detail);
    const hero = document.querySelector<HTMLElement>(".link-detail-drawer .link-result-hero");
    if (hero) {
      hero.className = `link-result-hero ${business.tone}`;
      hero.innerHTML = `<span>${detail.status === "执行中" ? "◌" : detail.status === "异常" ? "!" : detail.status === "已停止" ? "Ⅱ" : "✓"}</span><div><strong>${business.title}</strong><small>${business.detail}</small></div>`;
    }
    const section = Array.from(document.querySelectorAll<HTMLElement>(".link-detail-drawer .detail-section")).find((item) => ["影刀执行记录", "技术信息"].includes(item.querySelector("h3")?.textContent ?? ""));
    if (!section) return;
    section.classList.add("technical-log-section");
    section.innerHTML = `<div class="technical-log-heading"><h3>技术信息</h3><button type="button" class="row-action" data-technical-log-toggle>${technicalLogOpen ? "收起技术日志" : "查看技术日志"}</button></div>${technicalLogOpen ? `<div class="yidao-log"><div><span>请求时间</span><p><strong>10:18:02</strong> API调用状态：${detail.api}</p></div><div><span>影刀受理</span><p><strong>10:18:04</strong> 返回影刀任务ID：${detail.yidaoId}</p></div><div><span>返回结果</span><p><strong>10:18:10</strong> 当前任务状态：${detail.status}</p></div></div>` : ""}`;
    section.querySelector<HTMLButtonElement>("[data-technical-log-toggle]")?.addEventListener("click", () => setTechnicalLogOpen((value) => !value));
  }, [detail, technicalLogOpen]);

  useEffect(() => {
    if (!detail) return;
    const drawer = document.querySelector<HTMLElement>(".link-detail-drawer .drawer-body");
    const firstSection = drawer?.querySelector<HTMLElement>(".detail-section");
    if (!drawer || !firstSection) return;
    drawer.querySelector("[data-business-context]")?.remove();
    const task = detail as typeof detail & { uidCount?: number };
    const uidCount = task.uidCount ?? (detail.id.endsWith("038") ? 126 : detail.id.endsWith("037") ? 84 : detail.id.endsWith("036") ? 63 : 42);
    const business = getBusinessExecution(detail);
    const taskName = detail.remark.includes(" · ") ? detail.remark.split(" · ")[0] : `定向链接任务 · ${detail.id}`;
    const section = document.createElement("section");
    section.className = "detail-section link-business-context";
    section.dataset.businessContext = "true";
    section.innerHTML = `<h3>基础信息</h3><div class="task-detail-grid"><div><small>任务编号</small><strong>${detail.id}</strong></div><div><small>任务名称</small><strong>${taskName}</strong></div><div><small>创建人</small><strong>陈旭光</strong></div><div><small>创建时间</small><strong>${detail.created}</strong></div><div><small>当前状态</small><strong>${business.title}</strong></div></div><h3>商品信息</h3><div class="task-detail-grid"><div><small>商品名称</small><strong>${detail.product}</strong></div><div><small>商品ID</small><strong>${detail.productId}</strong></div><div><small>所属店铺</small><strong>${detail.store}</strong></div><div><small>佣金比例</small><strong>${detail.commission}</strong></div></div><h3>执行信息</h3><div class="task-detail-grid"><div><small>达人数量</small><strong>${uidCount} 个</strong></div><div><small>执行时间</small><strong>${detail.created}</strong></div><div><small>执行结果</small><strong>${business.detail}</strong></div></div>`;
    firstSection.before(section);
  }, [detail]);

  useEffect(() => {
    if (!detail) return;
    const drawer = document.querySelector<HTMLElement>(".link-detail-drawer .drawer-body");
    if (!drawer) return;
    drawer.querySelector("[data-execution-history]")?.remove();
    const technicalSection = Array.from(drawer.querySelectorAll<HTMLElement>(".detail-section")).find((section) => section.classList.contains("technical-log-section"));
    if (!technicalSection) return;
    const business = getBusinessExecution(detail);
    const section = document.createElement("section");
    section.className = "detail-section execution-history-section";
    section.dataset.executionHistory = "true";
    section.innerHTML = `<h3>执行记录</h3><p class="execution-history-note">自动化任务 ${detail.id} 的执行历史，API调用日志按本次执行记录关联保存。</p><div class="execution-history-card"><div><small>执行时间</small><strong>${detail.created}</strong></div><div><small>执行结果</small><strong>${business.title}</strong></div><div><small>触发方式</small><strong>商务手动创建</strong></div></div>`;
    technicalSection.before(section);
  }, [detail]);

  function getYidaoQueue(task: typeof tasks[number] | undefined) {
    if (!task) return { label: "—", detail: "—", tone: "done" };
    const sequence = Number(task.id.slice(-2));
    if (task.status === "待回查") return { label: "等待任务回查", detail: "尚未获取影刀 Task UUID，未进入执行队列", tone: "waiting" };
    if (task.status === "排队中") return { label: "影刀排队中", detail: `前方 ${Math.max(3, sequence % 12)} 个任务 · 预计 ${Math.max(2, sequence % 8)} 分钟`, tone: "waiting" };
    if (task.status === "执行中") return { label: "正在执行", detail: "已进入影刀执行队列", tone: "running" };
    if (task.status === "创建成功") return { label: "已执行完成", detail: "无需排队", tone: "done" };
    if (task.status === "异常") return { label: "队列中断", detail: "等待处理后可重新入队", tone: "failed" };
    return { label: "已移出队列", detail: "本次任务未继续执行", tone: "stopped" };
  }

  function getTaskOwner(task: typeof tasks[number]) {
    const owner = (task as typeof task & { owner?: string }).owner;
    if (owner) return owner;
    if (task.created === "刚刚") return currentOperator;
    return Number(task.id.slice(-2)) % 3 === 0 ? "林晓婷" : "陈旭光";
  }

  function getBusinessExecution(task: typeof tasks[number]) {
    if (task.status === "创建成功") return { title: "执行成功", detail: "已完成定向链接创建", tone: "success" };
    if (task.status === "异常") return { title: "执行失败", detail: "原因：影刀执行异常", tone: "failed" };
    if (task.status === "执行中") return { title: "正在创建定向链接", detail: "影刀任务正在执行中", tone: "running" };
    if (task.status === "已停止") return { title: "执行已停止", detail: "任务已由人工停止，已处理数据继续保留", tone: "stopped" };
    return { title: "等待执行", detail: "任务已提交，等待影刀受理", tone: "queued" };
  }

  function submitTask() {
    const creatorsToCreate = parsedCreators.length ? parsedCreators : form.uid.trim() ? [{ creator: form.creator || "未命名达人", douyinId: form.douyinId, uid: form.uid }] : [];
    if (!taskName.trim() || !form.productId.trim() || !form.product.trim() || !form.commission.trim() || !creatorsToCreate.length) { notify("请输入可匹配的定向商品ID，并至少提供一个达人UID", "warning"); return; }
    if (creatorsToCreate.length > 100) { notify("单次最多支持100个达人，请拆分后重新创建任务。", "warning"); return; }
    setSubmitConfirmation({ creators: creatorsToCreate, product: form.product || `商品ID：${form.productId}`, store: form.store || "—", count: creatorsToCreate.length });
  }
  function confirmSubmitTask() {
    if (!submitConfirmation) return;
    const { creators: creatorsToCreate } = submitConfirmation;
    const newTask = { id: `DL20260818${String(tasks.length + 39).padStart(3, "0")}`, yidaoId: "待 task/newest/list 回查", scheduleUuid: form.scheduleUuid, creator: creatorsToCreate.length === 1 ? creatorsToCreate[0].creator : `${creatorsToCreate.length} 位达人`, douyinId: creatorsToCreate[0]?.douyinId ?? "", uid: creatorsToCreate.map((creator) => creator.uid).join(","), uidCount: creatorsToCreate.length, uidList: creatorsToCreate.map((creator) => creator.uid), product: form.product || `商品ID：${form.productId}`, store: form.store || "—", productId: form.productId || "—", commission: `${form.commission.replace("%", "")}%`, remark: `${taskName}${form.remark ? ` · ${form.remark}` : ""}`, created: "刚刚", status: "待回查", api: "task/start 已受理" };
    setTasks((current) => [newTask, ...current]); setSubmitConfirmation(null); setCreateOpen(false); setTab("tasks"); setBulkText(""); setParsedCreators([]); setTaskName(`${today} 第${Math.floor(tasks.length / 20) + 2}批`); setForm({ scheduleUuid: "SCH-DIRECT-LINK-01", creator: "", douyinId: "", uid: "", product: "", store: "", productId: "", remark: "", commission: "" }); notify(`已触发 1 次批量添加任务（${creatorsToCreate.length} 位达人），正在回查影刀 Task UUID`, "success");
  }
  function parseBulkText() { const values = bulkText.split(/\n|；|;|，|,/).map((value) => value.trim()).filter(Boolean); if (values.length > 100) { setParsedCreators([]); notify("单次最多支持100个达人，请拆分后重新创建任务。", "warning"); return; } const rows = values.map((uid) => ({ creator: "未命名达人", douyinId: "", uid })); setParsedCreators(rows); notify(`已识别达人：${rows.length} 个，请确认后创建`, "success"); }
  function stopTask(id: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, status: "已停止", api: "task/stop 成功" } : task)); setDetailId(null); notify("已停止该常规任务下所有未结束的影刀Job", "success"); }
  function checkLinkTask(id: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, yidaoId: "TASK-20260818-01129", status: "排队中", api: "task/query 已入队" } : task)); notify("已完成影刀任务回查，任务已进入执行队列", "success"); }
  function retryLinkTask(id: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, status: "排队中", api: "task/start 已重新入队", created: "刚刚" } : task)); notify("已重新触发影刀常规任务，等待队列执行", "success"); }
  function copyDirectedLink(id: string) { const task = tasks.find((item) => item.id === id); navigator.clipboard.writeText(`https://haohuo.jinritemai.com/ecommerce/trade/creator/link/${task?.uid ?? id}`); notify("定向链接已复制", "success"); }

  return <>
    <header className="page-header link-head"><div><h1>定向链接自动化</h1><p>触发影刀已预配置的常规任务，并在内容罗盘内回查、监控和停止任务。</p></div><div className="header-actions"><button className="primary-button" onClick={() => setCreateOpen(true)}>＋ 创建链接任务</button></div></header>
    <section className="link-kpis"><article><span className="link-kpi-icon violet">今</span><div><small>今日已发送任务</small><strong>{tasks.length + 28}</strong><em>影刀API调用成功率 96.8%</em></div></article><article><span className="link-kpi-icon cyan">行</span><div><small>执行中的影刀任务</small><strong>{tasks.filter((task) => task.status === "执行中").length}</strong><em>可随时查询或停止</em></div></article><article><span className="link-kpi-icon green">成</span><div><small>创建成功</small><strong>36</strong><em>已通过业务结果校验</em></div></article><article><span className="link-kpi-icon red">异</span><div><small>异常任务</small><strong>{tasks.filter((task) => task.status === "异常").length}</strong><em>需要检查影刀执行结果</em></div></article></section>
    <section className="panel link-panel"><div className="link-tabs"><div className="tabs"><button aria-pressed={tab === "tasks"} className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>常规任务监控 <span>{tasks.length}</span></button><button aria-pressed={tab === "records"} className={tab === "records" ? "active" : ""} onClick={() => setTab("records")}>API调用记录 <span>{tasks.length + 8}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>{tab === "tasks" ? <><div className="link-filter"><div>{["全部", "待回查", "执行中", "创建成功", "异常", "已停止"].map((status) => <button key={status} aria-pressed={statusFilter === status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><button onClick={() => notify("已请求 task/query 刷新任务状态", "success")}>↻ 同步影刀状态</button></div><div className="table-wrap link-table"><table><thead><tr><th>内容罗盘任务</th><th>影刀 Task UUID</th><th>达人</th><th>商品 / 店铺</th><th>定向商品ID</th><th>佣金系数</th><th>API状态</th><th>任务状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><button className="table-link" onClick={() => setDetailId(task.id)}>{task.id}</button></td><td><code>{task.yidaoId}</code></td><td><div className="link-creator"><strong>{task.creator}</strong><small>{task.douyinId} · {task.uid}</small></div></td><td><div className="link-product"><strong>{task.product}</strong><small>{task.store}</small></div></td><td><code>{task.productId}</code></td><td><strong>{task.commission}</strong></td><td><span className={`api-status ${task.api.includes("异常") ? "failed" : task.api === "已发送" ? "sending" : "success"}`}>{task.api}</span></td><td><span className={`link-status ${task.status === "异常" ? "failed" : task.status === "执行中" ? "running" : task.status === "已停止" ? "stopped" : "success"}`}>{task.status}</span></td><td>{task.created}</td><td><button className="row-action" onClick={() => setDetailId(task.id)}>查看</button></td></tr>)}</tbody></table></div></> : <ApiRecords tasks={tasks} notify={notify} />}</section>
    {createOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="link-create-modal link-create-batch" role="dialog" aria-modal="true" aria-labelledby="link-create-title"><header><div><small>批量创建定向链接</small><h2 id="link-create-title">定向链接自动化任务</h2><p>先关联影刀常规任务，再录入本次公共商品信息和一个或多个达人。</p></div><button onClick={() => setCreateOpen(false)} aria-label="关闭">×</button></header><div className="link-form"><label>影刀常规任务<span>*</span><select value={form.scheduleUuid} onChange={(event) => setForm({ ...form, scheduleUuid: event.target.value })}><option value="SCH-DIRECT-LINK-01">定向链接创建 · 家电类</option><option value="SCH-DIRECT-LINK-02">定向链接创建 · 厨电类</option><option value="SCH-DIRECT-LINK-03">定向链接创建 · 直播专场</option></select></label><label>定向链接自动化任务名称<span>*</span><input value={taskName} onChange={(event) => setTaskName(event.target.value)} /></label><label>商品（与商品ID二选一）<input value={form.product} onChange={(event) => setForm({ ...form, product: event.target.value })} placeholder="输入商品名称" /></label><label>定向商品ID（与商品二选一）<input value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} placeholder="输入精选联盟商品ID" /></label><label>商品店铺<input value={form.store} onChange={(event) => setForm({ ...form, store: event.target.value })} placeholder="输入商品所属店铺" /></label><label>指定佣金系数（正常价格）<span>*</span><div className="commission-input"><input value={form.commission} onChange={(event) => setForm({ ...form, commission: event.target.value })} placeholder="例如：25" /><em>%</em></div></label><div className="creator-entry full"><div className="entry-tabs"><button className={entryMode === "ai" ? "active" : ""} onClick={() => setEntryMode("ai")}>AI整段解析</button><button className={entryMode === "paste" ? "active" : ""} onClick={() => setEntryMode("paste")}>批量粘贴 / 表格导入</button><button className={entryMode === "single" ? "active" : ""} onClick={() => setEntryMode("single")}>单个录入</button></div>{entryMode !== "single" ? <><textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder={entryMode === "ai" ? "例如：找小家电研究所、洁净生活家做创维循环扇定向链接，佣金25%。也可以无序输入一整段需求。" : "请填写达人UID，支持批量粘贴，请用英文逗号（,）隔开，每次最多支持100个"} /><div className="entry-actions"><button onClick={parseBulkText}>{entryMode === "ai" ? "AI解析信息" : "解析粘贴内容"}</button><button onClick={() => { setBulkText("小家电研究所，xiaojd_lab，dy_86541972\n洁净生活家，clean_life，dy_10376294"); setEntryMode("paste"); }}>⇧ 导入表格（演示）</button></div></> : <div className="single-creator"><label>达人UID<span>*</span><input value={form.uid} onChange={(event) => setForm({ ...form, uid: event.target.value })} placeholder="必填" /></label><label>达人昵称<input value={form.creator} onChange={(event) => setForm({ ...form, creator: event.target.value })} placeholder="选填" /></label><label>达人抖音ID<input value={form.douyinId} onChange={(event) => setForm({ ...form, douyinId: event.target.value })} placeholder="选填" /></label></div>}{parsedCreators.length > 0 && <div className="parsed-summary">已识别达人：<strong>{parsedCreators.length}</strong> 个 · 预计执行：<strong>1 次批量添加任务</strong></div>}</div><label className="full">特殊备注<textarea value={form.remark} onChange={(event) => setForm({ ...form, remark: event.target.value })} placeholder="可选，传递给影刀执行人员的特殊说明" /></label><div className="api-contract-note"><span>API</span><p>系统将调用固定影刀常规任务，按一次批量添加提交达人UID，并通过 task/newest/list 回查 Task UUID。</p></div></div><footer><button className="ghost-button" onClick={() => setCreateOpen(false)}>取消</button><button className="primary-button" onClick={submitTask}>创建并调用影刀</button></footer></section></div>}
    {submitConfirmation && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSubmitConfirmation(null); }}><section className="link-submit-confirm" role="dialog" aria-modal="true" aria-labelledby="link-submit-confirm-title"><header><div><small>执行前确认</small><h2 id="link-submit-confirm-title">确认创建定向链接任务</h2><p>确认后将调用固定影刀 SOP，提交一次批量添加任务。</p></div><button onClick={() => setSubmitConfirmation(null)} aria-label="关闭">×</button></header><div className="link-submit-confirm-body"><div><small>商品</small><strong>{submitConfirmation.product}</strong></div><div><small>店铺</small><strong>{submitConfirmation.store}</strong></div><div><small>达人数量</small><strong>{submitConfirmation.count} 个</strong></div><div><small>预计执行</small><strong>1 次批量添加任务</strong></div></div><footer><button className="ghost-button" onClick={() => setSubmitConfirmation(null)}>取消</button><button className="primary-button" onClick={confirmSubmitTask}>确认创建并调用影刀</button></footer></section></div>}
    {detail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="link-detail-drawer" role="dialog" aria-modal="true" aria-label="影刀任务详情"><header><div><small>影刀任务详情</small><h2>{detail.id}</h2><p>影刀任务：{detail.yidaoId}</p></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className={`link-result-hero ${detail.status === "异常" ? "failed" : detail.status === "执行中" ? "running" : "success"}`}><span>{detail.status === "执行中" ? "◌" : detail.status === "异常" ? "!" : "✓"}</span><div><strong>{detail.status}</strong><small>影刀API状态：{detail.api}</small></div></div><section className="detail-section"><h3>任务参数</h3><div className="task-detail-grid"><div><small>达人昵称</small><strong>{detail.creator}</strong></div><div><small>达人抖音ID</small><strong>{detail.douyinId}</strong></div><div><small>达人UID</small><strong>{detail.uid}</strong></div><div><small>指定佣金系数</small><strong>{detail.commission}</strong></div><div><small>商品</small><strong>{detail.product}</strong></div><div><small>商品店铺</small><strong>{detail.store}</strong></div><div><small>定向商品ID</small><strong>{detail.productId}</strong></div><div><small>特殊备注</small><strong>{detail.remark || "—"}</strong></div></div></section><section className="detail-section"><h3>影刀执行记录</h3><div className="yidao-log"><div><span>10:18:02</span><p><strong>请求已发送</strong> 内容罗盘向影刀定制API提交任务参数</p></div><div><span>10:18:04</span><p><strong>影刀已受理</strong> 返回影刀任务ID：{detail.yidaoId}</p></div><div><span>10:18:10</span><p><strong>状态同步</strong> 当前任务状态：{detail.status}</p></div></div></section></div><footer><button className="ghost-button" onClick={() => notify("已向影刀查询最新任务详情", "success")}>查询最新状态</button>{detail.status === "执行中" && <button className="stop-button" onClick={() => stopTask(detail.id)}>停止任务</button>}</footer></aside></div>}
  </>;
}

function ApiRecords({ tasks, notify }: { tasks: Array<{ id: string; yidaoId: string; created: string; api: string; status: string }>; notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void }) {
  const [selectedRecord, setSelectedRecord] = useState<{ task: typeof tasks[number]; index: number } | null>(null);
  const requestId = selectedRecord ? `REQ-20260818-${String(selectedRecord.index + 1128).padStart(5, "0")}` : "";
  const requestPayload = selectedRecord ? JSON.stringify({ requestId, taskName: selectedRecord.task.id, scheduleUuid: "SCH-DIRECT-LINK-01", creatorUid: `uid_${selectedRecord.task.id.slice(-4)}`, callback: "task/newest/list" }, null, 2) : "";
  const responsePayload = selectedRecord ? JSON.stringify(selectedRecord.task.api.includes("异常") ? { code: 40012, message: "定向商品参数校验失败", data: null, requestId } : { code: 0, message: "success", data: { taskUuid: selectedRecord.task.yidaoId, status: selectedRecord.task.status }, requestId }, null, 2) : "";
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".api-record-table .table-link"));
    const handlers = buttons.map((button) => {
      const handler = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
        document.dispatchEvent(new CustomEvent("link-task-detail", { detail: button.textContent }));
      };
      button.addEventListener("click", handler, true);
      return { button, handler };
    });
    return () => handlers.forEach(({ button, handler }) => button.removeEventListener("click", handler, true));
  }, [tasks]);
  useEffect(() => {
    const table = document.querySelector<HTMLElement>(".api-record-table table");
    const header = table?.querySelector("thead tr");
    if (!table || !header) return;
    const linkedHeader = Array.from(header.querySelectorAll("th")).find((cell) => cell.textContent === "关联内容罗盘任务");
    if (linkedHeader) linkedHeader.textContent = "执行任务编号";
    if (!header.querySelector("[data-business-api-columns]")) {
      const marker = document.createElement("th");
      marker.dataset.businessApiColumns = "true";
      marker.textContent = "商品名称";
      const count = document.createElement("th");
      count.dataset.businessApiColumns = "true";
      count.textContent = "达人数量";
      const creator = document.createElement("th");
      creator.dataset.businessApiColumns = "true";
      creator.textContent = "创建人";
      const action = header.lastElementChild;
      action?.before(marker, count, creator);
    }
    table.querySelectorAll<HTMLTableRowElement>("tbody tr").forEach((row, index) => {
      row.querySelectorAll("[data-business-api-cell]").forEach((cell) => cell.remove());
      const task = tasks[index] as typeof tasks[number] & { product?: string; uid?: string; creator?: string };
      if (!task) return;
      const product = document.createElement("td");
      product.dataset.businessApiCell = "true";
      product.textContent = task.product ?? "—";
      const count = document.createElement("td");
      count.dataset.businessApiCell = "true";
      count.textContent = `${task.uid?.split(",").filter(Boolean).length || 1} 个`;
      const creator = document.createElement("td");
      creator.dataset.businessApiCell = "true";
      creator.textContent = task.creator && task.creator !== "未命名达人" ? task.creator : Number(task.id.slice(-2)) % 3 === 0 ? "林晓婷" : "陈旭光";
      row.lastElementChild?.before(product, count, creator);
    });
  }, [tasks]);
  return <><div className="api-records"><div className="api-record-note"><span>API</span><p>此处记录内容罗盘向影刀定制API发起的调用，以及影刀返回的响应状态。</p></div><div className="table-wrap api-record-table"><table><thead><tr><th>调用时间</th><th>请求编号</th><th>接口名称</th><th>关联内容罗盘任务</th><th>影刀任务ID</th><th>响应状态</th><th>耗时</th><th>操作</th></tr></thead><tbody>{tasks.map((task, index) => <tr key={task.id}><td>{task.created}</td><td><code>REQ-20260818-{String(index + 1128).padStart(5, "0")}</code></td><td><strong>createDirectedLinkTask</strong></td><td><button className="table-link" onClick={() => notify(`已定位任务 ${task.id}`)}>{task.id}</button></td><td><code>{task.yidaoId}</code></td><td><span className={`api-status ${task.api.includes("异常") ? "failed" : task.api === "已发送" ? "sending" : "success"}`}>{task.api}</span></td><td>{index % 2 ? "1.28s" : "0.86s"}</td><td><button className="row-action" onClick={() => setSelectedRecord({ task, index })}>查看报文</button></td></tr>)}</tbody></table></div></div>{selectedRecord && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRecord(null); }}><section className="api-payload-modal" role="dialog" aria-modal="true" aria-label="API调用报文"><header><div><small>API 调用报文</small><h2>{requestId}</h2><p>createDirectedLinkTask · {selectedRecord.task.created}</p></div><button onClick={() => setSelectedRecord(null)} aria-label="关闭">×</button></header><div className="api-payload-body"><section><div><h3>请求参数</h3><button onClick={async () => { await navigator.clipboard.writeText(requestPayload); notify("请求报文已复制", "success"); }}>复制</button></div><pre>{requestPayload}</pre></section><section><div><h3>响应结果</h3><button onClick={async () => { await navigator.clipboard.writeText(responsePayload); notify("响应报文已复制", "success"); }}>复制</button></div><pre>{responsePayload}</pre></section></div><footer><button className="ghost-button" onClick={() => setSelectedRecord(null)}>关闭</button></footer></section></div>}</>;
}
