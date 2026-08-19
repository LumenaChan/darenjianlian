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
  { id: 1, tone: "danger", title: "定向链接执行异常", meta: "8 条任务等待处理", action: "去处理" },
  { id: 2, tone: "warning", title: "抓取任务部分失败", meta: "蝉妈妈 · 直播达人 · 32 条失败", action: "查看原因" },
  { id: 3, tone: "brand", title: "待分配达人较多", meta: "126 位达人进入待分配清单", action: "去分配" },
  { id: 4, tone: "neutral", title: "建联状态长时间未更新", meta: "3 个批次超过 3 天未更新", action: "去跟进" },
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
  { id: "c6", name: "暖暖的居家日记", uid: "dy_31562099", initials: "暖", type: "短视频", followers: "29.1万", gmv: "52.4万", category: "居家生活", price: "200–500元", score: 79, source: "精选联盟", update: "08:56", avatar: "yellow", history: "无历史" },
  { id: "c7", name: "阿布家电实验室", uid: "dy_65790218", initials: "布", type: "短视频", followers: "64.7万", gmv: "110.3万", category: "家电测评", price: "500–1000元", score: 91, source: "蝉妈妈", update: "08:43", avatar: "purple", history: "A级合作" },
  { id: "c8", name: "收纳研究员", uid: "dy_24680137", initials: "纳", type: "短视频", followers: "36.2万", gmv: "64.8万", category: "清洁收纳", price: "100–300元", score: 82, source: "精选联盟", update: "08:35", avatar: "green", history: "历史建联" },
  { id: "c9", name: "家电阿喵", uid: "dy_91043726", initials: "喵", type: "短视频", followers: "18.6万", gmv: "38.7万", category: "家电测评", price: "200–500元", score: 76, source: "蝉妈妈", update: "08:21", avatar: "pink", history: "无历史" },
  { id: "c10", name: "生活电器大玩家", uid: "dy_82076419", initials: "玩", type: "短视频", followers: "95.3万", gmv: "167.9万", category: "居家生活", price: "300–800元", score: 89, source: "精选联盟", update: "08:07", avatar: "blue", history: "S级合作" },
  { id: "c11", name: "小周直播选品", uid: "dy_54290168", initials: "周", type: "直播", followers: "47.6万", gmv: "228.4万", category: "家居百货", price: "200–500元", score: 83, source: "精选联盟", update: "09:01", avatar: "yellow", history: "无历史" },
  { id: "c12", name: "小李的家电局", uid: "dy_69012457", initials: "李", type: "直播", followers: "88.2万", gmv: "462.1万", category: "数码家电", price: "500–1000元", score: 94, source: "竞品抓取", update: "08:49", avatar: "blue", history: "历史建联" },
  { id: "c13", name: "好物严选直播间", uid: "dy_23876410", initials: "选", type: "直播", followers: "32.5万", gmv: "145.8万", category: "居家生活", price: "100–300元", score: 80, source: "蝉妈妈", update: "08:31", avatar: "orange", history: "无历史" },
  { id: "c14", name: "乐妈家居直播", uid: "dy_76129840", initials: "乐", type: "直播", followers: "66.9万", gmv: "278.6万", category: "家居百货", price: "300–800元", score: 87, source: "竞品抓取", update: "08:12", avatar: "pink", history: "A级合作" },
  { id: "c15", name: "实用家电直播站", uid: "dy_18429650", initials: "实", type: "直播", followers: "40.8万", gmv: "156.2万", category: "数码家电", price: "200–500元", score: 78, source: "精选联盟", update: "07:58", avatar: "green", history: "无历史" },
];

type OutreachStage = "未建联" | "已分配" | "已添加" | "已同意" | "已回复" | "达成意向";
type OutreachRecord = { stage: OutreachStage; assignedAt?: string; assignedBy?: string; owner?: string; batch?: string; batchSize?: number; batchCreatedAt?: string; taskId?: string; product?: string; addedAt?: string; agreedAt?: string; repliedAt?: string; intentAt?: string; note?: string };

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
  c13: { stage: "未建联" }, c14: { stage: "已添加", assignedAt: "2026-08-18 09:15", assignedBy: "陈旭光", owner: "陈小雨", batch: "FP20260818007", batchSize: 120, batchCreatedAt: "2026-08-18 09:15", taskId: "CT202608180088", product: "创维循环扇", addedAt: "2026-08-18 16:18", note: "已添加，待对方通过。" }, c15: { stage: "未建联" },
};

const creatorRows = creators.map((creator, index) => ({
  ...creator,
  settlement: index === 0 ? "25万-50万" : ["50万-100万", "25万-50万", "10万-25万", "100万-200万"][index % 4],
  live: index === 0 ? "5000-7500 (51%)" : `${3200 + (index % 6) * 700}-${5200 + (index % 6) * 700} (${42 + (index % 8)}%)`,
  video: index === 0 ? "5000-7500 (45%)" : `${2800 + (index % 5) * 650}-${4800 + (index % 5) * 650} (${38 + (index % 9)}%)`,
  products: index === 0 ? 150 : 72 + (index % 8) * 13,
  stores: index === 0 ? 64 : 28 + (index % 7) * 6,
  contactStatus: outreachRecords[creator.id].stage,
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

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState("工作台");
  const [period, setPeriod] = useState<7 | 30>(7);
  const [tasks, setTasks] = useState(taskSeed);
  const [toast, setToast] = useState<Toast>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [refreshed, setRefreshed] = useState("10:30");

  const metrics = useMemo(() => period === 7 ? [
    { label: "达人总数", value: "128,642", detail: "较上周 +4,286", trend: "+3.4%", icon: "达", color: "violet" },
    { label: "今日新增达人", value: "1,183", detail: "短视频 846 · 直播 337", trend: "+12.6%", icon: "新", color: "cyan" },
    { label: "待分配达人", value: "126", detail: "来自 4 个筛选清单", trend: "需处理", icon: "分", color: "orange" },
    { label: "链接异常任务", value: "8", detail: "参数异常 3 · 执行失败 5", trend: "较昨日 -3", icon: "链", color: "red" },
  ] : [
    { label: "达人总数", value: "128,642", detail: "近30天 +18,620", trend: "+16.9%", icon: "达", color: "violet" },
    { label: "本月新增达人", value: "18,620", detail: "短视频 13,482 · 直播 5,138", trend: "+21.4%", icon: "新", color: "cyan" },
    { label: "待分配达人", value: "126", detail: "来自 4 个筛选清单", trend: "需处理", icon: "分", color: "orange" },
    { label: "链接异常任务", value: "8", detail: "本月累计已处理 42 条", trend: "解决率 84%", icon: "链", color: "red" },
  ], [period]);

  const funnelComparison = useMemo(() => period === 7 ? [
    { label: "本周", caption: "近7天", tone: "current", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 74 }, { label: "已同意", percentage: 54 }, { label: "已回复", percentage: 38 }, { label: "达成意向", percentage: 22 }] },
    { label: "上周", caption: "前7天", tone: "previous", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 71 }, { label: "已同意", percentage: 50 }, { label: "已回复", percentage: 33 }, { label: "达成意向", percentage: 17 }] },
  ] : [
    { label: "本周期", caption: "近30天", tone: "current", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 75 }, { label: "已同意", percentage: 56 }, { label: "已回复", percentage: 41 }, { label: "达成意向", percentage: 24 }] },
    { label: "上一周期", caption: "前30天", tone: "previous", stages: [{ label: "进入建联", percentage: 100 }, { label: "已添加", percentage: 72 }, { label: "已同意", percentage: 51 }, { label: "已回复", percentage: 35 }, { label: "达成意向", percentage: 19 }] },
  ], [period]);

  function notify(message: string, tone: NonNullable<Toast>["tone"] = "default") {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 2400);
  }

  function finishTask(id: number) {
    const target = tasks.find((task) => task.id === id);
    setTasks((current) => current.filter((task) => task.id !== id));
    notify(`${target?.title ?? "待办"}已进入处理流程`, "success");
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
                <button key={item} className={`nav-item ${item === currentView ? "active" : ""}`} onClick={() => ["工作台", "达人库", "达人采集", "建联管理", "历史达人分析", "定向链接自动化"].includes(item) ? setCurrentView(item) : notify(`${item}页面将在下一步继续设计`)}>
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
            <button className="primary-button" onClick={() => setQuickOpen(true)}>＋ 快捷操作</button>
          </div>
        </header>

        <div className="context-row">
          <div className="date-chip"><span>今天</span> 2026年8月18日 · 星期二</div><div className="refresh-note">数据更新于 {refreshed}</div>
          <div className="period-switch" aria-label="统计周期"><button aria-pressed={period === 7} className={period === 7 ? "active" : ""} onClick={() => setPeriod(7)}>近7天</button><button aria-pressed={period === 30} className={period === 30 ? "active" : ""} onClick={() => setPeriod(30)}>近30天</button></div>
        </div>

        <section className="metric-grid" aria-label="核心指标">
          {metrics.map((metric) => <article className="metric-card" key={metric.label}><div className={`metric-icon ${metric.color}`}>{metric.icon}</div><div className="metric-main"><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></div><span className={`metric-trend ${metric.color}`}>{metric.trend}</span></article>)}
        </section>

        <section className="dashboard-grid top-grid">
          <article className="panel funnel-panel">
            <div className="panel-head"><div><h2>建联转化漏斗</h2><p>本周期内进入建联流程的达人节点转化情况</p></div><button className="text-button" onClick={() => setCurrentView("建联管理")}>查看全部 <span>→</span></button></div>
            <div className="funnel-summary">
              <div><strong>{period === 7 ? "1,268" : "5,486"}</strong><span>进入建联</span></div><i>→</i>
              <div><strong>{period === 7 ? "943" : "4,102"}</strong><span>已添加</span><small>74.4%</small></div><i>→</i>
              <div><strong>{period === 7 ? "511" : "2,296"}</strong><span>已同意</span><small>54.2%</small></div><i>→</i>
              <div><strong>{period === 7 ? "286" : "1,147"}</strong><span>已回复</span><small>56.0%</small></div><i>→</i>
              <div className="success-stage"><strong>{period === 7 ? "89" : "372"}</strong><span>达成意向</span><small>31.1%</small></div>
            </div>
            <div className="funnel-compare" aria-label={period === 7 ? "本周与上周建联转化漏斗对比" : "本周期与上一周期建联转化漏斗对比"}>
              {funnelComparison.map((funnel) => <section className={`funnel-chart ${funnel.tone}`} key={funnel.label}>
                <div className="funnel-chart-head"><strong>{funnel.label}</strong><span>{funnel.caption}</span></div>
                <div className="funnel-bars">{funnel.stages.map((stage) => <div key={stage.label} style={{ width: `${stage.percentage}%` }}><span>{stage.label}</span><small>{stage.percentage}%</small></div>)}</div>
              </section>)}
            </div>
            <div className="funnel-insight"><span>↑</span><p><strong>{period === 7 ? "本周建联效率提升" : "本周期建联效率提升"}</strong> 从“已回复”到“达成意向”的转化率较{period === 7 ? "上周" : "上一周期"}提升 4.8%。</p></div>
          </article>

          <article className="panel todo-panel">
            <div className="panel-head"><div><h2>今日待办</h2><p>优先处理会阻塞业务进度的事项</p></div><span className="count-badge">{tasks.length}</span></div>
            <div className="todo-list">{tasks.length ? tasks.map((task) => <div className="todo-item" key={task.id}><span className={`todo-signal ${task.tone}`} /><div><strong>{task.title}</strong><small>{task.meta}</small></div><button onClick={() => finishTask(task.id)}>{task.action}</button></div>) : <div className="empty-state"><span>✓</span><strong>今日待办已处理完成</strong><small>新的异常或任务会出现在这里</small></div>}</div>
          </article>
        </section>

        <section className="dashboard-grid bottom-grid">
          <article className="panel batch-panel">
            <div className="panel-head"><div><h2>近期分配批次</h2><p>关注批次执行进度与商务跟进情况</p></div><button className="text-button" onClick={() => setCurrentView("建联管理")}>查看全部 <span>→</span></button></div>
            <div className="table-wrap"><table><thead><tr><th>批次编号</th><th>推广商品</th><th>负责商务</th><th>达人</th><th>已添加</th><th>已回复</th><th>达成意向</th><th>进度</th><th>操作</th></tr></thead><tbody>{batches.map((batch) => { const progress = Math.round(batch.added / batch.count * 100); return <tr key={batch.id}><td><button className="table-link" onClick={() => notify(`查看批次 ${batch.id}`)}>{batch.id}</button></td><td><strong>{batch.product}</strong></td><td>{batch.owner}</td><td>{batch.count}</td><td>{batch.added}</td><td>{batch.replied}</td><td>{batch.intent}</td><td><div className="progress-cell"><span><i style={{ width: `${progress}%` }} /></span><small>{progress}%</small></div></td><td><button className="row-action" onClick={() => notify(`已打开 ${batch.id} 的详情`)}>查看</button></td></tr>; })}</tbody></table></div>
          </article>

          <article className="panel activity-panel">
            <div className="panel-head"><div><h2>最新动态</h2><p>系统关键动作与数据变化</p></div></div>
            <div className="activity-list">{activities.map((item) => <div className="activity-item" key={`${item.time}-${item.title}`}><div className="activity-time">{item.time}</div><div className="activity-icon">{item.icon}</div><div><strong>{item.title}</strong><small>{item.text}</small></div></div>)}</div>
          </article>
        </section>

        <footer className="prototype-note">工作台数据均为原型演示数据 · 最终指标口径待业务确认</footer>
        </> : currentView === "达人库" ? <CreatorLibrary notify={notify} onBack={() => setCurrentView("工作台")} /> : currentView === "达人采集" ? <CreatorCollection notify={notify} onBack={() => setCurrentView("工作台")} /> : currentView === "建联管理" ? <ContactManagement notify={notify} onBack={() => setCurrentView("工作台")} /> : currentView === "历史达人分析" ? <HistoricalAnalysis notify={notify} onBack={() => setCurrentView("工作台")} /> : <LinkAutomation notify={notify} onBack={() => setCurrentView("工作台")} />}
      </section>

      {quickOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setQuickOpen(false); }}><section className="quick-modal" role="dialog" aria-modal="true" aria-labelledby="quick-title"><header><div><span>快捷操作</span><h2 id="quick-title">你想先做什么？</h2></div><button onClick={() => setQuickOpen(false)} aria-label="关闭">×</button></header><div className="quick-grid">
        <button onClick={() => { setQuickOpen(false); setCurrentView("达人库"); }}><span className="quick-icon violet">达</span><strong>筛选达人</strong><small>从达人库筛选并加入待分配清单</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); setCurrentView("建联管理"); }}><span className="quick-icon cyan">分</span><strong>创建分配批次</strong><small>将已选达人分配给指定商务</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); setCurrentView("定向链接自动化"); }}><span className="quick-icon orange">链</span><strong>创建定向链接</strong><small>录入达人UID并调用影刀执行</small><i>→</i></button>
        <button onClick={() => { setQuickOpen(false); setCurrentView("历史达人分析"); }}><span className="quick-icon green">导</span><strong>导入历史数据</strong><small>上传并匹配公司历史成交达人</small><i>→</i></button>
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
  const [categoryFilter, setCategoryFilter] = useState("全部类目");
  const [minScore, setMinScore] = useState("不限");
  const [historyFilter, setHistoryFilter] = useState("不限");
  const [sortKey, setSortKey] = useState<"AI匹配度" | "粉丝量" | "近30天结算">("AI匹配度");
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<"overview" | "relations" | "history">("overview");
  const pageSize = 5;

  const visibleCreators = useMemo(() => creatorRows.filter((creator) => {
    const matchText = `${creator.name}${creator.uid}${creator.category}`.toLowerCase().includes(query.toLowerCase());
    const matchSource = sourceFilter === "全部来源" || creator.source === sourceFilter;
    const matchCategory = categoryFilter === "全部类目" || creator.category === categoryFilter;
    const matchScore = minScore === "不限" || creator.score >= Number(minScore);
    const matchHistory = historyFilter === "不限" || (historyFilter === "有建联记录" ? creator.contactStatus !== "未建联" : creator.contactStatus === "未建联");
    const matchTab = creatorType === "竞品达人" ? creator.type === "直播" && creator.source === "竞品抓取" : creator.type === creatorType;
    return matchTab && matchText && matchSource && matchCategory && matchScore && matchHistory;
  }).sort((a, b) => {
    const asNumber = (value: string) => Number(value.replace("万", "").match(/[\d.]+/)?.[0] ?? 0);
    if (sortKey === "粉丝量") return asNumber(b.followers) - asNumber(a.followers);
    if (sortKey === "近30天结算") return asNumber(b.settlement) - asNumber(a.settlement);
    return b.score - a.score;
  }), [categoryFilter, creatorType, historyFilter, minScore, query, sortKey, sourceFilter]);
  const pageCount = Math.max(1, Math.ceil(visibleCreators.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageCreators = visibleCreators.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allVisibleSelected = pageCreators.length > 0 && pageCreators.every((creator) => selected.includes(creator.id));
  const detailCreator = creatorRows.find((creator) => creator.id === detailId) ?? null;
  const outreach = detailCreator?.outreach;
  const outreachStages: OutreachStage[] = ["已分配", "已添加", "已同意", "已回复", "达成意向"];
  const currentOutreachStage = outreach ? outreachStages.indexOf(outreach.stage) : -1;
  const outreachTimeline = outreach && outreach.stage !== "未建联" ? [
    { label: "已分配建联任务", detail: `${outreach.assignedAt} · ${outreach.assignedBy} 分配给 ${outreach.owner}` },
    outreach.addedAt ? { label: "已添加达人", detail: `${outreach.addedAt} · ${outreach.owner}` } : null,
    outreach.agreedAt ? { label: "达人已同意", detail: `${outreach.agreedAt} · ${outreach.owner}` } : null,
    outreach.repliedAt ? { label: "达人已回复", detail: `${outreach.repliedAt} · ${outreach.owner}` } : null,
    outreach.intentAt ? { label: "达成合作意向", detail: `${outreach.intentAt} · ${outreach.owner}` } : null,
  ].filter((item): item is { label: string; detail: string } => item !== null) : [];

  useEffect(() => {
    const panelId = "creator-real-data-panel";
    document.getElementById(panelId)?.remove();
    if (!detailCreator || detailTab !== "overview") return;
    const drawerBody = document.querySelector(".creator-detail-drawer .drawer-body");
    if (!drawerBody) return;
    const panel = document.createElement("section");
    panel.id = panelId;
    panel.className = "creator-real-data-panel";
    panel.innerHTML = `<h3>采集详情</h3><div class="creator-real-grid"><div><small>平台 / 平台ID</small><strong>${detailCreator.platform} · ${detailCreator.uid}</strong></div><div><small>达人类型</small><strong>${detailCreator.type}达人</strong></div><div><small>店铺名称</small><strong>${detailCreator.storeName}</strong></div><div><small>来源渠道</small><strong>${detailCreator.source}</strong></div><div><small>微信</small><div class="creator-contact-value"><strong>${detailCreator.wechat || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.wechat}" aria-label="复制微信" title="复制微信" ${detailCreator.wechat ? "" : "disabled"}>⧉</button></div></div><div><small>手机号</small><div class="creator-contact-value"><strong>${detailCreator.phone || "暂未采集"}</strong><button class="copy-contact" type="button" data-copy="${detailCreator.phone}" aria-label="复制手机号" title="复制手机号" ${detailCreator.phone ? "" : "disabled"}>⧉</button></div></div></div><h3>粉丝画像</h3><p>${detailCreator.audience}</p><div class="creator-ai-warning"><strong>AI匹配度 ${detailCreator.score} · ${detailCreator.score >= 80 ? "建议优先评估" : "建议谨慎评估"}</strong><p>${detailCreator.matchNote}</p></div><small class="creator-real-time">创建于 ${detailCreator.createdAt} · 更新于今天 ${detailCreator.update}</small>`;
    panel.querySelectorAll<HTMLButtonElement>(".copy-contact").forEach((button) => {
      button.addEventListener("click", async () => {
        const value = button.dataset.copy;
        if (!value) return;
        await navigator.clipboard.writeText(value);
        notify(`${button.getAttribute("aria-label")?.replace("复制", "")}已复制`, "success");
      });
    });
    drawerBody.append(panel);
    return () => panel.remove();
  }, [detailCreator, detailTab]);

  function resetPage() { setPage(1); }
  function changeCreatorType(type: "短视频" | "直播" | "竞品达人") { setCreatorType(type); resetPage(); }

  function toggleCreator(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleAll() {
    setSelected((current) => allVisibleSelected ? current.filter((id) => !pageCreators.some((creator) => creator.id === id)) : Array.from(new Set([...current, ...pageCreators.map((creator) => creator.id)])));
  }

  return <>
    <header className="page-header library-head">
      <div><h1>达人库</h1><p>统一沉淀可筛选、可复用的达人资产，批量选择后创建建联任务。</p></div>
      <div className="header-actions"><button className="primary-button" onClick={() => selected.length ? setAssignOpen(true) : notify("请先选择需要建联的达人", "warning")}>＋ 分配建联</button></div>
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

    {selected.length > 0 && <div className="selection-bar"><div><span className="selection-count">{selected.length}</span><strong>已选择 {selected.length} 位达人</strong><small>可跨筛选条件保留选择结果</small></div><div><button className="ghost-button" onClick={() => setSelected([])}>清空选择</button><button className="primary-button" onClick={() => setAssignOpen(true)}>分配建联 <span>→</span></button></div></div>}

    {detailCreator && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="creator-detail-drawer" role="dialog" aria-modal="true" aria-label="达人详情"><header><div><span className={`creator-avatar ${detailCreator.avatar}`}>{detailCreator.initials}</span><div><small>达人详情</small><h2>{detailCreator.name}</h2><p>{detailCreator.uid} · {detailCreator.type}</p></div></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-tabs"><button className={detailTab === "overview" ? "active" : ""} onClick={() => setDetailTab("overview")}>基础信息</button><button className={detailTab === "relations" ? "active" : ""} onClick={() => setDetailTab("relations")}>竞品与来源</button><button className={detailTab === "history" ? "active" : ""} onClick={() => setDetailTab("history")}>建联状态</button></div><div className="drawer-body">{detailTab === "overview" && <><div className="drawer-score"><div className="drawer-score-heading"><span>AI匹配度</span><span className="score-circle large">{detailCreator.score}</span></div><p>基于公开数据表现生成，供业务优先建联参考。</p></div><div className="detail-metrics"><div><small>粉丝量</small><strong>{detailCreator.followers}</strong></div><div><small>近30天结算</small><strong>{detailCreator.settlement}</strong></div><div><small>直播</small><strong>{detailCreator.live}</strong></div><div><small>视频</small><strong>{detailCreator.video}</strong></div><div><small>推广品</small><strong>{detailCreator.products}</strong></div><div><small>合作店</small><strong>{detailCreator.stores}</strong></div><div><small>达人类型 / 类目</small><strong>{detailCreator.type} / {detailCreator.category}</strong></div><div><small>建联状态</small><strong><span className={`history-tag ${detailCreator.contactStatus === "未建联" ? "empty" : ""}`}>{detailCreator.contactStatus}</span></strong></div></div></>}{detailTab === "relations" && <><section className="detail-section"><h3>数据来源</h3><p><span className="source-tag">{detailCreator.source}</span> 已同步达人基础信息和公开带货数据。</p></section><section className="detail-section"><h3>关联竞品</h3><p>{detailCreator.source === "竞品抓取" ? "已命中 2 个竞品商品，可作为优先建联参考。" : "当前未发现竞品商品关联。"}</p></section></>}{detailTab === "history" && outreach && <>{outreach.stage === "未建联" ? <section className="outreach-empty-state"><span>○</span><div><h3>暂未发起建联</h3><p>该达人暂无公司内部建联记录。加入待分配清单后，可在建联管理中创建分配批次并生成任务。</p></div><button className="primary-button" onClick={() => { if (!selected.includes(detailCreator.id)) toggleCreator(detailCreator.id); notify("已加入待分配清单，可继续分配建联", "success"); }}>{selected.includes(detailCreator.id) ? "已在待分配清单" : "加入待分配清单"}</button></section> : <><section className="outreach-status-hero"><div><span className="history-tag">{outreach.stage}</span><strong>{outreach.product}</strong><small>建联任务 {outreach.taskId}</small></div><p>{outreach.note}</p></section><div className="outreach-stepper">{outreachStages.map((stage, index) => <div className={index <= currentOutreachStage ? "done" : ""} key={stage}><i>{index < currentOutreachStage ? "✓" : index + 1}</i><span>{stage}</span></div>)}</div><section className="detail-section"><h3>分配信息</h3><div className="task-detail-grid outreach-detail-grid"><div><small>分配时间</small><strong>{outreach.assignedAt}</strong></div><div><small>分配人</small><strong>{outreach.assignedBy}</strong></div><div><small>负责商务</small><strong>{outreach.owner}</strong></div><div><small>推广商品</small><strong>{outreach.product}</strong></div></div></section><section className="detail-section"><h3>所属批次</h3><div className="outreach-batch-card"><div><strong>{outreach.batch}</strong><small>批量分配 · 共 {outreach.batchSize} 位达人</small></div><span>创建于 {outreach.batchCreatedAt}</span></div></section><section className="detail-section"><h3>流转记录</h3><div className="contact-timeline">{outreachTimeline.map((item) => <div key={item.label}><span>{item.label}</span><small>{item.detail}</small></div>)}</div></section></>}</>}</div><footer><button className="ghost-button" onClick={() => setDetailId(null)}>关闭</button>{detailCreator.contactStatus === "未建联" && <button className="primary-button" onClick={() => { toggleCreator(detailCreator.id); notify(`已${selected.includes(detailCreator.id) ? "移出" : "加入"}待分配清单`, "success"); }}>{selected.includes(detailCreator.id) ? "移出待分配清单" : "加入待分配清单"}</button>}</footer></aside></div>}

    {assignOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setAssignOpen(false); }}><section className="assign-modal" role="dialog" aria-modal="true" aria-labelledby="assign-title"><header><div><small>创建分配批次</small><h2 id="assign-title">将 {selected.length} 位达人分配给商务</h2><p>系统将按“一达人一条建联任务”生成独立任务。</p></div><button onClick={() => setAssignOpen(false)} aria-label="关闭">×</button></header><div className="assign-modal-body"><label>推广商品<select defaultValue=""><option value="" disabled>请选择推广商品</option><option>创维循环扇</option><option>小熊破壁机</option><option>苏泊尔空气炸锅</option></select></label><label>负责商务<select defaultValue=""><option value="" disabled>请选择负责商务</option><option>陈小雨</option><option>林晓婷</option><option>张文豪</option><option>赵明轩</option></select></label><label className="assign-note">备注<textarea placeholder="可选，填写本次建联的补充说明" /></label><div className="assign-warning"><span>i</span><p>已选择的达人中，有 <strong>{selected.filter((id) => creatorRows.find((creator) => creator.id === id)?.contactStatus !== "未建联").length}</strong> 位存在建联记录，提交前可在建联管理中继续核查。</p></div></div><footer><button className="ghost-button" onClick={() => setAssignOpen(false)}>取消</button><button className="primary-button" onClick={() => { setAssignOpen(false); setSelected([]); notify("分配批次已创建，并已生成建联任务", "success"); }}>确认创建</button></footer></section></div>}
  </>;
}

function CreatorCollection({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [tab, setTab] = useState<"configs" | "tasks">("configs");
  const [createOpen, setCreateOpen] = useState(false);
  const [configType, setConfigType] = useState<"短视频达人" | "全量直播达人" | "竞品带货达人">("短视频达人");
  const [creatorTypes, setCreatorTypes] = useState<Array<"视频达人" | "直播达人">>(["视频达人"]);
  const [timeRange, setTimeRange] = useState("近1个月");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [videoGmvOperator, setVideoGmvOperator] = useState<"不限" | "大于等于">("不限");
  const [videoGmvValue, setVideoGmvValue] = useState("");
  const [liveGmvOperator, setLiveGmvOperator] = useState<"不限" | "大于等于">("不限");
  const [liveGmvValue, setLiveGmvValue] = useState("");
  const [taskFilter, setTaskFilter] = useState("全部");
  const [detailTask, setDetailTask] = useState<string | null>(null);
  const [configs, setConfigs] = useState([
    { id: "PC202608001", name: "短视频达人·家居生活", type: "短视频达人", source: "蝉妈妈", scope: "家居生活 / 清洁电器", frequency: "每日 08:00", lastRun: "今天 08:00", status: "启用" },
    { id: "PC202608002", name: "直播达人全量更新", type: "全量直播达人", source: "精选联盟", scope: "全量直播达人", frequency: "每日 06:00", lastRun: "今天 06:03", status: "启用" },
    { id: "PC202608003", name: "循环扇竞品带货达人", type: "竞品带货达人", source: "蝉妈妈", scope: "创维循环扇 · 3 个竞品", frequency: "每周一 09:00", lastRun: "2026-08-17 09:18", status: "启用" },
    { id: "PC202607018", name: "短视频达人·厨房小电", type: "短视频达人", source: "精选联盟", scope: "厨房电器", frequency: "手动执行", lastRun: "2026-08-15 17:42", status: "停用" },
  ].map((config) => ({
    ...config,
    timeRange: config.type.includes("直播") ? "近1个月" : "近30天",
    creatorTypes: config.type.includes("直播") ? ["直播达人"] : ["视频达人"],
    creatorType: config.type.includes("直播") ? "直播达人" : "视频达人",
    videoGmv: config.type.includes("直播") ? "不限" : "≥ 10万",
    liveGmv: config.type.includes("直播") ? "≥ 25万" : "不限",
  })));
  const [tasks, setTasks] = useState([
    { id: "CT20260818026", type: "短视频达人", config: "短视频达人·家居生活", source: "蝉妈妈", start: "今天 08:00", result: "新增 846 · 更新 1,732", failed: 0, status: "已完成" },
    { id: "CT20260818025", type: "全量直播达人", config: "直播达人全量更新", source: "精选联盟", start: "今天 06:03", result: "新增 337 · 更新 674", failed: 0, status: "已完成" },
    { id: "CT20260818024", type: "竞品带货达人", config: "循环扇竞品带货达人", source: "蝉妈妈", start: "今天 02:00", result: "新增 94 · 更新 218", failed: 32, status: "部分失败" },
    { id: "CT20260817021", type: "短视频达人", config: "短视频达人·厨房小电", source: "精选联盟", start: "昨天 17:42", result: "接口请求超时", failed: 0, status: "执行失败" },
  ].map((task) => ({
    ...task,
    timeRange: task.type.includes("直播") ? "近1个月" : "近30天",
    creatorTypes: task.type.includes("直播") ? ["直播达人"] : ["视频达人"],
    creatorType: task.type.includes("直播") ? "直播达人" : "视频达人",
    videoGmv: task.type.includes("直播") ? "不限" : "≥ 10万",
    liveGmv: task.type.includes("直播") ? "≥ 25万" : "不限",
  })));

  const visibleTasks = tasks.filter((task) => taskFilter === "全部" || task.status === taskFilter);
  const currentTask = tasks.find((task) => task.id === detailTask) ?? null;

  function toggleConfig(id: string) {
    setConfigs((current) => current.map((config) => config.id === id ? { ...config, status: config.status === "启用" ? "停用" : "启用" } : config));
    const item = configs.find((config) => config.id === id);
    notify(`${item?.name}已${item?.status === "启用" ? "停用" : "启用"}`, "success");
  }

  function runConfig(configId: string) {
    const config = configs.find((item) => item.id === configId);
    if (!config) return;
    const task = { id: `CT20260818${String(tasks.length + 27).padStart(3, "0")}`, type: config.type, config: config.name, source: config.source, start: "刚刚", result: "正在获取达人数据", failed: 0, status: "执行中", timeRange: config.timeRange, creatorTypes: config.creatorTypes, creatorType: config.creatorTypes.join("、"), videoGmv: config.videoGmv, liveGmv: config.liveGmv };
    setTasks((current) => [task, ...current]);
    setTab("tasks");
    notify("抓取任务已创建，正在执行", "success");
  }

  function createConfig() {
    const savedTimeRange = timeRange === "自定义" && customStart && customEnd ? `${customStart} 至 ${customEnd}` : timeRange;
    const formatGmv = (operator: "不限" | "大于等于", value: string) => operator === "大于等于" && value ? `≥ ${value}万` : "不限";
    const selectedCreatorTypes = configType === "全量直播达人" ? ["直播达人"] : ["视频达人"];
    const next = { id: `PC20260800${configs.length + 4}`, name: `${configType}·新建配置`, type: configType, source: configType === "全量直播达人" ? "精选联盟" : "蝉妈妈", scope: `${savedTimeRange} · ${selectedCreatorTypes.join("、")}`, frequency: "手动执行", lastRun: "暂未执行", status: "启用", timeRange: savedTimeRange, creatorTypes: selectedCreatorTypes, creatorType: selectedCreatorTypes.join("、"), videoGmv: configType === "全量直播达人" ? "不限" : formatGmv(videoGmvOperator, videoGmvValue), liveGmv: configType === "全量直播达人" ? formatGmv(liveGmvOperator, liveGmvValue) : "不限" };
    setConfigs((current) => [next, ...current]);
    setCreateOpen(false);
    notify("采集配置已创建", "success");
  }

  return <>
    <header className="page-header collection-head"><div><h1>达人采集</h1><p>管理抓取配置与执行任务，将外部达人数据持续沉淀到达人库。</p></div><div className="header-actions"><button className="primary-button" onClick={() => setCreateOpen(true)}>＋ 新建采集配置</button></div></header>
    <section className="collection-stat-grid"><article><span className="collection-stat-icon violet">配</span><div><small>启用中的配置</small><strong>{configs.filter((config) => config.status === "启用").length}</strong><em>覆盖 3 类达人采集</em></div></article><article><span className="collection-stat-icon cyan">今</span><div><small>今日抓取达人</small><strong>3,589</strong><em>新增 1,183 · 更新 2,406</em></div></article><article><span className="collection-stat-icon orange">异</span><div><small>待处理异常</small><strong>{tasks.filter((task) => task.status.includes("失败")).length}</strong><em>建议优先检查数据源</em></div></article></section>
    <section className="panel collection-panel"><div className="collection-tabs"><div className="tabs"><button className={tab === "configs" ? "active" : ""} onClick={() => setTab("configs")}>抓取配置 <span>{configs.length}</span></button><button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>抓取任务 <span>{tasks.length}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>
      {tab === "configs" ? <div className="config-list">{configs.map((config) => <article className="config-card" key={config.id}><div className={`config-type type-${config.type.includes("直播") ? "live" : config.type.includes("竞品") ? "competitor" : "video"}`}>{config.type === "短视频达人" ? "短" : config.type === "全量直播达人" ? "播" : "竞"}</div><div className="config-main"><div><h2>{config.name}</h2><span className={`config-status ${config.status === "启用" ? "on" : "off"}`}>{config.status}</span></div><p><span>{config.source}</span><i>·</i>{config.scope}</p><div className="collection-condition-list"><span>类型：<strong>{config.creatorType}</strong></span><span>时间：<strong>{config.timeRange}</strong></span><span>{config.creatorType === "直播达人" ? "近30天直播带货总额" : "近30天短视频带货总额"}：<strong>{config.creatorType === "直播达人" ? config.liveGmv : config.videoGmv}</strong></span></div><div className="config-meta"><span>执行频率：<strong>{config.frequency}</strong></span><span>最近执行：<strong>{config.lastRun}</strong></span></div></div><div className="config-actions"><button onClick={() => notify(`已打开 ${config.name} 的配置编辑页`)}>编辑</button><button onClick={() => runConfig(config.id)} disabled={config.status === "停用"}>立即执行</button><button className={config.status === "启用" ? "danger" : ""} onClick={() => toggleConfig(config.id)}>{config.status === "启用" ? "停用" : "启用"}</button></div></article>)}</div> : <div className="task-view"><div className="task-filter"><div>{["全部", "待执行", "执行中", "已完成", "部分失败", "执行失败"].map((status) => <button key={status} className={taskFilter === status ? "active" : ""} onClick={() => setTaskFilter(status)}>{status}{status === "全部" ? ` ${tasks.length}` : ""}</button>)}</div><button onClick={() => notify("任务列表已刷新", "success")}>↻ 刷新</button></div><div className="table-wrap task-table"><table><thead><tr><th>任务编号</th><th>抓取类型</th><th>使用配置</th><th>数据来源</th><th>时间范围</th><th>达人类型</th><th>近30天带货总额</th><th>开始时间</th><th>抓取结果</th><th>失败数</th><th>状态</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><button className="table-link" onClick={() => setDetailTask(task.id)}>{task.id}</button></td><td>{task.type}</td><td><strong>{task.config}</strong></td><td><span className="source-tag">{task.source}</span></td><td>{task.timeRange}</td><td>{task.creatorType}</td><td>{task.creatorType === "直播达人" ? task.liveGmv : task.videoGmv}</td><td>{task.start}</td><td>{task.result}</td><td>{task.failed ? <span className="task-failed-count">{task.failed}</span> : "—"}</td><td><span className={`task-status ${task.status.includes("失败") ? "failed" : task.status === "执行中" ? "running" : "success"}`}>{task.status}</span></td><td><button className="row-action" onClick={() => setDetailTask(task.id)}>查看</button></td></tr>)}</tbody></table></div>{!visibleTasks.length && <div className="library-empty"><span>✓</span><strong>当前没有此状态的抓取任务</strong><small>任务执行后会在这里显示</small></div>}</div>}
    </section>
    {createOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="collection-modal" role="dialog" aria-modal="true" aria-labelledby="collection-title"><header><div><small>新建采集配置</small><h2 id="collection-title">配置要抓取的达人数据</h2><p>抓取负责数据进入达人库，业务筛选在达人库内完成。</p></div><button onClick={() => setCreateOpen(false)} aria-label="关闭">×</button></header><div className="collection-modal-body"><label>抓取类型<select value={configType} onChange={(event) => { const nextType = event.target.value as typeof configType; setConfigType(nextType); setCreatorTypes(nextType === "全量直播达人" ? ["直播达人"] : ["视频达人"]); }}><option>短视频达人</option><option>全量直播达人</option><option>竞品带货达人</option></select></label><label>配置名称<input defaultValue={`${configType}·新建配置`} /></label><label>数据来源<select><option>{configType === "全量直播达人" ? "精选联盟" : "蝉妈妈"}</option><option>精选联盟</option><option>蝉妈妈</option></select></label><div className="collection-config-group"><span className="collection-config-label">时间范围</span><div className="collection-choice-row"><button type="button" className={timeRange === "近1个月" ? "active" : ""} onClick={() => setTimeRange("近1个月")}>近1个月</button><button type="button" className={timeRange === "近7天" ? "active" : ""} onClick={() => setTimeRange("近7天")}>近7天</button><button type="button" className={timeRange === "近3个月" ? "active" : ""} onClick={() => setTimeRange("近3个月")}>近3个月</button><button type="button" className={timeRange === "自定义" ? "active" : ""} onClick={() => setTimeRange("自定义")}>自定义</button></div>{timeRange === "自定义" && <div className="collection-date-row"><input type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} aria-label="开始日期" /><span>至</span><input type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} aria-label="结束日期" /></div>}</div>{configType === "全量直播达人" ? <label>近30天直播带货总额<div className="collection-gmv-input"><select value={liveGmvOperator} onChange={(event) => setLiveGmvOperator(event.target.value as typeof liveGmvOperator)}><option>不限</option><option>大于等于</option></select>{liveGmvOperator === "大于等于" && <input value={liveGmvValue} onChange={(event) => setLiveGmvValue(event.target.value)} placeholder="填写金额，如 25" inputMode="decimal" />}<span>万</span></div></label> : <label>近30天短视频带货总额<div className="collection-gmv-input"><select value={videoGmvOperator} onChange={(event) => setVideoGmvOperator(event.target.value as typeof videoGmvOperator)}><option>不限</option><option>大于等于</option></select>{videoGmvOperator === "大于等于" && <input value={videoGmvValue} onChange={(event) => setVideoGmvValue(event.target.value)} placeholder="填写金额，如 10" inputMode="decimal" />}<span>万</span></div></label>}{configType === "竞品带货达人" && <div className="collection-gmv-grid"><label>我方商品<select><option>请选择商品</option><option>创维循环扇</option><option>小熊破壁机</option></select></label><label>竞品商品<input placeholder="输入竞品商品ID、链接或平台标识" /></label></div>}<label>执行频率<select><option>手动执行</option><option>每日执行</option><option>每周执行</option></select></label></div><footer><button className="ghost-button" onClick={() => setCreateOpen(false)}>取消</button><button className="primary-button" onClick={createConfig}>确认创建</button></footer></section></div>}
    {currentTask && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailTask(null); }}><aside className="task-detail-drawer" role="dialog" aria-modal="true" aria-label="抓取任务详情"><header><div><small>抓取任务详情</small><h2>{currentTask.id}</h2><p>{currentTask.type} · {currentTask.config}</p></div><button onClick={() => setDetailTask(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className={`task-result-hero ${currentTask.status.includes("失败") ? "failed" : currentTask.status === "执行中" ? "running" : "success"}`}><span>{currentTask.status === "执行中" ? "◌" : currentTask.status.includes("失败") ? "!" : "✓"}</span><div><strong>{currentTask.status}</strong><small>{currentTask.result}</small></div></div><section className="detail-section"><h3>抓取条件</h3><div className="task-detail-grid"><div><small>时间范围</small><strong>{currentTask.timeRange}</strong></div><div><small>达人类型</small><strong>{currentTask.creatorType}</strong></div><div><small>{currentTask.creatorType === "直播达人" ? "近30天直播带货总额" : "近30天短视频带货总额"}</small><strong>{currentTask.creatorType === "直播达人" ? currentTask.liveGmv : currentTask.videoGmv}</strong></div></div></section><section className="detail-section"><h3>执行信息</h3><div className="task-detail-grid"><div><small>数据来源</small><strong>{currentTask.source}</strong></div><div><small>开始时间</small><strong>{currentTask.start}</strong></div><div><small>失败数量</small><strong>{currentTask.failed || "0"}</strong></div><div><small>使用配置</small><strong>{currentTask.config}</strong></div></div></section>{currentTask.failed > 0 && <section className="detail-section"><h3>失败原因</h3><div className="failure-box"><strong>部分数据解析失败</strong><p>32 条达人数据缺少稳定UID或字段格式不符合当前采集规则。可查看失败明细后重试。</p><button onClick={() => notify("失败明细已导出", "success")}>导出失败明细</button></div></section>}<section className="detail-section"><h3>任务结果</h3><p>抓取结果会根据“平台 + 达人UID”与已有达人主档匹配；命中相同达人时更新动态数据，不重复创建达人。</p></section></div><footer><button className="ghost-button" onClick={() => setDetailTask(null)}>关闭</button>{currentTask.status.includes("失败") && <button className="primary-button" onClick={() => { setDetailTask(null); notify("已创建重试任务", "success"); }}>重新执行</button>}</footer></aside></div>}
  </>;
}

function ContactManagement({ notify, onBack }: { notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void; onBack: () => void }) {
  const [view, setView] = useState<"tasks" | "batches">("tasks");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [selected, setSelected] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchDetailId, setBatchDetailId] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importReady, setImportReady] = useState(false);
  const [importHistoryOpen, setImportHistoryOpen] = useState(false);
  const [importRecordId, setImportRecordId] = useState<string | null>(null);
  const [importRecords, setImportRecords] = useState([{ id: "IR20260818001", file: "商务回填表 · FP20260818007.xlsx", batch: "FP20260818007", operator: "陈旭光", importedAt: "2026-08-18 17:32", total: 120, updated: 2, status: "已完成" }]);
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false);
  const [statusUpdater, setStatusUpdater] = useState("");
  const [statusOccurredAt, setStatusOccurredAt] = useState("");
  const [statusNext, setStatusNext] = useState("");
  const [statusUpdateNote, setStatusUpdateNote] = useState("");
  const [statusUpdates, setStatusUpdates] = useState<Record<string, { status: string; updater: string; occurredAt: string; note: string }>>({});
  const [tasks, setTasks] = useState([
    { id: "BL202608180321", creator: "小家电研究所", uid: "dy_86541972", avatar: "blue", product: "创维循环扇", owner: "陈小雨", batch: "FP20260818007", added: "是", agreed: "否", replied: "否", intent: "否", status: "已添加待同意", updated: "今天 10:12" },
    { id: "BL202608180320", creator: "洁净生活家", uid: "dy_10376294", avatar: "pink", product: "创维循环扇", owner: "陈小雨", batch: "FP20260818007", added: "是", agreed: "是", replied: "是", intent: "是", status: "已达成合作意向", updated: "今天 09:58" },
    { id: "BL202608180319", creator: "懒人厨房", uid: "dy_59724081", avatar: "orange", product: "小熊破壁机", owner: "林晓婷", batch: "FP20260818006", added: "是", agreed: "是", replied: "否", intent: "否", status: "已同意待回复", updated: "今天 09:43" },
    { id: "BL202608180318", creator: "暖暖的居家日记", uid: "dy_31562099", avatar: "yellow", product: "小熊破壁机", owner: "林晓婷", batch: "FP20260818006", added: "否", agreed: "否", replied: "否", intent: "否", status: "待添加", updated: "今天 09:21" },
    { id: "BL202608170287", creator: "家居好物直播间", uid: "dy_77510684", avatar: "purple", product: "苏泊尔空气炸锅", owner: "张文豪", batch: "FP20260817012", added: "是", agreed: "是", replied: "是", intent: "否", status: "沟通中", updated: "昨天 18:36" },
    { id: "BL202608170286", creator: "阿阳测评", uid: "dy_42917835", avatar: "green", product: "苏泊尔空气炸锅", owner: "张文豪", batch: "FP20260817012", added: "是", agreed: "否", replied: "否", intent: "否", status: "未达成", updated: "昨天 16:18" },
  ]);
  const batches = [
    { id: "FP20260818007", product: "创维循环扇", owner: "陈小雨", type: "短视频 + 直播", count: 120, added: 86, agreed: 48, replied: 31, intent: 12, created: "今天 09:15" },
    { id: "FP20260818006", product: "小熊破壁机", owner: "林晓婷", type: "短视频达人", count: 80, added: 72, agreed: 42, replied: 28, intent: 9, created: "今天 08:42" },
    { id: "FP20260817012", product: "苏泊尔空气炸锅", owner: "张文豪", type: "直播达人", count: 150, added: 146, agreed: 91, replied: 63, intent: 21, created: "昨天 16:05" },
  ];
  const statusTabs = ["全部", "待添加", "已添加待同意", "已同意待回复", "沟通中", "已达成合作意向", "未达成"];
  const visibleTasks = tasks.filter((task) => statusFilter === "全部" || task.status === statusFilter);
  const detail = tasks.find((task) => task.id === detailId) ?? null;
  const batchDetail = batches.find((batch) => batch.id === batchDetailId) ?? null;
  const importRecord = importRecords.find((record) => record.id === importRecordId) ?? null;
  const allSelected = visibleTasks.length > 0 && visibleTasks.every((task) => selected.includes(task.id));
  const statusTimeMax = new Date().toISOString().slice(0, 16);

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
    const cards = document.querySelectorAll<HTMLElement>(".contact-stat-grid article");
    const cardData = [
      { className: "flow-export", label: "待导出回填表", value: "2", description: "2 个批次等待下发给商务", action: "去导出", onClick: () => { setView("batches"); notify("请在批次操作列逐批导出回填表"); } },
      { className: "flow-collect", label: "已下发待跟进", value: "3", description: "其中 17 条任务已超 3 天未更新", action: "查看超时", onClick: () => { setStatusFilter("全部"); setView("tasks"); notify("已筛选需关注任务"); } },
      { className: "flow-import", label: "导入异常待处理", value: "1", description: "1 份已上传回填表存在字段校验异常", action: "查看记录", onClick: () => setImportHistoryOpen(true) },
      { className: "flow-result", label: "本周达成意向", value: "89", description: "较上周提升 4.8%，可进入合作准备" },
    ];
    cards.forEach((card, index) => {
      const item = cardData[index];
      if (!item) return;
      card.className = item.className;
      card.innerHTML = `<small>${item.label}</small><strong>${item.value}</strong><span>${item.description}</span>${item.action ? `<button type="button">${item.action}</button>` : ""}`;
      const button = card.querySelector<HTMLButtonElement>("button");
      if (button && item.onClick) button.onclick = item.onClick;
    });
  });

  function openStatusUpdate() {
    document.querySelector<HTMLElement>(".inline-status-update")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function saveInlineStatusUpdate(updater: string, occurredAt: string, nextStatus: string, note: string) {
    if (!detail || !updater.trim() || !occurredAt || !nextStatus) return notify("请完整填写状态更新信息", "warning");
    if (new Date(occurredAt).getTime() > Date.now()) return notify("更新时间不能晚于当前时间", "warning");
    const stageValues: Record<string, Pick<typeof tasks[number], "added" | "agreed" | "replied" | "intent">> = {
      "待添加": { added: "否", agreed: "否", replied: "否", intent: "否" }, "已添加待同意": { added: "是", agreed: "否", replied: "否", intent: "否" }, "已同意待回复": { added: "是", agreed: "是", replied: "否", intent: "否" }, "沟通中": { added: "是", agreed: "是", replied: "是", intent: "否" }, "已达成合作意向": { added: "是", agreed: "是", replied: "是", intent: "是" }, "未达成": { added: "是", agreed: "否", replied: "否", intent: "否" },
    };
    setTasks((current) => current.map((task) => task.id === detail.id ? { ...task, ...stageValues[nextStatus], status: nextStatus, updated: occurredAt.replace("T", " ") } : task));
    setStatusUpdates((current) => ({ ...current, [detail.id]: { status: nextStatus, updater, occurredAt: occurredAt.replace("T", " "), note } }));
    notify(`已由 ${updater} 更新建联状态`, "success");
  }

  function saveStatusUpdate() {
    if (!detail || !statusUpdater.trim() || !statusOccurredAt || !statusNext) return notify("请完整填写状态更新信息", "warning");
    if (new Date(statusOccurredAt).getTime() > Date.now()) return notify("更新时间不能晚于当前时间", "warning");
    const stageValues: Record<string, Pick<typeof tasks[number], "added" | "agreed" | "replied" | "intent">> = {
      "待添加": { added: "否", agreed: "否", replied: "否", intent: "否" },
      "已添加待同意": { added: "是", agreed: "否", replied: "否", intent: "否" },
      "已同意待回复": { added: "是", agreed: "是", replied: "否", intent: "否" },
      "沟通中": { added: "是", agreed: "是", replied: "是", intent: "否" },
      "已达成合作意向": { added: "是", agreed: "是", replied: "是", intent: "是" },
      "未达成": { added: "是", agreed: "否", replied: "否", intent: "否" },
    };
    setTasks((current) => current.map((task) => task.id === detail.id ? { ...task, ...stageValues[statusNext], status: statusNext, updated: statusOccurredAt.replace("T", " ") } : task));
    setStatusUpdates((current) => ({ ...current, [detail.id]: { status: statusNext, updater: statusUpdater, occurredAt: statusOccurredAt.replace("T", " "), note: statusUpdateNote } }));
    setStatusUpdateOpen(false);
    notify(`已由 ${statusUpdater} 更新建联状态`, "success");
  }

  useEffect(() => {
    if (!detail) return;
    const updateButton = document.querySelector<HTMLButtonElement>(".contact-detail-drawer > footer .primary-button");
    if (!updateButton) return;
    updateButton.textContent = "更新建联状态";
    updateButton.onclick = (event) => { event.stopPropagation(); openStatusUpdate(); };
  }, [detail, statusTimeMax]);

  useEffect(() => {
    if (!detail) return;
    const drawer = document.querySelector<HTMLElement>(".contact-detail-drawer .drawer-body");
    const sections = drawer?.querySelectorAll<HTMLElement>(":scope > .detail-section");
    if (!drawer || !sections?.[0]) return;
    drawer.querySelector(".inline-status-update")?.remove();
    const panel = document.createElement("section");
    panel.className = "detail-section inline-status-update";
    panel.innerHTML = `<h3>更新建联状态</h3><p>按实际发生时间补录或更正状态；更新记录会保留更新人、时间与备注。</p><form><label>更新后状态<select name="status"><option>待添加</option><option>已添加待同意</option><option>已同意待回复</option><option>沟通中</option><option>已达成合作意向</option><option>未达成</option></select></label><div><label>状态更新人<input name="updater" value="${detail.owner}" /></label><label>状态发生时间<input name="occurredAt" type="datetime-local" value="${statusTimeMax}" max="${statusTimeMax}" /></label></div><label>更新备注<textarea name="note" placeholder="选填，记录来源、沟通结论或更正原因"></textarea></label><button class="primary-button" type="submit">确认更新状态</button></form>`;
    const statusSelect = panel.querySelector<HTMLSelectElement>("select[name=status]");
    if (statusSelect) statusSelect.value = detail.status;
    panel.querySelector<HTMLFormElement>("form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      saveInlineStatusUpdate(String(form.get("updater") ?? ""), String(form.get("occurredAt") ?? ""), String(form.get("status") ?? ""), String(form.get("note") ?? ""));
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
    setImportRecords((current) => [{ id: "IR20260819001", file: "商务回填表 · FP20260818007.xlsx", batch: "FP20260818007", operator: "陈旭光", importedAt: "刚刚", total: 120, updated: 2, status: "已完成" }, ...current]);
    notify("已按商务回填表更新 2 条建联任务状态", "success");
  }

  return <>
    <div className="contact-import-action"><div><strong>批量更新状态</strong><small>导出给商务填写状态后，在此导入并统一回写</small></div><button className="primary-button" onClick={() => setImportOpen(true)}>⇧ 导入商务回填表</button></div>
    <header className="page-header contact-head"><div><h1>建联管理</h1><p>围绕“达人 × 商品 × 商务”管理建联任务、分配批次和跟进状态。</p></div><div className="header-actions"><button className="ghost-button" onClick={() => notify("已导出标准建联Excel", "success")}>⇩ 导出建联表</button><button className="primary-button" onClick={() => setBatchOpen(true)}>＋ 创建分配批次</button></div></header>
    <section className="contact-stat-grid"><article><small>待添加</small><strong>{tasks.filter((task) => task.status === "待添加").length + 126}</strong><span>需要尽快分发给商务</span></article><article><small>已回复沟通中</small><strong>{tasks.filter((task) => ["沟通中", "已同意待回复"].includes(task.status)).length + 284}</strong><span>建议持续跟进合作意向</span></article><article><small>本周达成意向</small><strong>89</strong><span>较上周提升 4.8%</span></article><article className="contact-attention"><small>超过3天未更新</small><strong>17</strong><button onClick={() => { setStatusFilter("全部"); setView("tasks"); notify("已筛选需关注任务"); }}>查看</button></article></section>
    <section className="panel contact-panel"><div className="contact-tabs"><div className="tabs"><button className={view === "tasks" ? "active" : ""} onClick={() => setView("tasks")}>建联任务 <span>2,486</span></button><button className={view === "batches" ? "active" : ""} onClick={() => setView("batches")}>分配批次 <span>{batches.length}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>{view === "tasks" ? <><div className="contact-filter-row"><div>{statusTabs.map((status) => <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><div><input placeholder="搜索达人、商品、商务或任务编号" /><button onClick={() => notify("更多筛选会在下一轮完善")}>⌘ 筛选</button></div></div><div className="contact-toolbar"><label><input type="checkbox" checked={allSelected} onChange={toggleAll} /> 全选当前结果</label><span>共 <strong>{visibleTasks.length}</strong> 条演示任务</span><button onClick={() => selected.length ? notify(`已为 ${selected.length} 条任务打开批量更新`, "success") : notify("请先选择任务", "warning")}>批量更新状态</button></div><div className="table-wrap contact-table"><table><thead><tr><th><input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="全选" /></th><th>建联任务编号</th><th>达人</th><th>推广商品</th><th>负责商务</th><th>所属批次</th><th>是否添加</th><th>是否同意</th><th>是否回复</th><th>合作意向</th><th>当前状态</th><th>更新时间</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><input type="checkbox" checked={selected.includes(task.id)} onChange={() => setSelected((current) => current.includes(task.id) ? current.filter((id) => id !== task.id) : [...current, task.id])} aria-label={`选择${task.creator}`} /></td><td><button className="table-link" onClick={() => setDetailId(task.id)}>{task.id}</button></td><td><div className="creator-cell compact"><span className={`creator-avatar ${task.avatar}`}>{task.creator.slice(0, 1)}</span><div><strong>{task.creator}</strong><small>{task.uid}</small></div></div></td><td>{task.product}</td><td>{task.owner}</td><td><button className="batch-link" onClick={() => { setView("batches"); notify(`已定位批次 ${task.batch}`); }}>{task.batch}</button></td><td><StatusDot value={task.added} /></td><td><StatusDot value={task.agreed} /></td><td><StatusDot value={task.replied} /></td><td><StatusDot value={task.intent} /></td><td><span className={`contact-status ${task.status === "已达成合作意向" ? "success" : task.status === "未达成" ? "failed" : ""}`}>{task.status}</span></td><td><span className="update-time">{task.updated}</span></td><td><button className="row-action" onClick={() => setDetailId(task.id)}>查看</button></td></tr>)}</tbody></table></div></> : <div className="batch-view"><div className="batch-toolbar"><span>按批次查看商务分配与整体建联进度</span><button onClick={() => notify("批次数据已导出", "success")}>⇩ 导出批次明细</button></div><div className="table-wrap batch-table"><table><thead><tr><th>分配批次</th><th>推广商品</th><th>负责商务</th><th>达人类型</th><th>达人数量</th><th>已添加</th><th>已同意</th><th>已回复</th><th>达成意向</th><th>创建时间</th><th>操作</th></tr></thead><tbody>{batches.map((batch) => <tr key={batch.id}><td><button className="table-link" onClick={() => notify(`已打开 ${batch.id} 的批次详情`)}>{batch.id}</button></td><td><strong>{batch.product}</strong></td><td>{batch.owner}</td><td>{batch.type}</td><td>{batch.count}</td><td>{batch.added}</td><td>{batch.agreed}</td><td>{batch.replied}</td><td><strong>{batch.intent}</strong></td><td>{batch.created}</td><td><button className="row-action" onClick={() => notify(`已打开 ${batch.id} 的批次详情`)}>查看</button></td></tr>)}</tbody></table></div></div>}</section>
    {detail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="建联任务详情"><header><div><small>建联任务详情</small><h2>{detail.creator}</h2><p>{detail.id} · {detail.product} · {detail.owner}</p></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="contact-state-line"><span className={detail.added === "是" ? "done" : ""}>已添加</span><i /> <span className={detail.agreed === "是" ? "done" : ""}>已同意</span><i /> <span className={detail.replied === "是" ? "done" : ""}>已回复</span><i /> <span className={detail.intent === "是" ? "done" : ""}>达成意向</span></div><section className="detail-section"><h3>任务信息</h3><div className="task-detail-grid"><div><small>推广商品</small><strong>{detail.product}</strong></div><div><small>负责商务</small><strong>{detail.owner}</strong></div><div><small>所属批次</small><strong>{detail.batch}</strong></div><div><small>当前状态</small><strong>{detail.status}</strong></div></div></section><section className="detail-section"><h3>状态记录</h3><div className="contact-timeline"><div><span>创建任务</span><small>今天 08:42 · 陈旭光</small></div>{detail.added === "是" && <div><span>已添加微信</span><small>{detail.updated} · {detail.owner}</small></div>}{detail.agreed === "是" && <div><span>达人已同意</span><small>{detail.updated} · {detail.owner}</small></div>}{detail.replied === "是" && <div><span>达人已回复</span><small>{detail.updated} · {detail.owner}</small></div>}</div></section><label className="contact-note">建联备注<textarea placeholder="记录本次沟通的关键内容" /></label></div><footer><button className="ghost-button" onClick={() => setDetailId(null)}>关闭</button>{!["已达成合作意向", "未达成"].includes(detail.status) && <button className="primary-button" onClick={() => advanceTask(detail.id)}>推进到下一状态</button>}</footer></aside></div>}
    {batchOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBatchOpen(false); }}><section className="batch-modal" role="dialog" aria-modal="true" aria-labelledby="batch-title"><header><div><small>创建分配批次</small><h2 id="batch-title">从达人库选择并分配达人</h2><p>支持向无系统登录权限的商务人员分配任务。</p></div><button onClick={() => setBatchOpen(false)} aria-label="关闭">×</button></header><div className="batch-modal-body"><div className="batch-select-summary"><span>0</span><div><strong>暂未选择达人</strong><small>请先从达人库批量选择达人，再进入此流程。</small></div><button onClick={() => { setBatchOpen(false); notify("已进入达人库"); }}>去达人库选择</button></div><label>推广商品<select><option>请选择推广商品</option><option>创维循环扇</option><option>小熊破壁机</option></select></label><label>负责商务<select><option>请选择负责商务</option><option>陈小雨</option><option>林晓婷</option><option>张文豪</option></select></label><label>备注<textarea placeholder="可选，填写本次分配说明" /></label></div><footer><button className="ghost-button" onClick={() => setBatchOpen(false)}>取消</button><button className="primary-button" onClick={() => notify("请先从达人库选择达人", "warning")}>确认创建</button></footer></section></div>}
    {importOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportOpen(false); }}><section className="import-modal" role="dialog" aria-modal="true" aria-labelledby="status-import-title"><header><div><small>批量更新建联状态</small><h2 id="status-import-title">导入商务回填表</h2><p>按任务编号匹配，统一更新是否添加、是否同意、是否回复和合作意向。</p></div><button onClick={() => setImportOpen(false)} aria-label="关闭">×</button></header><div className="import-modal-body"><div className="upload-zone"><span>⇧</span><strong>{importReady ? "商务回填表 · FP20260818007.xlsx" : "选择商务已回填的导出表"}</strong><small>{importReady ? "识别到 120 条记录，其中 2 条状态有变化" : "支持 .xlsx、.csv；必须保留建联任务编号和四个状态列"}</small><button onClick={() => setImportReady(true)}>{importReady ? "已选择" : "选择回填表"}</button></div><div className="import-fields"><h3>系统回写字段</h3><span>建联任务编号</span><span>是否添加</span><span>是否同意</span><span>是否回复</span><span>合作意向</span><span>商务备注</span></div></div><footer><button className="ghost-button" onClick={() => setImportOpen(false)}>取消</button><button className="primary-button" disabled={!importReady} onClick={applyImportedStatuses}>校验并更新状态</button></footer></section></div>}
    {batchDetail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBatchDetailId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="分配批次详情"><header><div><small>分配批次详情</small><h2>{batchDetail.id}</h2><p>{batchDetail.product} · {batchDetail.owner}</p></div><button onClick={() => setBatchDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="batch-detail-hero"><strong>共 {batchDetail.count} 位达人</strong><small>批量分配给 {batchDetail.owner} · {batchDetail.created}</small></div><section className="detail-section"><h3>批次信息</h3><div className="task-detail-grid"><div><small>推广商品</small><strong>{batchDetail.product}</strong></div><div><small>达人类型</small><strong>{batchDetail.type}</strong></div><div><small>负责商务</small><strong>{batchDetail.owner}</strong></div><div><small>创建时间</small><strong>{batchDetail.created}</strong></div></div></section><section className="detail-section"><h3>建联进度</h3><div className="batch-progress-list"><div><span>已添加</span><strong>{batchDetail.added} / {batchDetail.count}</strong></div><div><span>已同意</span><strong>{batchDetail.agreed} / {batchDetail.count}</strong></div><div><span>已回复</span><strong>{batchDetail.replied} / {batchDetail.count}</strong></div><div><span>达成意向</span><strong>{batchDetail.intent} / {batchDetail.count}</strong></div></div></section><section className="detail-section"><h3>业务操作</h3><p>主管导出本批次回填表后发送给商务；商务维护状态，收集后再导入回写达人与批次进度。</p><button className="primary-button" onClick={() => notify(`已导出 ${batchDetail.id} 的商务建联回填表`, "success")}>⇩ 导出本批次回填表</button></section></div><footer><button className="ghost-button" onClick={() => setBatchDetailId(null)}>关闭</button><button className="primary-button" onClick={() => { setBatchDetailId(null); setImportOpen(true); }}>导入商务回填表</button></footer></aside></div>}
    {importHistoryOpen && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportHistoryOpen(false); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="商务回填导入记录"><header><div><small>商务回填导入</small><h2>导入记录</h2><p>保留每次回填表的校验与回写结果</p></div><button onClick={() => setImportHistoryOpen(false)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="import-record-list">{importRecords.map((record) => <button key={record.id} onClick={() => setImportRecordId(record.id)}><div><strong>{record.file}</strong><small>{record.id} · {record.importedAt} · {record.operator}</small></div><span>{record.status}</span><i>›</i></button>)}</div></div><footer><button className="ghost-button" onClick={() => setImportHistoryOpen(false)}>关闭</button><button className="primary-button" onClick={() => { setImportHistoryOpen(false); setImportOpen(true); }}>导入新回填表</button></footer></aside></div>}
    {importRecord && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImportRecordId(null); }}><aside className="contact-detail-drawer" role="dialog" aria-modal="true" aria-label="导入记录详情"><header><div><small>导入记录详情</small><h2>{importRecord.id}</h2><p>{importRecord.file}</p></div><button onClick={() => setImportRecordId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className="batch-detail-hero"><strong>{importRecord.status}</strong><small>{importRecord.importedAt} · {importRecord.operator}</small></div><section className="detail-section"><h3>导入信息</h3><div className="task-detail-grid"><div><small>关联批次</small><strong>{importRecord.batch}</strong></div><div><small>导入记录数</small><strong>{importRecord.total}</strong></div><div><small>更新任务数</small><strong>{importRecord.updated}</strong></div><div><small>处理状态</small><strong>{importRecord.status}</strong></div></div></section><section className="detail-section"><h3>回写结果</h3><p>系统已按建联任务编号匹配回填表，并同步更新达人建联状态及所属批次的进度统计。</p></section></div><footer><button className="primary-button" onClick={() => setImportRecordId(null)}>完成</button></footer></aside></div>}
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
  const [statusFilter, setStatusFilter] = useState("全部");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [tasks, setTasks] = useState([
    { id: "DL202608180038", yidaoId: "TASK-20260818-01128", scheduleUuid: "SCH-DIRECT-LINK-01", creator: "小家电研究所", douyinId: "xiaojd_lab", uid: "dy_86541972", product: "创维循环扇", store: "创维生活电器旗舰店", productId: "100987654321", commission: "25%", remark: "首播专属佣金", created: "今天 10:18", status: "执行中", api: "task/start 已受理" },
    { id: "DL202608180037", yidaoId: "TASK-20260818-01127", scheduleUuid: "SCH-DIRECT-LINK-01", creator: "洁净生活家", douyinId: "clean_life", uid: "dy_10376294", product: "创维循环扇", store: "创维生活电器旗舰店", productId: "100987654321", commission: "22%", remark: "", created: "今天 10:06", status: "创建成功", api: "task/query 正常" },
    { id: "DL202608180036", yidaoId: "TASK-20260818-01126", scheduleUuid: "SCH-DIRECT-LINK-02", creator: "乐妈家居直播", douyinId: "lemama_home", uid: "dy_76129840", product: "小熊破壁机", store: "小熊官方旗舰店", productId: "100678901234", commission: "18%", remark: "晚场直播", created: "今天 09:52", status: "异常", api: "task/query 异常" },
    { id: "DL202608180035", yidaoId: "TASK-20260818-01125", scheduleUuid: "SCH-DIRECT-LINK-03", creator: "阿阳测评", douyinId: "ayang_test", uid: "dy_42917835", product: "苏泊尔空气炸锅", store: "苏泊尔厨电旗舰店", productId: "100112233445", commission: "20%", remark: "", created: "今天 09:36", status: "已停止", api: "task/stop 成功" },
  ]);
  const today = "2026-08-18";
  const [entryMode, setEntryMode] = useState<"ai" | "paste" | "single">("ai");
  const [taskName, setTaskName] = useState(`${today} 第一批`);
  const [bulkText, setBulkText] = useState("");
  const [parsedCreators, setParsedCreators] = useState<Array<{ creator: string; douyinId: string; uid: string }>>([]);
  const [form, setForm] = useState({ scheduleUuid: "SCH-DIRECT-LINK-01", creator: "", douyinId: "", uid: "", product: "", store: "", productId: "", remark: "", commission: "" });
  const visibleTasks = tasks.filter((task) => statusFilter === "全部" || task.status === statusFilter);
  const detail = tasks.find((task) => task.id === detailId) ?? null;

  function submitTask() {
    const creatorsToCreate = parsedCreators.length ? parsedCreators : form.uid.trim() ? [{ creator: form.creator || "未命名达人", douyinId: form.douyinId, uid: form.uid }] : [];
    if (!taskName.trim() || !form.commission.trim() || (!form.product.trim() && !form.productId.trim()) || !creatorsToCreate.length) { notify("请填写任务名称、商品或商品ID、佣金，并至少提供一个达人UID", "warning"); return; }
    const newTasks = creatorsToCreate.map((creator, index) => ({ id: `DL20260818${String(tasks.length + 39 + index).padStart(3, "0")}`, yidaoId: "待 task/newest/list 回查", scheduleUuid: form.scheduleUuid, creator: creator.creator, douyinId: creator.douyinId, uid: creator.uid, product: form.product || `商品ID：${form.productId}`, store: form.store || "—", productId: form.productId || "—", commission: `${form.commission.replace("%", "")}%`, remark: `${taskName}${form.remark ? ` · ${form.remark}` : ""}`, created: "刚刚", status: "待回查", api: "task/start 已受理" }));
    setTasks((current) => [...newTasks, ...current]); setCreateOpen(false); setTab("tasks"); setBulkText(""); setParsedCreators([]); setTaskName(`${today} 第${Math.floor(tasks.length / 20) + 2}批`); setForm({ scheduleUuid: "SCH-DIRECT-LINK-01", creator: "", douyinId: "", uid: "", product: "", store: "", productId: "", remark: "", commission: "" }); notify(`已触发 ${newTasks.length} 位达人的常规任务，正在回查影刀 Task UUID`, "success");
  }
  function parseBulkText() { const rows = bulkText.split(/\n|；|;/).map((value) => value.trim()).filter(Boolean).map((value, index) => { const parts = value.split(/[，,\t|]/).map((item) => item.trim()); return { creator: parts[0] || `达人${index + 1}`, douyinId: parts[1] || "", uid: parts[2] || parts[0] }; }).filter((item) => item.uid); setParsedCreators(rows); notify(`已解析 ${rows.length} 位达人，请确认UID`, "success"); }
  function stopTask(id: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, status: "已停止", api: "task/stop 成功" } : task)); setDetailId(null); notify("已停止该常规任务下所有未结束的影刀Job", "success"); }

  return <>
    <header className="page-header link-head"><div><h1>定向链接自动化</h1><p>触发影刀已预配置的常规任务，并在内容罗盘内回查、监控和停止任务。</p></div><div className="header-actions"><button className="ghost-button" onClick={() => { setTab("records"); notify("已切换到API调用记录"); }}>查看API调用记录</button><button className="primary-button" onClick={() => setCreateOpen(true)}>＋ 创建链接任务</button></div></header>
    <section className="link-kpis"><article><span className="link-kpi-icon violet">今</span><div><small>今日已发送任务</small><strong>{tasks.length + 28}</strong><em>影刀API调用成功率 96.8%</em></div></article><article><span className="link-kpi-icon cyan">行</span><div><small>执行中的影刀任务</small><strong>{tasks.filter((task) => task.status === "执行中").length}</strong><em>可随时查询或停止</em></div></article><article><span className="link-kpi-icon green">成</span><div><small>创建成功</small><strong>36</strong><em>已通过业务结果校验</em></div></article><article><span className="link-kpi-icon red">异</span><div><small>异常任务</small><strong>{tasks.filter((task) => task.status === "异常").length}</strong><em>需要检查影刀执行结果</em></div></article></section>
    <section className="panel link-panel"><div className="link-tabs"><div className="tabs"><button aria-pressed={tab === "tasks"} className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>常规任务监控 <span>{tasks.length}</span></button><button aria-pressed={tab === "records"} className={tab === "records" ? "active" : ""} onClick={() => setTab("records")}>API调用记录 <span>{tasks.length + 8}</span></button></div><button className="text-button" onClick={onBack}>← 返回工作台</button></div>{tab === "tasks" ? <><div className="link-filter"><div>{["全部", "待回查", "执行中", "创建成功", "异常", "已停止"].map((status) => <button key={status} aria-pressed={statusFilter === status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><button onClick={() => notify("已请求 task/query 刷新任务状态", "success")}>↻ 同步影刀状态</button></div><div className="table-wrap link-table"><table><thead><tr><th>内容罗盘任务</th><th>影刀 Task UUID</th><th>达人</th><th>商品 / 店铺</th><th>定向商品ID</th><th>佣金系数</th><th>API状态</th><th>任务状态</th><th>创建时间</th><th>操作</th></tr></thead><tbody>{visibleTasks.map((task) => <tr key={task.id}><td><button className="table-link" onClick={() => setDetailId(task.id)}>{task.id}</button></td><td><code>{task.yidaoId}</code></td><td><div className="link-creator"><strong>{task.creator}</strong><small>{task.douyinId} · {task.uid}</small></div></td><td><div className="link-product"><strong>{task.product}</strong><small>{task.store}</small></div></td><td><code>{task.productId}</code></td><td><strong>{task.commission}</strong></td><td><span className={`api-status ${task.api.includes("异常") ? "failed" : task.api === "已发送" ? "sending" : "success"}`}>{task.api}</span></td><td><span className={`link-status ${task.status === "异常" ? "failed" : task.status === "执行中" ? "running" : task.status === "已停止" ? "stopped" : "success"}`}>{task.status}</span></td><td>{task.created}</td><td><button className="row-action" onClick={() => setDetailId(task.id)}>查看</button></td></tr>)}</tbody></table></div></> : <ApiRecords tasks={tasks} notify={notify} />}</section>
    {createOpen && <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCreateOpen(false); }}><section className="link-create-modal link-create-batch" role="dialog" aria-modal="true" aria-labelledby="link-create-title"><header><div><small>批量创建定向链接</small><h2 id="link-create-title">定向链接自动化任务</h2><p>先关联影刀常规任务，再录入本次公共商品信息和一个或多个达人。</p></div><button onClick={() => setCreateOpen(false)} aria-label="关闭">×</button></header><div className="link-form"><label>影刀常规任务<span>*</span><select value={form.scheduleUuid} onChange={(event) => setForm({ ...form, scheduleUuid: event.target.value })}><option value="SCH-DIRECT-LINK-01">定向链接创建 · 家电类</option><option value="SCH-DIRECT-LINK-02">定向链接创建 · 厨电类</option><option value="SCH-DIRECT-LINK-03">定向链接创建 · 直播专场</option></select></label><label>定向链接自动化任务名称<span>*</span><input value={taskName} onChange={(event) => setTaskName(event.target.value)} /></label><label>商品（与商品ID二选一）<input value={form.product} onChange={(event) => setForm({ ...form, product: event.target.value })} placeholder="输入商品名称" /></label><label>定向商品ID（与商品二选一）<input value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })} placeholder="输入精选联盟商品ID" /></label><label>商品店铺<input value={form.store} onChange={(event) => setForm({ ...form, store: event.target.value })} placeholder="输入商品所属店铺" /></label><label>指定佣金系数（正常价格）<span>*</span><div className="commission-input"><input value={form.commission} onChange={(event) => setForm({ ...form, commission: event.target.value })} placeholder="例如：25" /><em>%</em></div></label><div className="creator-entry full"><div className="entry-tabs"><button className={entryMode === "ai" ? "active" : ""} onClick={() => setEntryMode("ai")}>AI整段解析</button><button className={entryMode === "paste" ? "active" : ""} onClick={() => setEntryMode("paste")}>批量粘贴 / 表格导入</button><button className={entryMode === "single" ? "active" : ""} onClick={() => setEntryMode("single")}>单个录入</button></div>{entryMode !== "single" ? <><textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder={entryMode === "ai" ? "例如：找小家电研究所、洁净生活家做创维循环扇定向链接，佣金25%。也可以无序输入一整段需求。" : "每行一位达人：达人昵称，抖音ID，达人UID。可直接粘贴表格内容。"} /><div className="entry-actions"><button onClick={parseBulkText}>{entryMode === "ai" ? "AI解析信息" : "解析粘贴内容"}</button><button onClick={() => { setBulkText("小家电研究所，xiaojd_lab，dy_86541972\n洁净生活家，clean_life，dy_10376294"); setEntryMode("paste"); }}>⇧ 导入表格（演示）</button></div></> : <div className="single-creator"><label>达人UID<span>*</span><input value={form.uid} onChange={(event) => setForm({ ...form, uid: event.target.value })} placeholder="必填" /></label><label>达人昵称<input value={form.creator} onChange={(event) => setForm({ ...form, creator: event.target.value })} placeholder="选填" /></label><label>达人抖音ID<input value={form.douyinId} onChange={(event) => setForm({ ...form, douyinId: event.target.value })} placeholder="选填" /></label></div>}{parsedCreators.length > 0 && <div className="parsed-summary">已解析 <strong>{parsedCreators.length}</strong> 位达人，将按 UID 创建任务</div>}</div><label className="full">特殊备注<textarea value={form.remark} onChange={(event) => setForm({ ...form, remark: event.target.value })} placeholder="可选，传递给影刀执行人员的特殊说明" /></label><div className="api-contract-note"><span>API</span><p>系统将为每位达人触发关联的影刀常规任务，并通过 task/newest/list 回查 Task UUID。</p></div></div><footer><button className="ghost-button" onClick={() => setCreateOpen(false)}>取消</button><button className="primary-button" onClick={submitTask}>创建并调用影刀</button></footer></section></div>}
    {detail && <div className="drawer-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetailId(null); }}><aside className="link-detail-drawer" role="dialog" aria-modal="true" aria-label="影刀任务详情"><header><div><small>影刀任务详情</small><h2>{detail.id}</h2><p>影刀任务：{detail.yidaoId}</p></div><button onClick={() => setDetailId(null)} aria-label="关闭">×</button></header><div className="drawer-body"><div className={`link-result-hero ${detail.status === "异常" ? "failed" : detail.status === "执行中" ? "running" : "success"}`}><span>{detail.status === "执行中" ? "◌" : detail.status === "异常" ? "!" : "✓"}</span><div><strong>{detail.status}</strong><small>影刀API状态：{detail.api}</small></div></div><section className="detail-section"><h3>任务参数</h3><div className="task-detail-grid"><div><small>达人昵称</small><strong>{detail.creator}</strong></div><div><small>达人抖音ID</small><strong>{detail.douyinId}</strong></div><div><small>达人UID</small><strong>{detail.uid}</strong></div><div><small>指定佣金系数</small><strong>{detail.commission}</strong></div><div><small>商品</small><strong>{detail.product}</strong></div><div><small>商品店铺</small><strong>{detail.store}</strong></div><div><small>定向商品ID</small><strong>{detail.productId}</strong></div><div><small>特殊备注</small><strong>{detail.remark || "—"}</strong></div></div></section><section className="detail-section"><h3>影刀执行记录</h3><div className="yidao-log"><div><span>10:18:02</span><p><strong>请求已发送</strong> 内容罗盘向影刀定制API提交任务参数</p></div><div><span>10:18:04</span><p><strong>影刀已受理</strong> 返回影刀任务ID：{detail.yidaoId}</p></div><div><span>10:18:10</span><p><strong>状态同步</strong> 当前任务状态：{detail.status}</p></div></div></section></div><footer><button className="ghost-button" onClick={() => notify("已向影刀查询最新任务详情", "success")}>查询最新状态</button>{detail.status === "执行中" && <button className="stop-button" onClick={() => stopTask(detail.id)}>停止任务</button>}</footer></aside></div>}
  </>;
}

function ApiRecords({ tasks, notify }: { tasks: Array<{ id: string; yidaoId: string; created: string; api: string; status: string }>; notify: (message: string, tone?: NonNullable<Toast>["tone"]) => void }) { return <div className="api-records"><div className="api-record-note"><span>API</span><p>此处记录内容罗盘向影刀定制API发起的调用，以及影刀返回的响应状态。</p></div><div className="table-wrap api-record-table"><table><thead><tr><th>调用时间</th><th>请求编号</th><th>接口名称</th><th>关联内容罗盘任务</th><th>影刀任务ID</th><th>响应状态</th><th>耗时</th><th>操作</th></tr></thead><tbody>{tasks.map((task, index) => <tr key={task.id}><td>{task.created}</td><td><code>REQ-20260818-{String(index + 1128).padStart(5, "0")}</code></td><td><strong>createDirectedLinkTask</strong></td><td><button className="table-link" onClick={() => notify(`已定位任务 ${task.id}`)}>{task.id}</button></td><td><code>{task.yidaoId}</code></td><td><span className={`api-status ${task.api.includes("异常") ? "failed" : task.api === "已发送" ? "sending" : "success"}`}>{task.api}</span></td><td>{index % 2 ? "1.28s" : "0.86s"}</td><td><button className="row-action" onClick={() => notify("请求与响应内容已展开")}>查看报文</button></td></tr>)}</tbody></table></div></div>; }
