// ============================================================
// lib/attacker-data.ts
// Single source of truth cho toàn bộ dữ liệu ATTACKER
// ============================================================

export interface Prize {
  rank: string;
  value: string;
  icon: string;
}

export interface TeamEntry {
  name: string;
  idea: string;
  image: string;
  description: string;
}

export interface SeasonOverview {
  socialReach: string;
  accounts: string;
  teams: string;
  universities: string;
  successRate: string;
}

export interface Sponsor {
  name: string;
  logo: string;
}

export interface Round {
  name: string;
  detail: string;
}

export interface AttackerSeason {
  year: string;
  theme: string;
  journeyDescription: string;
  banner: string;
  overview: SeasonOverview;
  sponsors: {
    diamond: Sponsor[];
  };
  prizes: Prize[];
  hallOfFame: TeamEntry[];
  legacyGallery: string[];
  moments: string[];
}

export interface AttackerOverview {
  title: string;
  subtitle: string;
  description: string;
  rounds: Round[];
  rules: {
    target: string;
    registration: string;
    readiness: string;
  };
  legacy: { label: string; value: string }[];
  values: string[];
}

// ─────────────────────────────────────────────
// OVERVIEW — Thông tin tổng quan cuộc thi
// ─────────────────────────────────────────────
export const ATTACKER_OVERVIEW: AttackerOverview = {
  title: "ATTACKER",
  subtitle: "FINTECH INNOVATION CHALLENGE",
  description:
    "Cuộc thi tìm kiếm ý tưởng trong lĩnh vực Fintech dành cho sinh viên tại Việt Nam. Attacker thử thách các đội sinh viên biến ý tưởng fintech thành giải pháp rõ ràng, có thể kiểm chứng qua bài thi cá nhân, báo cáo đội và phần chấm trực tiếp.",

  rounds: [
    {
      name: "Vòng 1: Cá nhân",
      detail: "36 câu trắc nghiệm + 2 câu tự luận đánh giá kiến thức nền tảng.",
    },
    {
      name: "Vòng 2: Đội thi",
      detail: "Báo cáo mô tả dự án nhóm, thể hiện năng lực thực thi và tư duy sản phẩm.",
    },
    {
      name: "Vòng 3: Chung kết",
      detail: "Trình bày trực tiếp và bảo vệ dự án trước hội đồng giám khảo chuyên môn.",
    },
  ],

  rules: {
    target: "Sinh viên đại học/cao đẳng đam mê Fintech, Dữ liệu, Sản phẩm hoặc Khởi nghiệp.",
    registration:
      "Mỗi người dùng có một hồ sơ duy nhất, tham gia 1 đội bằng cách tạo mới hoặc nhận lời mời.",
    readiness:
      "Đội từ 3–5 thành viên mới đủ điều kiện vào Vòng 1. Xếp hạng dựa trên điểm trung bình đội.",
  },

  legacy: [
    { label: "Mùa thi đã đi qua", value: "04" },
    { label: "Thí sinh tham gia", value: "3,500+" },
    { label: "Trường Đại học", value: "100+" },
    { label: "Đối tác & Giám khảo", value: "100+" },
  ],

  values: ["Di sản nhiều mùa", "Builder Fintech sinh viên", "Gắn kết doanh nghiệp"],
};

// ─────────────────────────────────────────────
// SEASONS — Dữ liệu từng mùa thi
// ─────────────────────────────────────────────
export const ATTACKER_SEASONS: AttackerSeason[] = [
  {
    year: "2025",
    theme: "ARE YOU AN INNOVATOR? WE'RE YOUR INVESTORS.",
    journeyDescription:
      "Sức sáng tạo không giới hạn đã biến các bài toán tài chính phức tạp thành giải pháp thực tiễn.",
    banner: "/banners/banner2025.jpg",
    overview: {
      socialReach: "500,000+",
      accounts: "2,500+",
      teams: "250+",
      universities: "60+",
      successRate: "98% hài lòng",
    },
    sponsors: {
      diamond: [
        { name: "IDG", logo: "/sponsorship/IDG.jpg" },
        { name: "Sihub", logo: "/sponsorship/Sihub.jpg" },
      ],
    },
    prizes: [
      { rank: "Quán quân", value: "30.000.000đ", icon: "🏆" },
      { rank: "Á quân", value: "15.000.000đ", icon: "🥈" },
      { rank: "Quý quân", value: "10.000.000đ", icon: "🥉" },
    ],
    hallOfFame: [
      {
        name: "URAx",
        idea: "Hỏi đáp pháp lý AI",
        image: "/teams/ura.jpg",
        description:
          "Giải pháp công nghệ đột phá ứng dụng AI, giúp đơn giản hóa các thủ tục pháp lý phức tạp và tăng cường khả năng tiếp cận luật pháp cho mọi người.",
      },
      {
        name: "NFT",
        idea: "Cảnh báo rủi ro bán lẻ",
        image: "/teams/Nft.jpg",
        description:
          "Giải pháp giám sát rủi ro bán lẻ thông qua phân tích dữ liệu và trí tuệ nhân tạo.",
      },
      {
        name: "Pentagram",
        idea: "Quản lý chi tiêu thông minh",
        image: "/teams/pentagram.jpg",
        description:
          "Ứng dụng quản lý tài chính cá nhân với các tính năng thông minh và trực quan.",
      },
    ],
    legacyGallery: ["/c2025/2025_8.jpg", "/c2025/2025_11.jpg", "/c2025/2025_10.jpg"],
    moments: ["/c2025/2025_14.jpg", "/c2025/2025_1.jpg", "/c2025/2025_6.jpg"],
  },

  {
    year: "2024",
    theme: "ALGORITHMIC TRADING",
    journeyDescription:
      "Kỷ nguyên của giao dịch tự động lên ngôi, nơi tốc độ và thuật toán chính xác quyết định sự thành bại của danh mục đầu tư.",
    banner: "/banners/banner2024.jpg",
    overview: {
      socialReach: "350,000+",
      accounts: "1,800+",
      teams: "150+",
      universities: "50+",
      successRate: "95% thực tế",
    },
    sponsors: {
      diamond: [
        { name: "Yuanta Securities", logo: "/sponsorship/Yuantalogo.png" },
        { name: "Wigroup", logo: "/sponsorship/images.png" },
      ],
    },
    prizes: [
      { rank: "Quán quân", value: "10.000.000đ", icon: "🏆" },
      { rank: "Á quân", value: "8.000.000đ", icon: "🥈" },
      { rank: "Quý quân", value: "5.000.000đ", icon: "🥉" },
    ],
    hallOfFame: [
      {
        name: "Stack Overflow",
        idea: "Giao dịch động lượng tự động",
        image: "/teams/Stack-overflow.jpg",
        description:
          "Giải pháp giao dịch tự động dựa trên phân tích động lượng thị trường, giúp tối ưu hóa lợi nhuận và giảm thiểu rủi ro.",
      },
      {
        name: "NTHH",
        idea: "Kỷ luật danh mục AI",
        image: "/teams/NTHH.jpg",
        description:
          "Giải pháp quản lý danh mục đầu tư dựa trên trí tuệ nhân tạo, giúp tối ưu hóa hiệu suất và giảm thiểu rủi ro.",
      },
      {
        name: "The Bee",
        idea: "Chiến lược Hedge Fund",
        image: "/teams/the-bee.jpg",
        description:
          "Chiến lược đầu tư thông minh dựa trên phân tích dữ liệu và mô hình tài chính hiện đại.",
      },
    ],
    legacyGallery: ["/c2024/2024_12.jpg", "/c2024/2024_7.jpg", "/c2024/2024_6.jpg"],
    moments: ["/c2024/2024_10.jpg", "/c2024/2024_8.jpg", "/c2024/2024_5.jpg"],
  },

  {
    year: "2022",
    theme: "DATA ANALYSIS",
    journeyDescription:
      "Sức mạnh của dữ liệu đã biến đổi cách chúng ta hiểu và tương tác với thế giới tài chính, mở ra cơ hội mới cho sự đổi mới và phát triển.",
    banner: "/banners/banner2022.jpg",
    overview: {
      socialReach: "200,000+",
      accounts: "1,400+",
      teams: "100+",
      universities: "Toàn quốc",
      successRate: "Đột phá",
    },
    sponsors: {
      diamond: [
        { name: "SSI", logo: "/sponsorship/SSIlogo.png" },
        { name: "imap", logo: "/sponsorship/imap.jpg" },
      ],
    },
    prizes: [
      { rank: "Quán quân", value: "8.000.000đ", icon: "🏆" },
      { rank: "Á quân", value: "4.000.000đ", icon: "🥈" },
      { rank: "Quý quân", value: "2.000.000đ", icon: "🥉" },
    ],
    hallOfFame: [
      {
        name: "Forcats Factors",
        idea: "Dòng tiền SME trực tuyến",
        image: "/teams/champion_a2022.jpg",
        description:
          "Giải pháp theo dõi dòng tiền cho doanh nghiệp nhỏ và vừa thông qua công nghệ số.",
      },
      {
        name: "Attacker Attacker",
        idea: "Ví chi tiêu sinh viên",
        image: "/teams/attacker-attacker.jpg",
        description:
          "Ví điện tử dành cho sinh viên với các tính năng quản lý chi tiêu thông minh.",
      },
      {
        name: "Why always me",
        idea: "Chấm điểm tín dụng AI",
        image: "/teams/why.jpg",
        description:
          "Hệ thống chấm điểm tín dụng dựa trên trí tuệ nhân tạo, giúp đánh giá rủi ro tín dụng chính xác hơn.",
      },
    ],
    legacyGallery: ["/c2022/a2022.jpg", "/c2022/2022_2.jpg", "/c2022/2022_5.jpg"],
    moments: ["/c2022/2022_1.jpg", "/c2022/2022_7.jpg", "/c2022/2022_6.jpg"],
  },

  {
    year: "2019",
    theme: "FINTECH",
    journeyDescription:
      "Sức mạnh của công nghệ tài chính đã biến đổi cách chúng ta hiểu và tương tác với thế giới tài chính, mở ra cơ hội mới cho sự đổi mới và phát triển.",
    banner: "/banners/banner2019.jpg",
    overview: {
      socialReach: "100,000+",
      accounts: "1,000+",
      teams: "100+",
      universities: "Nội bộ & Mở rộng",
      successRate: "Ấn tượng",
    },
    sponsors: {
      diamond: [
        { name: "FTMS Global", logo: "/sponsorship/FTMS Global.jpg" },
        { name: "IAS", logo: "/sponsorship/IAS.webp" },
      ],
    },
    prizes: [
      { rank: "Quán quân", value: "6.000.000đ", icon: "🏆" },
      { rank: "Á quân", value: "4.500.000đ", icon: "🥈" },
      { rank: "Quý quân", value: "3.000.000đ", icon: "🥉" },
    ],
    hallOfFame: [
      {
        name: "3ND",
        idea: "Dự báo giá BĐS bằng mô hình RNN/LSTM",
        image: "/teams/3ND.jpg",
        description:
          "Giải pháp dự báo giá bất động sản dựa trên phân tích dữ liệu và mô hình học máy.",
      },
      {
        name: "Prey 4.0",
        idea: "Dự đoán giá chứng khoán ngắn hạn",
        image: "/teams/prey.jpg",
        description:
          "Giải pháp dự đoán giá chứng khoán dựa trên phân tích dữ liệu thị trường và mô hình học máy.",
      },
      {
        name: "The solid block",
        idea: "Blockchain trong chu trình sản xuất",
        image: "/teams/the-solid-block.jpg",
        description:
          "Giải pháp ứng dụng công nghệ Blockchain trong chu trình sản xuất, giúp tăng cường tính minh bạch và hiệu quả.",
      },
    ],
    legacyGallery: ["/c2019/a2019.jpg", "/c2019/2019_7.jpg", "/c2019/2019_9.jpg"],
    moments: ["/c2019/2019_10.jpg", "/c2019/2019_5.jpg", "/c2019/2019_2.jpg"],
  },
];