import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActivityLogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BackpackIcon,
  CameraIcon,
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  CubeIcon,
  PersonIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";
import { BottomSheet, FlowStack, MobileScroll, type FlowControls, type FlowScreen } from "./mobile";

type Story = {
  id: string;
  title: string;
  shortTitle: string;
  theme: string;
  age: string;
  description: string;
  image: string;
  duration: string;
  goal: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  storyId?: string;
};

type MissingPart = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  kind: string;
};

type PageId = "login" | "home" | "stories" | "detail" | "connect" | "update" | "sync" | "play" | "records" | "record" | "assessment" | "unlock" | "shop" | "settings";

type PrototypeState = {
  childAge: string;
  setChildAge: (age: string) => void;
  baseConnected: boolean;
  setBaseConnected: (connected: boolean) => void;
  firmwareUpdated: boolean;
  setFirmwareUpdated: (updated: boolean) => void;
  unlockedStoryIds: string[];
  unlockStory: (storyId: string) => void;
  cameraMode: boolean;
  setCameraMode: (enabled: boolean) => void;
  cameraPaired: boolean;
  setCameraPaired: (paired: boolean) => void;
  cartItems: CartItem[];
  addCartItem: (item: CartItem) => void;
  removeCartItem: (itemId: string) => void;
};

const PrototypeContext = createContext<PrototypeState | null>(null);

function usePrototypeState() {
  const state = useContext(PrototypeContext);
  if (!state) throw new Error("Prototype state is unavailable");
  return state;
}

const stories: Story[] = [
  {
    id: "mountain",
    title: "花果山 · 认物探索",
    shortTitle: "花果山",
    theme: "认物与大小配对",
    age: "3–5岁",
    description: "认识山、水、树和洞，帮小猴发现瀑布后面的秘密。",
    image: "/assets/lingjing/story-worlds.png",
    duration: "约 8 分钟",
    goal: "观察形状与大小，寻找场景中的线索。",
  },
  {
    id: "spider",
    title: "小猴勇闯水晶洞",
    shortTitle: "盘丝洞",
    theme: "角色位置关系",
    age: "4–6岁",
    description: "陪小猴穿过水晶洞，看看角色站在哪里，故事会如何继续。",
    image: "/assets/lingjing/story-spider-cave.png",
    duration: "约 12 分钟",
    goal: "识别多个角色，并用前后与中间关系推进故事。",
  },
  {
    id: "bones",
    title: "三打白骨精 · 创造故事",
    shortTitle: "白骨精",
    theme: "线索推理与复述",
    age: "6–8岁",
    description: "寻找线索、辨认伪装，再和孩子一起排出故事顺序。",
    image: "/assets/lingjing/story-worlds.png",
    duration: "约 15 分钟",
    goal: "根据线索判断角色，并用自己的话复原故事。",
  },
  {
    id: "forest",
    title: "森林寻宝 · 同伴奇遇",
    shortTitle: "森林寻宝",
    theme: "路线推理与角色协作",
    age: "4–6岁",
    description: "沿着森林线索找到宝箱，看看熟悉的角色怎样合作完成任务。",
    image: "/assets/lingjing/story-worlds.png",
    duration: "约 10 分钟",
    goal: "根据路线线索调整角色位置，并和同伴一起寻找宝藏。",
  },
];

const featuredStory = stories[1];

function route(page: PageId, story: Story = featuredStory): FlowScreen {
  return {
    id: `${page}-${story.id}`,
    title: story.title,
    render: (flow) => <RouteView page={page} story={story} flow={flow} />,
  };
}

export default function Prototype() {
  const [childAge, setChildAge] = useState("4岁");
  const [baseConnected, setBaseConnected] = useState(false);
  const [firmwareUpdated, setFirmwareUpdated] = useState(false);
  const [unlockedStoryIds, setUnlockedStoryIds] = useState(["mountain", "spider"]);
  const [cameraMode, setCameraMode] = useState(false);
  const [cameraPaired, setCameraPaired] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const unlockStory = (storyId: string) => setUnlockedStoryIds((current) => current.includes(storyId) ? current : [...current, storyId]);
  const addCartItem = (item: CartItem) => setCartItems((current) => current.some((existing) => existing.id === item.id) ? current : [...current, item]);
  const removeCartItem = (itemId: string) => setCartItems((current) => current.filter((item) => item.id !== itemId));
  return (
    <PrototypeContext.Provider value={{ childAge, setChildAge, baseConnected, setBaseConnected, firmwareUpdated, setFirmwareUpdated, unlockedStoryIds, unlockStory, cameraMode, setCameraMode, cameraPaired, setCameraPaired, cartItems, addCartItem, removeCartItem }}>
      <FlowStack initial={route("login")} />
    </PrototypeContext.Provider>
  );
}

function RouteView({ page, story, flow }: { page: PageId; story: Story; flow: FlowControls }) {
  switch (page) {
    case "login":
      return <LoginScreen flow={flow} />;
    case "home":
      return <HomeScreen flow={flow} />;
    case "stories":
      return <StoryLibrary flow={flow} />;
    case "detail":
      return <StoryDetail story={story} flow={flow} />;
    case "connect":
      return <ConnectBase story={story} flow={flow} />;
    case "update":
      return <BaseSoftwareUpdate story={story} flow={flow} />;
    case "sync":
      return <StorySync story={story} flow={flow} />;
    case "play":
      return <PlayStory story={story} flow={flow} />;
    case "records":
      return <Records flow={flow} />;
    case "record":
      return <RecordDetail story={story} flow={flow} />;
    case "assessment":
      return <StageAssessment story={story} flow={flow} />;
    case "unlock":
      return <StoryUnlock story={story} flow={flow} />;
    case "shop":
      return <StoryShop story={story} flow={flow} />;
    case "settings":
      return <Settings flow={flow} />;
  }
}

function Screen({ children, name }: { children: ReactNode; name: string }) {
  return (
    <MobileScroll className="app-screen app-scroll">
      <main className={`app-page page-${name}`}>{children}</main>
    </MobileScroll>
  );
}

function BrandHeader({ onProfile, onShop }: { onProfile: () => void; onShop: () => void }) {
  const { cartItems } = usePrototypeState();
  return (
    <header className="app-topbar">
      <div className="brand-lockup">
        <img src="/assets/lingjing/brand-mark.svg" alt="" />
        <div>
          <strong>灵境童创</strong>
          <span>智能故事积木 · 亲子陪伴应用</span>
        </div>
      </div>
      <div className="topbar-actions">
        <button className="shop-cart-button" type="button" aria-label={`打开故事商城与购物车${cartItems.length ? `，${cartItems.length}件商品` : ""}`} onClick={onShop}>
          <BackpackIcon width={18} height={18} />
          <span>商城</span>
          {cartItems.length ? <span className="cart-count-badge">{cartItems.length}</span> : null}
        </button>
        <button className="avatar-button" type="button" aria-label="打开家庭设置" onClick={onProfile}>
          <PersonIcon width={20} height={20} />
        </button>
      </div>
    </header>
  );
}

function PageHeader({ title, eyebrow, flow, action }: { title: string; eyebrow?: string; flow: FlowControls; action?: ReactNode }) {
  const goBack = () => (flow.canGoBack ? flow.pop() : flow.replace(route("home")));
  return (
    <header className="subpage-topbar">
      <button className="back-button" type="button" aria-label="返回上一页" onClick={goBack}>
        <ArrowLeftIcon width={19} height={19} />
      </button>
      <div className="subpage-heading">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {action ?? <img className="mini-mark" src="/assets/lingjing/brand-mark.svg" alt="灵境童创" />}
    </header>
  );
}

function LoginScreen({ flow }: { flow: FlowControls }) {
  return (
    <Screen name="login">
      <section className="login-brand">
        <img src="/assets/lingjing/brand-mark.svg" alt="" />
        <div><strong>灵境童创</strong><span>智能故事积木 · 亲子陪伴应用</span></div>
      </section>
      <div className="login-art"><img src="/assets/lingjing/story-spider-cave.png" alt="孩子与故事积木的冒险场景" /></div>
      <section className="login-copy">
        <span className="eyebrow">欢迎来到灵境童创</span>
        <h1>和孩子一起<br />把故事搭出来</h1>
        <p>登录后连接故事底盘，选择故事并同步内容，准备好再开始搭建。</p>
      </section>
      <button className="primary-button login-cta" type="button" onClick={() => flow.push(route("connect"))}>
        <PersonIcon width={17} height={17} />体验登录并继续
      </button>
      <p className="login-note">原型演示登录，不会提交或保存个人账号信息。</p>
    </Screen>
  );
}

function HomeScreen({ flow }: { flow: FlowControls }) {
  const { baseConnected, firmwareUpdated } = usePrototypeState();
  return (
    <Screen name="home">
      <BrandHeader onProfile={() => flow.push(route("settings"))} onShop={() => flow.push(route("shop"))} />
      <section className="home-intro">
        <p className="eyebrow">亲子故事时间</p>
        <h1>今日一起搭</h1>
        <p>和孩子用积木开启一段新故事吧！</p>
      </section>

      <button className="hero-scene-button" type="button" onClick={() => flow.push(route("detail", featuredStory))} aria-label="查看盘丝洞故事">
        <img src={featuredStory.image} alt="盘丝洞里的积木故事场景" />
        <span className="scene-chip">故事正在等你</span>
      </button>

      <section className="next-story-card">
        <div className="story-copy">
          <span className="orange-label">下一段故事</span>
          <h2>小猴勇闯水晶洞</h2>
          <p>找出会发光的宝石，看看故事会怎么继续。</p>
        </div>
        <img className="crystal-art" src="/assets/lingjing/story-crystal.png" alt="粉色水晶宝石" />
      </section>

      <div className="skill-strip" aria-label="故事能力主题">
        <div><span className="skill-icon skill-green"><CubeIcon width={18} height={18} /></span><span><b>认知关系</b><small>位置与方位</small></span></div>
        <div><span className="skill-icon skill-blue"><ResetIcon width={18} height={18} /></span><span><b>解决问题</b><small>选择与尝试</small></span></div>
        <div><span className="skill-icon skill-orange"><ActivityLogIcon width={18} height={18} /></span><span><b>表达创造</b><small>编出新结局</small></span></div>
      </div>

      <button className="primary-button home-cta" type="button" onClick={() => flow.push(route("stories"))}>
        <PlayIcon width={17} height={17} />
        选择故事开始搭建
      </button>

      <button className="base-status-row" type="button" onClick={() => flow.push(route("connect", featuredStory))}>
        <span className="base-icon"><CubeIcon width={22} height={22} />{baseConnected ? <CheckIcon className="base-check" width={13} height={13} /> : null}</span>
        <span className="base-copy"><b>{baseConnected ? "积木底座已连接" : "底盘尚未连接"}</b><small>{baseConnected ? (firmwareUpdated ? "软件已更新到最新版" : "需要检查底盘软件版本") : "开始搭建前先连接底盘"}</small></span>
        <span className={`connection-dot ${baseConnected ? "" : "is-offline"}`} aria-label={baseConnected ? "已连接" : "未连接"} />
      </button>

      <button className="recent-row" type="button" onClick={() => flow.push(route("records"))}>
        <span className="recent-icon"><ClockIcon width={21} height={21} /></span>
        <span><b>最近的游戏</b><small>三人小队寻宝 · 刚刚</small></span>
        <ChevronRightIcon width={18} height={18} />
      </button>

      <button className="text-link explore-link" type="button" onClick={() => flow.push(route("stories"))}>
        探索全部故事 <ArrowRightIcon width={15} height={15} />
      </button>

      <button className="market-entry" type="button" onClick={() => flow.push(route("shop"))}>
        <span className="market-entry-icon"><CubeIcon width={19} height={19} /></span>
        <span><b>故事商城</b><small>选购故事包与角色积木</small></span>
        <ChevronRightIcon width={18} height={18} />
      </button>
    </Screen>
  );
}

function StoryLibrary({ flow }: { flow: FlowControls }) {
  const { unlockedStoryIds, cameraMode, setCameraMode, cameraPaired, setCameraPaired } = usePrototypeState();
  const [activeAge, setActiveAge] = useState("全部");
  const [pairingOpen, setPairingOpen] = useState(false);
  const toggleCamera = () => {
    if (cameraMode) setCameraMode(false);
    else if (cameraPaired) setCameraMode(true);
    else setPairingOpen(true);
  };
  const ageOptions = ["全部", "3–5岁", "4–6岁", "6–8岁"];
  const visibleStories = stories.filter((story) => activeAge === "全部" || story.age === activeAge);
  return (
    <Screen name="library">
      <PageHeader title="故事世界" eyebrow="把故事搭出来" flow={flow} />
      <section className="library-intro">
        <h1>今天想去哪里？</h1>
        <p>这里有 {visibleStories.length} 段故事可选。点选故事卡，查看内容并继续搭建。</p>
      </section>
      <section className={`library-camera-switch ${cameraMode ? "is-on" : ""}`} aria-label="摄像头进阶玩法">
        <span className="library-camera-icon"><CameraIcon width={19} height={19} /></span>
        <span className="library-camera-copy"><b>摄像头进阶玩法</b><small>{cameraPaired ? (cameraMode ? "已配对 · 已开启，选故事后继续" : "已配对 · 可随时开启") : "首次使用需先配对摄像头"}</small></span>
        <button className={`toggle-switch ${cameraMode ? "active" : ""}`} type="button" role="switch" aria-label="摄像头进阶玩法开关" aria-checked={cameraMode} onClick={toggleCamera}><span /></button>
      </section>
      <div className="filter-row" role="group" aria-label="按年龄筛选故事">
        {ageOptions.map((age) => (
          <button key={age} className={`filter-chip ${activeAge === age ? "selected" : ""}`} type="button" aria-pressed={activeAge === age} onClick={() => setActiveAge(age)}>{age}</button>
        ))}
      </div>
      <div className="story-list" aria-label="可选故事">
        {visibleStories.map((story, index) => (
          <button className={`story-list-card ${index === 0 ? "featured" : ""} ${unlockedStoryIds.includes(story.id) ? "" : "locked"}`} type="button" key={story.id} onClick={() => flow.push(route(unlockedStoryIds.includes(story.id) ? "detail" : "unlock", story))}>
            <div className="story-thumb"><img src={story.image} alt="" /></div>
            <div className="story-list-copy">
              <span className={`story-card-overline ${unlockedStoryIds.includes(story.id) ? "" : "is-locked"}`}>{story.theme} · {story.age}{unlockedStoryIds.includes(story.id) ? "" : " · 待解锁"}</span>
              <strong>{story.title}</strong>
              <small>{story.description}</small>
              <span className={`story-select-action ${unlockedStoryIds.includes(story.id) ? "" : "is-locked"}`}>{unlockedStoryIds.includes(story.id) ? "选择这个故事" : "查看故事包"}<ArrowRightIcon width={13} height={13} /></span>
            </div>
          </button>
        ))}
      </div>
      <div className="offline-note"><CubeIcon width={17} height={17} /><span>故事下载完成后，积木底座也能离线继续讲。</span></div>
      <CameraPairingSheet open={pairingOpen} onOpenChange={setPairingOpen} onPair={() => { setCameraPaired(true); setCameraMode(true); setPairingOpen(false); }} />
    </Screen>
  );
}

function CameraPairingSheet({ open, onOpenChange, onPair }: { open: boolean; onOpenChange: (open: boolean) => void; onPair: () => void }) {
  return <BottomSheet open={open} onOpenChange={onOpenChange} title="配对摄像头" description="首次使用进阶玩法前，请先完成设备配对。">
    <div className="pairing-device-card"><span><CameraIcon width={22} height={22} /></span><div><b>灵境故事摄像头</b><small>请确认设备已通电，并放在底盘附近</small></div><i>待配对</i></div>
    <ol className="pairing-steps"><li><span>1</span>打开摄像头电源</li><li><span>2</span>保持手机靠近摄像头</li><li><span>3</span>点击下方按钮开始配对</li></ol>
    <p className="pairing-demo-note">原型演示：点击后模拟配对成功；实际使用时会搜索附近设备。</p>
    <button className="primary-button pairing-cta" type="button" onClick={onPair}>开始配对并开启玩法 <ArrowRightIcon width={16} height={16} /></button>
  </BottomSheet>;
}

function BrickGlyph({ kind }: { kind: string }) {
  return <span className={`brick-glyph ${kind}`} aria-hidden="true"><i /><b /><em /></span>;
}

function StoryDetail({ story, flow }: { story: Story; flow: FlowControls }) {
  const { cameraMode, setCameraMode, cameraPaired, setCameraPaired } = usePrototypeState();
  const [pairingOpen, setPairingOpen] = useState(false);
  const enableCamera = () => cameraPaired ? setCameraMode(true) : setPairingOpen(true);
  return (
    <Screen name="detail">
      <PageHeader title="故事介绍" eyebrow="准备一起搭建" flow={flow} />
      <div className="detail-cover"><img src={story.image} alt={`${story.shortTitle}积木故事场景`} /><span className="cover-age">适合 {story.age}</span></div>
      <section className="detail-title-block">
        <span className="orange-label">{story.theme}</span>
        <h1>{story.title}</h1>
        <p>{story.description}</p>
      </section>
      <section className="story-route-card">
        <div className="card-title-row"><h3>这一段怎么玩</h3><span>{story.duration}</span></div>
        <ol className="story-steps">
          <li><span>01</span><div><b>先搭出场景</b><small>把山、水和洞穴放到合适的位置</small></div></li>
          <li><span>02</span><div><b>摆放故事角色</b><small>{story.goal}</small></div></li>
          <li><span>03</span><div><b>一起听、一起说</b><small>积木触发语音，AI 接着孩子的话讲下去</small></div></li>
        </ol>
      </section>
      <section className="play-mode-picker" aria-label="选择故事搭建方式">
        <div className="play-mode-heading"><span className="eyebrow">选择搭建方式</span><small>可随时切换</small></div>
        <button className={`play-mode-option ${cameraMode ? "" : "is-selected"}`} type="button" aria-pressed={!cameraMode} onClick={() => setCameraMode(false)}>
          <span className="play-mode-icon base-mode-icon"><CubeIcon width={18} height={18} /></span>
          <span><b>底盘基础玩法</b><small>积木触发语音互动</small></span>
          {!cameraMode ? <CheckIcon className="play-mode-check" width={17} height={17} /> : null}
        </button>
        <button className={`play-mode-option ${cameraMode ? "is-selected is-camera-mode" : ""}`} type="button" aria-pressed={cameraMode} onClick={enableCamera}>
          <span className="play-mode-icon camera-mode-icon"><CameraIcon width={18} height={18} /></span>
          <span><b>进阶玩法 · 摄像头互动</b><small>{cameraPaired ? "已配对，可在搭建页授权预览" : "首次使用需先配对，再在搭建页授权预览"}</small></span>
          {cameraMode ? <CheckIcon className="play-mode-check" width={17} height={17} /> : null}
        </button>
        <button className="mode-shop-link" type="button" onClick={() => flow.push(route("shop", story))}>查看摄像头与故事组合 <ArrowRightIcon width={13} height={13} /></button>
      </section>
      <div className="detail-actions">
        <button className="primary-button" type="button" onClick={() => flow.push(route("sync", story))}>同步故事到实体底盘 <ArrowRightIcon width={17} height={17} /></button>
        <button className="text-link" type="button" onClick={() => flow.push(route("stories"))}>返回故事世界</button>
      </div>
      <CameraPairingSheet open={pairingOpen} onOpenChange={setPairingOpen} onPair={() => { setCameraPaired(true); setCameraMode(true); setPairingOpen(false); }} />
    </Screen>
  );
}

function ConnectBase({ story, flow }: { story: Story; flow: FlowControls }) {
  const { baseConnected, setBaseConnected } = usePrototypeState();
  return (
    <Screen name="connect">
      <PageHeader title="连接故事底盘" eyebrow="设备准备 · 1/2" flow={flow} />
      <section className="connect-heading">
        <span className={`status-pill ${baseConnected ? "is-ready" : "is-waiting"}`}><span className="status-indicator" />{baseConnected ? "底座已连接" : "等待底座连接"}</span>
        <h1>{baseConnected ? "底盘连接成功" : "先连接灵境工坊底盘"}</h1>
        <p>确认底盘已通电并靠近手机。连接完成后，再检查并升级底盘软件。</p>
      </section>
      <div className="connect-image"><img src="/assets/lingjing/story-worlds.png" alt="灵境童创木质积木底座与故事场景" /></div>
      <section className="connect-card">
        <span className="connect-card-icon"><CubeIcon width={23} height={23} /></span>
        <div><strong>灵境工坊底座</strong><small>{baseConnected ? "已连接 · 等待软件版本检查" : "请确认底座电源已打开"}</small></div>
        <button type="button" className="reconnect-button" onClick={() => setBaseConnected(!baseConnected)} aria-pressed={baseConnected}>{baseConnected ? "断开" : "连接"}</button>
      </section>
      <div className="setup-tip"><b>下一步</b><p>连接底盘后，先确认软件为最新版本；更新完成再选择并同步故事。</p></div>
      <button className="primary-button connect-cta" type="button" disabled={!baseConnected} onClick={() => flow.push(route("update", story))}>检查底盘软件版本 <ArrowRightIcon width={17} height={17} /></button>
      <button className="text-link center-link" type="button" onClick={() => flow.push(route("settings"))}>连接遇到问题？查看家庭设置</button>
    </Screen>
  );
}

function BaseSoftwareUpdate({ story, flow }: { story: Story; flow: FlowControls }) {
  const { baseConnected, firmwareUpdated, setFirmwareUpdated } = usePrototypeState();
  return (
    <Screen name="update">
      <PageHeader title="升级底盘软件" eyebrow="设备准备 · 2/2" flow={flow} />
      <section className="connect-heading update-heading">
        <span className={`status-pill ${baseConnected ? "is-ready" : "is-waiting"}`}><span className="status-indicator" />{baseConnected ? "底座在线" : "底座未连接"}</span>
        <h1>{firmwareUpdated ? "底盘已经是最新版" : "先更新，再开始故事"}</h1>
        <p>{firmwareUpdated ? "软件更新完成。接下来选择一个故事，再把内容同步到底盘。" : "新版软件可改善角色识别与故事同步体验。请保持底盘连接。"}</p>
      </section>
      <section className="version-card">
        <div className="version-state"><span className={`version-icon ${firmwareUpdated ? "is-complete" : ""}`}>{firmwareUpdated ? <CheckIcon width={21} height={21} /> : <CubeIcon width={21} height={21} />}</span><span><small>灵境工坊底盘</small><b>{firmwareUpdated ? "已更新到最新版本" : "发现可用更新"}</b></span></div>
        <div className="version-values"><span><small>{firmwareUpdated ? "当前版本" : "当前版本"}</small><b>{firmwareUpdated ? "v1.4.2" : "v1.3.8"}</b></span><ArrowRightIcon width={17} height={17} /><span><small>最新版本</small><b>v1.4.2</b></span></div>
        <div className="version-details"><span><CheckIcon width={14} height={14} />角色识别优化</span><span><CheckIcon width={14} height={14} />故事同步稳定性提升</span><span><CheckIcon width={14} height={14} />离线播放体验优化</span></div>
      </section>
      <div className="assessment-demo-note update-demo-note"><b>演示状态</b><span>版本号和升级结果用于交互演示，不会实际写入底盘固件。</span></div>
      {!firmwareUpdated ? <button className="primary-button connect-cta" type="button" disabled={!baseConnected} onClick={() => setFirmwareUpdated(true)}>升级到最新版 <ArrowRightIcon width={17} height={17} /></button> : null}
      <button className="primary-button update-continue" type="button" disabled={!firmwareUpdated} onClick={() => flow.replace(route("home", story))}>继续选择故事 <ArrowRightIcon width={17} height={17} /></button>
      {!baseConnected ? <button className="text-link center-link" type="button" onClick={() => flow.push(route("connect", story))}>返回连接底盘</button> : null}
    </Screen>
  );
}

function StorySync({ story, flow }: { story: Story; flow: FlowControls }) {
  const { baseConnected, firmwareUpdated, cameraMode } = usePrototypeState();
  const [synced, setSynced] = useState(false);
  const canSync = baseConnected && firmwareUpdated;
  return (
    <Screen name="sync">
      <PageHeader title="同步故事到底盘" eyebrow={`${story.shortTitle} · 开始搭建前`} flow={flow} />
      <section className="sync-intro">
        <span className={`status-pill ${canSync ? "is-ready" : "is-waiting"}`}><span className="status-indicator" />{synced ? "同步完成" : canSync ? "底盘已就绪" : "需要先准备底盘"}</span>
        <h1>{synced ? "故事已到达底盘" : "把故事信息同步到实体底盘"}</h1>
        <p>{synced ? "现在可以放上积木，开始搭建故事场景。" : "同步后，底盘才能识别本故事的角色、场景与位置关系。"}</p>
      </section>
      <section className="sync-story-card">
        <img src={story.image} alt={`${story.shortTitle}故事场景`} />
        <div><span className="orange-label">{story.theme}</span><b>{story.title}</b><small>适合 {story.age} · {story.duration}</small></div>
      </section>
      {cameraMode ? <div className="sync-camera-note"><CameraIcon width={16} height={16} /><span><b>已选择摄像头进阶玩法</b><small>故事同步完成后，可在搭建页授权本机摄像头预览。</small></span></div> : null}
      <section className="sync-checklist">
        <h2>本次同步内容</h2>
        <div><span className="sync-check-icon"><CheckIcon width={14} height={14} /></span><span><b>故事脚本与语音片段</b><small>让底盘按故事阶段播放反馈</small></span></div>
        <div><span className="sync-check-icon"><CheckIcon width={14} height={14} /></span><span><b>角色识别信息</b><small>匹配本故事需要的积木角色</small></span></div>
        <div><span className="sync-check-icon"><CheckIcon width={14} height={14} /></span><span><b>场景和位置关系</b><small>识别摆放结果并推进故事</small></span></div>
      </section>
      {!synced ? <button className="primary-button sync-action" type="button" disabled={!canSync} onClick={() => setSynced(true)}>同步故事信息 <ArrowRightIcon width={17} height={17} /></button> : <div className="sync-success"><CheckIcon width={16} height={16} />{story.shortTitle}已同步 · 底盘可离线播放</div>}
      <button className="primary-button sync-action" type="button" disabled={!synced} onClick={() => flow.push(route("play", story))}>开始故事搭建 <PlayIcon width={16} height={16} /></button>
      {!baseConnected ? <button className="text-link center-link" type="button" onClick={() => flow.push(route("connect", story))}>先连接底盘</button> : !firmwareUpdated ? <button className="text-link center-link" type="button" onClick={() => flow.push(route("update", story))}>先升级底盘软件</button> : null}
    </Screen>
  );
}

function PlayStory({ story, flow }: { story: Story; flow: FlowControls }) {
  const [playing, setPlaying] = useState(false);
  const [correct, setCorrect] = useState(true);
  const { cameraMode, setCameraMode } = usePrototypeState();
  return (
    <Screen name="play">
      <PageHeader title="故事搭建" eyebrow={`已同步到底盘 · ${story.shortTitle}`} flow={flow} />
      <div className="play-scene"><img src={story.image} alt="正在进行的积木故事场景" /><span className={`status-pill ${correct ? "is-ready" : "is-waiting"}`}><span className="status-indicator" />{correct ? "已识别 3 个角色" : "角色位置待调整"}</span></div>
      <StoryCameraPanel enabled={cameraMode} onEnable={() => setCameraMode(true)} onDisable={() => setCameraMode(false)} />
      <section className="relation-card">
        <div className="card-title-row"><h3>角色现在这样站着</h3><span>位置关系</span></div>
        <div className={`relation-flow ${correct ? "relation-correct" : "relation-pending"}`}>
          <div className="role-node"><small>师父</small><b>唐僧</b></div>
          <ChevronRightIcon className="relation-arrow" width={17} height={17} />
          <div className="role-node role-hero"><small>{correct ? "中间 · 守护者" : "试着放在中间"}</small><b>悟空</b></div>
          <ChevronRightIcon className="relation-arrow" width={17} height={17} />
          <div className="role-node"><small>对面</small><b>蜘蛛精</b></div>
        </div>
      </section>
      <section className="narrator-card">
        <div className="narrator-head"><span className="narrator-mark"><SpeakerLoudIcon width={16} height={16} /></span><b>AI 故事伙伴</b><button type="button" className="audio-button" aria-label={playing ? "暂停故事语音" : "播放故事语音"} aria-pressed={playing} onClick={() => setPlaying((value) => !value)}>{playing ? <PauseIcon width={17} height={17} /> : <PlayIcon width={17} height={17} />}</button></div>
        <p>{correct ? "蜘蛛精设下了蛛网，想抓住唐僧！悟空站在师父和蜘蛛精之间，接下来会发生什么？" : "试着把悟空放到唐僧和蜘蛛精之间，再看看故事会怎么发展。"}</p>
        <small className="audio-state" aria-live="polite">{playing ? "正在播放故事语音 · 点击暂停" : "轻点播放，和孩子一起听"}</small>
      </section>
      <button className="secondary-button retry-button" type="button" onClick={() => setCorrect((value) => !value)}><ResetIcon width={16} height={16} />{correct ? "试试另一种摆法" : "重新识别摆放"}</button>
      <button className="primary-button" type="button" onClick={() => flow.push(route("assessment", story))}>完成并查看阶段评估 <ArrowRightIcon width={17} height={17} /></button>
    </Screen>
  );
}

function StoryCameraPanel({ enabled, onEnable, onDisable }: { enabled: boolean; onEnable: () => void; onDisable: () => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
    return () => stream?.getTracks().forEach((track) => track.stop());
  }, [stream]);

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("当前预览环境暂不支持摄像头访问，可以继续使用底盘基础玩法。");
      return;
    }
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      setStream(nextStream);
      onEnable();
    } catch {
      setCameraError("没有获得摄像头权限。你可以在浏览器设置中授权，或继续使用底盘基础玩法。");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    onDisable();
  };

  return (
    <section className={`camera-play-card ${enabled ? "is-enabled" : ""}`}>
      <div className="camera-play-heading">
        <span className="play-mode-icon camera-mode-icon"><CameraIcon width={17} height={17} /></span>
        <span><b>{enabled ? "摄像头进阶玩法" : "开启摄像头进阶玩法"}</b><small>{stream ? "本机镜头已开启 · 识别状态为演示" : "可选体验 · 需家长在本机授权"}</small></span>
      </div>
      {stream ? <div className="camera-preview"><video ref={videoRef} autoPlay muted playsInline aria-label="本机摄像头预览" /><span>仅本机预览 · 不录制、不上传</span></div> : null}
      <p className="camera-privacy-note">摄像头画面只用于本机预览；退出故事会关闭镜头。实体镜头模块与画面识别仍为原型演示。</p>
      {cameraError ? <p className="camera-error" role="status">{cameraError}</p> : null}
      {stream ? <button className="camera-toggle-button is-on" type="button" onClick={stopCamera}>关闭摄像头</button> : <button className="camera-toggle-button" type="button" onClick={() => { onEnable(); void startCamera(); }}>授权并开启摄像头</button>}
      {enabled && !stream ? <button className="camera-basic-link" type="button" onClick={onDisable}>改用底盘基础玩法</button> : null}
    </section>
  );
}

const sessions = [
  { story: stories[1], state: "刚刚完成", note: "摆好三位角色，继续听到水晶洞的秘密。", minutes: "12 分钟" },
  { story: stories[0], state: "最近完成", note: "发现瀑布后面的水帘洞，完成大小树洞配对。", minutes: "8 分钟" },
  { story: stories[2], state: "继续探索", note: "已经找到线索，下一步试着辨认白骨精的伪装。", minutes: "进行中" },
];

function Records({ flow }: { flow: FlowControls }) {
  const [filter, setFilter] = useState("全部");
  const options = ["全部", "已完成", "继续探索"];
  const filtered = sessions.filter((session) => filter === "全部" || session.state.includes(filter === "已完成" ? "完成" : "继续"));
  return (
    <Screen name="records">
      <PageHeader title="互动记录" eyebrow="每一次搭建都有发现" flow={flow} />
      <section className="records-summary"><div><span className="eyebrow">亲子共玩</span><h1>一起完成了 5 段故事</h1><p>记录孩子的探索与表达。</p></div><span className="summary-icon"><ActivityLogIcon width={23} height={23} /></span></section>
      <div className="filter-row record-filters" role="group" aria-label="筛选互动记录">
        {options.map((option) => <button key={option} className={`filter-chip ${filter === option ? "selected" : ""}`} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
      </div>
      <div className="record-list">
        {filtered.map((session) => (
          <button className="record-card" key={session.story.id} type="button" onClick={() => flow.push(route("record", session.story))}>
            <img src={session.story.image} alt="" />
            <span className="record-card-copy"><b>{session.story.title}</b><small>{session.state} · {session.minutes}</small><span>{session.state.includes("完成") ? "含本段阶段评估 · " : ""}{session.note}</span></span>
            <ChevronRightIcon width={17} height={17} />
          </button>
        ))}
      </div>
      <div className="offline-note"><ClockIcon width={17} height={17} /><span>互动记录会在故事结束后保存在这里。</span></div>
    </Screen>
  );
}

function RecordDetail({ story, flow }: { story: Story; flow: FlowControls }) {
  return (
    <Screen name="record-detail">
      <PageHeader title="互动回顾" eyebrow="亲子故事记录" flow={flow} />
      <div className="detail-cover record-cover"><img src={story.image} alt={`${story.shortTitle}故事场景`} /><span className="cover-age"><CheckIcon width={13} height={13} /> 本段已完成</span></div>
      <section className="detail-title-block">
        <span className="orange-label">{story.theme}</span>
        <h1>{story.title}</h1>
        <p>这次，孩子通过摆放角色发现了故事里的位置关系。</p>
      </section>
      <button className="assessment-entry" type="button" onClick={() => flow.push(route("assessment", story))}>
        <span className="assessment-entry-icon"><ActivityLogIcon width={18} height={18} /></span>
        <span><b>查看本段阶段评估</b><small>六维互动观察 · 同龄参考演示</small></span>
        <ChevronRightIcon width={17} height={17} />
      </button>
      <div className="record-stats"><div><b>3</b><small>识别角色</small></div><div><b>12′</b><small>共玩时间</small></div><div><b>1 段</b><small>故事进度</small></div></div>
      <section className="reflection-card"><b>今天的故事片段</b><p>蜘蛛精设下了蛛网，悟空挡在师父前面。孩子接着猜想：我们还能用哪些积木帮他们找到出口？</p></section>
      <button className="primary-button" type="button" onClick={() => flow.push(route("sync", story))}>重新同步并再玩一次 <ResetIcon width={16} height={16} /></button>
      <button className="text-link center-link" type="button" onClick={() => flow.push(route("records"))}>返回互动记录</button>
    </Screen>
  );
}

type AssessmentMetric = {
  label: string;
  title: string;
  score: number;
  peer: number;
  observation: string;
};

const assessmentSamples: Record<string, AssessmentMetric[]> = {
  mountain: [
    { label: "动作操作", title: "精细操作与大小配对", score: 74, peer: 70, observation: "拆装瀑布小件，并把树与树洞按大小配对摆放。" },
    { label: "语言理解", title: "词汇理解与问题回应", score: 70, peer: 71, observation: "听懂“瀑布后面是什么”等提示，并找到对应场景。" },
    { label: "语言表达", title: "物体命名与简单表达", score: 72, peer: 69, observation: "说出“山、水、树、洞”，并向家长分享发现。" },
    { label: "关系推理", title: "大小概念与隐藏关系", score: 79, peer: 72, observation: "依据大小完成配对，发现水帘洞与瀑布的关系。" },
    { label: "社会互动", title: "共同注意与分享", score: 73, peer: 71, observation: "与家长轮流指认场景，把新发现指给他人看。" },
    { label: "探索反思", title: "好奇追问与持续探索", score: 81, peer: 70, observation: "反复探索瀑布后方，主动追问“后面是什么”。" },
  ],
  spider: [
    { label: "动作操作", title: "角色摆放与动作计划", score: 78, peer: 72, observation: "拿起并摆放三位角色积木，主动调整过站位。" },
    { label: "语言理解", title: "空间指令与方位词理解", score: 74, peer: 71, observation: "听懂把悟空放在唐僧和蜘蛛精“之间”的提示。" },
    { label: "语言表达", title: "因果表达与说明理由", score: 68, peer: 70, observation: "回答“悟空为什么站在中间”，并尝试说明理由。" },
    { label: "关系推理", title: "位置关系与角色理解", score: 82, peer: 74, observation: "用站位表达保护师父的想法，理解前后与间隔。" },
    { label: "社会互动", title: "轮流协商与回应", score: 73, peer: 72, observation: "与家长轮流摆放角色，并回应调整建议。" },
    { label: "探索反思", title: "策略调整与结果观察", score: 76, peer: 71, observation: "尝试另一种摆法，再观察故事发生了什么变化。" },
  ],
  bones: [
    { label: "动作操作", title: "角色排序与材料操作", score: 75, peer: 71, observation: "按线索调整角色顺序，并完成故事场景摆放。" },
    { label: "语言理解", title: "线索理解与任务回应", score: 72, peer: 72, observation: "听取线索后寻找相关角色，并回应故事提问。" },
    { label: "语言表达", title: "事件复述与理由表达", score: 77, peer: 73, observation: "复述关键线索，并尝试说出自己的判断理由。" },
    { label: "关系推理", title: "线索比较与情节顺序", score: 79, peer: 75, observation: "比较线索、排列事件，并预测故事的下一步。" },
    { label: "社会互动", title: "观点分享与共同决策", score: 74, peer: 73, observation: "与家长交流线索，分享自己的角色判断。" },
    { label: "探索反思", title: "更新想法与策略调整", score: 78, peer: 72, observation: "发现新线索后重新安排角色，并解释改变的原因。" },
  ],
};

const radarAngles = [-90, -30, 30, 90, 150, 210];

function radarPoint(value: number, angle: number, radius: number, center = 140) {
  const radians = (angle * Math.PI) / 180;
  const distance = (value / 100) * radius;
  return `${(center + Math.cos(radians) * distance).toFixed(1)},${(center + Math.sin(radians) * distance).toFixed(1)}`;
}

function AssessmentRadar({ metrics }: { metrics: AssessmentMetric[] }) {
  const valuePoints = metrics.map((metric, index) => radarPoint(metric.score, radarAngles[index], 70)).join(" ");
  const peerPoints = metrics.map((metric, index) => radarPoint(metric.peer, radarAngles[index], 70)).join(" ");
  const labels = metrics.map((metric, index) => {
    const [x, y] = radarPoint(100, radarAngles[index], 107).split(",").map(Number);
    const anchor = x < 130 ? "end" : x > 150 ? "start" : "middle";
    return <text key={metric.label} x={x} y={y} textAnchor={anchor} dominantBaseline="middle">{metric.label}</text>;
  });
  return (
    <svg className="assessment-radar" viewBox="0 0 280 280" role="img" aria-label="六项观察雷达图：本次表现与同龄参考演示值">
      <title>本次故事互动六项观察，与同龄参考演示值对照</title>
      {[25, 50, 75, 100].map((level) => <polygon key={level} className="assessment-radar-grid" points={radarAngles.map((angle) => radarPoint(level, angle, 70)).join(" ")} />)}
      {radarAngles.map((angle) => <line key={angle} className="assessment-radar-axis" x1="140" y1="140" x2={radarPoint(100, angle, 70).split(",")[0]} y2={radarPoint(100, angle, 70).split(",")[1]} />)}
      <polygon className="assessment-radar-peer" points={peerPoints} />
      <polygon className="assessment-radar-current" points={valuePoints} />
      {metrics.map((metric, index) => {
        const [x, y] = radarPoint(metric.score, radarAngles[index], 70).split(",");
        return <circle key={`${metric.label}-point`} className="assessment-radar-dot" cx={x} cy={y} r="3" />;
      })}
      {labels}
    </svg>
  );
}

function StageAssessment({ story, flow }: { story: Story; flow: FlowControls }) {
  const { childAge } = usePrototypeState();
  const metrics = assessmentSamples[story.id] ?? assessmentSamples.spider;
  return (
    <Screen name="assessment">
      <PageHeader title="阶段成长报告" eyebrow="本段故事互动评估" flow={flow} />
      <section className="assessment-intro">
        <span className="assessment-kicker">故事完成 · 已生成阶段观察</span>
        <h1>{story.shortTitle}的故事发现</h1>
        <p>结合孩子本次的积木操作、语言表达和情节选择，整理一份亲子共玩参考。</p>
      </section>
      <section className="assessment-reference">
        <div><span className="assessment-reference-icon"><ActivityLogIcon width={19} height={19} /></span><span><b>同龄水平参考</b><small>按孩子资料中的年龄匹配</small></span></div>
        <strong>{childAge}</strong>
      </section>
      <div className="assessment-demo-note"><b>演示数据</b><span>雷达图分值仅用于展示报告样式，不代表真实儿童样本结论。正式评估需依据经确认的观察标准与同龄样本。</span></div>
      <section className="assessment-radar-card">
        <div className="assessment-section-heading"><h2>六维互动观察</h2><span>0–100 演示分</span></div>
        <AssessmentRadar metrics={metrics} />
        <div className="assessment-legend"><span><i className="legend-current" />本次表现</span><span><i className="legend-peer" />同龄参考（演示）</span></div>
      </section>
      <section className="assessment-metrics">
        <div className="assessment-section-heading"><h2>评估项与观察证据</h2><span>结合本故事互动记录</span></div>
        {metrics.map((metric) => (
          <article className="assessment-metric" key={metric.label}>
            <div className="assessment-metric-heading"><div><span>{metric.label}</span><b>{metric.title}</b></div><strong>{metric.score}</strong></div>
            <p>{metric.observation}</p>
            <div className="assessment-score-pair"><span>本次 <b>{metric.score}</b></span><span>同龄参考 <b>{metric.peer}</b></span></div>
            <div className="assessment-track" aria-label={`本次表现 ${metric.score}，同龄参考 ${metric.peer}`}>
              <span className="assessment-current-bar" style={{ width: `${metric.score}%` }} />
              <i className="assessment-peer-marker" style={{ left: `${metric.peer}%` }} />
            </div>
          </article>
        ))}
      </section>
      <section className="assessment-tip"><b>下一次共玩可以试试</b><p>留一点时间让孩子自己摆放，再邀请孩子讲讲“为什么这样放”，把操作、表达和故事理解自然连起来。</p></section>
      <div className="assessment-disclaimer">成长参考用于亲子互动回顾，不作为诊断或筛查结论。</div>
      <button className="primary-button" type="button" onClick={() => flow.push(route("record", story))}>查看互动回顾 <ArrowRightIcon width={17} height={17} /></button>
      <button className="text-link center-link" type="button" onClick={() => flow.push(route("records"))}>查看全部成长记录</button>
    </Screen>
  );
}

function StoryUnlock({ story, flow }: { story: Story; flow: FlowControls }) {
  const { unlockedStoryIds } = usePrototypeState();
  const unlocked = unlockedStoryIds.includes(story.id);
  return (
    <Screen name="unlock">
      <PageHeader title="故事解锁" eyebrow="把下一段冒险带回家" flow={flow} />
      <div className="detail-cover unlock-cover"><img src={story.image} alt={`${story.shortTitle}故事场景`} /><span className="cover-age">适合 {story.age}</span></div>
      <section className="detail-title-block">
        <span className="orange-label">{story.theme} · 故事包</span>
        <h1>{story.title}</h1>
        <p>解锁后即可体验完整故事互动，并在故事结束后生成阶段评估。</p>
      </section>
      <section className="unlock-offer"><div><b>灵境童创故事包</b><small>角色识别 · AI 故事互动 · 阶段成长记录</small></div><strong>¥49<span> 演示价</span></strong></section>
      <div className="assessment-demo-note"><b>商城演示</b><span>价格和解锁操作均为原型示意，不会产生真实订单或扣款。</span></div>
      <button className="primary-button" type="button" onClick={() => flow.push(unlocked ? route("detail", story) : route("shop", story))}>{unlocked ? "开始故事" : "前往商城查看"} <ArrowRightIcon width={17} height={17} /></button>
      <button className="text-link center-link" type="button" onClick={() => flow.push(route("stories"))}>返回故事世界</button>
    </Screen>
  );
}

function StoryShop({ story, flow }: { story: Story; flow: FlowControls }) {
  const { unlockedStoryIds, unlockStory, cartItems, addCartItem, removeCartItem } = usePrototypeState();
  const [category, setCategory] = useState("全部");
  const [orderMessage, setOrderMessage] = useState("");
  const [missingPartsOpen, setMissingPartsOpen] = useState(false);
  const [missingParts, setMissingParts] = useState<MissingPart[]>([]);
  const categories = ["全部", "单品", "组合优惠", "新增积木"];
  const showSingles = category === "全部" || category === "单品";
  const showBundles = category === "全部" || category === "组合优惠";
  const showBricks = category === "全部" || category === "新增积木";
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);
  const historyInventory = [
    { name: "唐僧", quantity: 1, kind: "brick-monk" },
    { name: "悟空", quantity: 1, kind: "brick-monkey" },
    { name: "蜘蛛精", quantity: 1, kind: "brick-spider" },
    { name: "基础地台", quantity: 1, kind: "brick-base" },
    { name: "水晶洞", quantity: 1, kind: "brick-cave" },
    { name: "水晶宝石", quantity: 2, kind: "brick-gem" },
  ];
  const forestMissingParts: MissingPart[] = [
    { id: "forest-board", name: "森林场景板", quantity: 1, price: 35, kind: "brick-forest" },
    { id: "forest-fox", name: "狐狸角色", quantity: 1, price: 24, kind: "brick-fox" },
    { id: "forest-chest", name: "寻宝箱", quantity: 1, price: 20, kind: "brick-chest" },
  ];
  const storyPack = (target: Story): CartItem => ({ id: `story-pack-${target.id}`, name: `${target.shortTitle}电子故事包`, price: target.id === "mountain" ? 39 : 49, storyId: target.id });
  const addBundle = (id: string, name: string, price: number) => addCartItem({ id: `${id}-${story.id}`, name: `${name}（含${story.shortTitle}故事包）`, price, storyId: story.id });
  const addStoryPack = (target: Story) => {
    const item = storyPack(target);
    if (cartItems.some((cartItem) => cartItem.id === item.id)) return;
    addCartItem(item);
    if (target.id === "forest") {
      setMissingParts([...forestMissingParts]);
      setMissingPartsOpen(true);
    }
  };
  const addSelectedMissingParts = () => {
    missingParts.forEach((part) => addCartItem({ id: part.id, name: `${part.name} ×${part.quantity}`, price: part.price }));
    setMissingPartsOpen(false);
  };

  const finishDemoOrder = () => {
    const purchasedStories = cartItems.filter((item) => item.storyId).map((item) => item.storyId as string);
    purchasedStories.forEach(unlockStory);
    setOrderMessage(purchasedStories.length ? "演示订单完成：电子故事已解锁，实体积木可按需选购。" : "演示订单已完成，商品与价格仅用于体验流程。 ");
    cartItems.forEach((item) => removeCartItem(item.id));
  };

  return (
    <Screen name="shop">
      <PageHeader title="故事商城" eyebrow="底座 · 故事 · 摄像头 · 积木" flow={flow} action={<span className="shop-header-cart"><BackpackIcon width={16} height={16} />购物袋 {cartItems.length}</span>} />
      <section className="order-inventory-card" aria-label="历史订单积木库存汇总">
        <div className="order-inventory-heading"><b>历史订单 · 已有零件</b><span>{historyInventory.length} 类 · {historyInventory.reduce((total, part) => total + part.quantity, 0)} 件</span></div>
        <div className="inventory-quantity-grid">{historyInventory.map((part) => <div className="inventory-quantity-chip" key={part.name}><BrickGlyph kind={part.kind} /><span>{part.name}</span><b>×{part.quantity}</b></div>)}</div>
        <div className="history-order-caption">小猴勇闯水晶洞 · 4–6 岁故事包订单</div>
      </section>

      <section className="cart-summary" aria-label="购物袋">
        <div className="cart-summary-heading"><span className="cart-summary-icon"><BackpackIcon width={18} height={18} /></span><span><b>购物袋</b><small>{cartItems.length ? `${cartItems.length} 件商品 · 演示金额` : "先选单品或优惠组合，再来这里结算"}</small></span><strong>¥{cartTotal}</strong></div>
        {cartItems.length ? <>
          <div className="cart-lines">{cartItems.map((item) => <div className="cart-line" key={item.id}><span>{item.name}</span><b>¥{item.price}</b><button className="cart-remove-button" type="button" aria-label={`从购物袋移除${item.name}`} title={`移除${item.name}`} onClick={() => removeCartItem(item.id)}>×</button></div>)}</div>
          <button className="primary-button cart-checkout" type="button" onClick={finishDemoOrder}>演示结算并解锁电子故事</button>
        </> : <p className="cart-empty-copy">购物袋为空。故事电子版可先解锁，实体积木也可以单独或按清单补购。</p>}
        {orderMessage ? <p className="order-message" role="status">{orderMessage}</p> : null}
      </section>

      <div className="filter-row shop-categories" role="group" aria-label="商城商品分类">
        {categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "selected" : ""}`} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>

      {showBundles ? <section className="shop-products bundle-products">
        <div className="shop-section-title"><h2>推荐组合 · 更划算</h2><span>已按当前故事搭配</span></div>
        <article className="bundle-feature-card">
          <div className="bundle-ribbon">推荐搭配 · 立省 ¥48</div>
          <div className="bundle-feature-top"><span className="bundle-icon"><CubeIcon width={21} height={21} /></span><span><b>完整共玩组合</b><small>故事底座 + 摄像头 +《{story.shortTitle}》电子故事包</small></span></div>
          <div className="bundle-price-row"><strong>¥499</strong><del>单买 ¥547</del><span>演示优惠</span></div>
          <button className="bundle-add-button" type="button" onClick={() => addBundle("bundle-full", "完整共玩组合", 499)}>加入购物袋</button>
        </article>
        <div className="bundle-grid">
          <article className="bundle-card"><span className="bundle-small-tag">故事入门组合 · 省 ¥19</span><b>底座 + 故事包</b><small>含《{story.shortTitle}》电子版</small><div><strong>¥329</strong><del>¥348</del></div><button type="button" onClick={() => addBundle("bundle-base-story", "故事入门组合", 329)}>加入购物袋</button></article>
          <article className="bundle-card camera-bundle"><span className="bundle-small-tag">镜头进阶组合 · 省 ¥29</span><b>摄像头 + 故事包</b><small>含《{story.shortTitle}》电子版</small><div><strong>¥219</strong><del>¥248</del></div><button type="button" onClick={() => addBundle("bundle-camera-story", "摄像头进阶组合", 219)}>加入购物袋</button></article>
        </div>
      </section> : null}

      {showSingles ? <section className="shop-products singles-products">
        <div className="shop-section-title"><h2>单品选购</h2><span>底座、故事包、摄像头可单买</span></div>
        <article className="shop-product"><span className="product-visual base-product-visual"><CubeIcon width={24} height={24} /></span><div className="shop-product-copy"><span>实体设备 · 单品</span><b>灵境工坊故事底座</b><small>感应积木摆放，触发语音互动</small><strong>¥299<em> 演示价</em></strong></div><button className="shop-action" type="button" onClick={() => addCartItem({ id: "base-single", name: "灵境工坊故事底座", price: 299 })}>加入购物袋</button></article>
        <article className="shop-product"><span className="product-visual camera-product-visual"><CameraIcon width={24} height={24} /></span><div className="shop-product-copy"><span>进阶配件 · 单品</span><b>摄像头互动模块</b><small>开启场景预览与进阶玩法</small><strong>¥199<em> 演示价</em></strong></div><button className="shop-action" type="button" onClick={() => addCartItem({ id: "camera-single", name: "摄像头互动模块", price: 199 })}>加入购物袋</button></article>
        {stories.map((target) => {
          const unlocked = unlockedStoryIds.includes(target.id);
          const item = storyPack(target);
          const inCart = cartItems.some((cartItem) => cartItem.id === item.id);
          return <article className="shop-product" key={target.id}>
            <img src={target.image} alt="" />
            <div className="shop-product-copy"><span>{target.age} · 电子故事包</span><b>{target.title}</b><small>{unlocked ? "电子版已解锁 · 可选购实体积木" : "在线购买先解锁电子版，积木可另选"}</small><strong>¥{item.price}<em> 演示价</em></strong></div>
            <button className={`shop-action ${unlocked ? "is-unlocked" : ""}`} type="button" disabled={unlocked || inCart} onClick={() => addStoryPack(target)}>{unlocked ? "已解锁" : inCart ? "已加入" : "加入购物袋"}</button>
          </article>;
        })}
      </section> : null}

      {showBricks ? <section className="shop-products brick-recommendation">
        <div className="shop-section-title"><h2>按需补购积木</h2><span>根据历史订单演示推断</span></div>
        <article className="order-match-card">
          <div className="order-match-header"><span className="order-check-icon"><CheckIcon width={14} height={14} /></span><span><b>已购《小猴勇闯水晶洞》</b><small>历史订单 · 4–6 岁故事级别 · 电子版已解锁</small></span></div>
          <div className="level-match-note">系统为同等级新故事《森林寻宝》比对已拥有积木</div>
          <p className="order-match-copy">同等级新故事：3 件可共用，另有 3 件需补购。加入故事包后可逐件删减并合并结算。</p>
          <div className="brick-list-footer"><strong>预计新增 3 件积木 <em>合计 ¥79 演示价</em></strong><button className="shop-action" type="button" disabled={forestMissingParts.every((part) => cartItems.some((item) => item.id === part.id))} onClick={() => { if (!cartItems.some((item) => item.id === "story-pack-forest")) addStoryPack(stories.find((target) => target.id === "forest")!); else { setMissingParts(forestMissingParts.filter((part) => !cartItems.some((item) => item.id === part.id))); setMissingPartsOpen(true); } }}>查看缺件清单</button></div>
        </article>
      </section> : null}

      <div className="shop-demo-note">商品、价格、历史订单推断和组合优惠均为演示内容；结算不会产生真实订单或扣款。</div>
      <BottomSheet open={missingPartsOpen} onOpenChange={setMissingPartsOpen} title="森林寻宝 · 需要补购的积木" description="已把电子故事包加入购物袋。你的历史订单中已找到可共用角色与底座，只列出本次缺少的零件。">
        <div className="missing-part-list">{missingParts.length ? missingParts.map((part) => <div className="missing-part-tile" key={part.id}><button className="missing-part-remove" type="button" aria-label={`从补购清单移除${part.name}`} title={`移除${part.name}`} onClick={() => setMissingParts((current) => current.filter((item) => item.id !== part.id))}>×</button><BrickGlyph kind={part.kind} /><b>{part.name}</b><span className="missing-part-quantity">×{part.quantity}</span><small>¥{part.price}</small></div>) : <p className="missing-parts-empty">清单已清空。电子故事包仍在购物袋中，可以继续选购或结算。</p>}</div>
        <div className="missing-parts-total"><span>已选 {missingParts.length} 件积木</span><b>¥{missingParts.reduce((total, part) => total + part.price, 0)}</b></div>
        <button className="primary-button missing-parts-cta" type="button" disabled={!missingParts.length} onClick={addSelectedMissingParts}>把所选积木加入购物袋 <ArrowRightIcon width={16} height={16} /></button>
        <button className="missing-parts-skip" type="button" onClick={() => setMissingPartsOpen(false)}>只保留电子故事包</button>
      </BottomSheet>
    </Screen>
  );
}

function Settings({ flow }: { flow: FlowControls }) {
  const { childAge, setChildAge, baseConnected, setBaseConnected, firmwareUpdated } = usePrototypeState();
  return (
    <Screen name="settings">
      <PageHeader title="家庭设置" eyebrow="一起玩得刚刚好" flow={flow} />
      <section className="family-card"><span className="family-avatar"><PersonIcon width={24} height={24} /></span><div><span className="eyebrow">小小故事家</span><h1>孩子资料</h1><p>同龄参考按已选年龄匹配。</p></div></section>
      <section className="settings-section"><div className="settings-title"><h3>孩子年龄</h3><small>用于推荐与同龄参考</small></div><div className="age-picker" role="group" aria-label="孩子年龄">{["3岁", "4岁", "5岁", "6岁", "7岁", "8岁"].map((item) => <button key={item} className={`age-option ${childAge === item ? "active" : ""}`} type="button" aria-pressed={childAge === item} onClick={() => setChildAge(item)}>{item}</button>)}</div></section>
      <section className="settings-section device-settings"><div className="settings-title"><h3>积木底座</h3><span className={`mini-status ${baseConnected ? "on" : "off"}`}><i />{baseConnected ? "已连接" : "未连接"}</span></div><div className="setting-row"><span className="setting-icon"><CubeIcon width={19} height={19} /></span><span><b>灵境工坊底座</b><small>{baseConnected ? "在线 · 可同步故事内容" : "打开底座电源后连接"}</small></span><button type="button" className={`toggle-switch ${baseConnected ? "active" : ""}`} aria-label="切换底座连接状态" aria-pressed={baseConnected} onClick={() => setBaseConnected(!baseConnected)}><span /></button></div><div className="setting-row"><span className="setting-icon setting-orange"><ClockIcon width={19} height={19} /></span><span><b>底盘软件版本</b><small>{firmwareUpdated ? "已是最新版 v1.4.2" : "有可用更新，建议升级"}</small></span><button type="button" className="reconnect-button" onClick={() => flow.push(route("update"))}>{firmwareUpdated ? "查看" : "更新"}</button></div></section>
      <button className="settings-link" type="button" onClick={() => flow.push(route("records"))}><span className="setting-icon setting-blue"><ActivityLogIcon width={19} height={19} /></span><span><b>互动记录</b><small>回看一起完成的故事</small></span><ChevronRightIcon width={17} height={17} /></button>
      <button className="settings-link" type="button" onClick={() => flow.push(route("shop"))}><span className="setting-icon"><CubeIcon width={19} height={19} /></span><span><b>故事商城</b><small>浏览故事包与角色积木</small></span><ChevronRightIcon width={17} height={17} /></button>
      <div className="settings-footer"><img src="/assets/lingjing/brand-mark.svg" alt="" /><span>灵境童创 · 把故事搭出来</span></div>
    </Screen>
  );
}
