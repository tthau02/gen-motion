import "./index.css";
import { Composition, CalculateMetadataFunction } from "remotion";
import { MyComposition } from "./Composition";
import { VideoMetadata, VideoMetadataSchema } from "./types";

const calculateMetadata: CalculateMetadataFunction<VideoMetadata> = async ({
  props,
}) => {
  let totalDuration = 0;
  const scenes = props.scenes || [];
  scenes.forEach((scene, index) => {
    totalDuration += scene.durationInFrames;
    const isLast = index === scenes.length - 1;
    if (!isLast && scene.effect !== "none") {
      totalDuration -= 10; // 10 frames per transition (overlapping scenes)
    }
  });

  return {
    durationInFrames: totalDuration || 900,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VintageCinematic"
        component={MyComposition}
        durationInFrames={900}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{
          themeColor: "#c89547",
          audioUrl: "",
          scenes: [
            {
              type: "intro" as const,
              title: "REMOTION",
              subtitle: "Chương I • Định Nghĩa Mới",
              description: "Lập Trình & Thiết Kế Video Trực Tiếp Bằng React",
              imageUrl:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "fade" as const,
            },
            {
              type: "react" as const,
              title: "Sức Mạnh Từ React",
              subtitle: "Thiết Kế Linh Hoạt",
              description:
                "Tự do sử dụng các Component, State, Props và toàn bộ hệ sinh thái khổng lồ từ NPM. Video của bạn giờ đây là một ứng dụng Web chất lượng cao, có thể lập trình được.",
              imageUrl:
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "slide-left" as const,
              customProps: {
                codeSnippet:
                  'import React from "react";\nimport { Sequence } from "remotion";\n\nexport const MyVideo = () => {\n  return (\n    <Sequence>\n      <div className="text-gold">Chào mừng Remotion</div>\n    </Sequence>\n  );\n};',
              },
            },
            {
              type: "precision" as const,
              title: "Chính Xác Khung Hình",
              subtitle: "Độ Trễ Bằng Không",
              description:
                "Kết xuất video hoàn toàn khớp nhạc, đồng bộ âm thanh và hình ảnh tuyệt đối. Nói lời tạm biệt với hiện tượng giật lag hay mất khung hình khi render sản phẩm cuối.",
              imageUrl:
                "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "fade" as const,
            },
            {
              type: "audio" as const,
              title: "Hiệu Ứng Sóng Nhạc",
              subtitle: "Đồng Bộ Âm Thanh",
              description:
                "Hỗ trợ bộ công cụ phân tích tần số âm thanh động. Bạn có thể dễ dàng thiết kế các cột sóng nhạc nhịp điệu hay hiệu ứng đồ họa co giãn theo âm bass trực quan.",
              imageUrl:
                "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "slide-right" as const,
            },
            {
              type: "scale" as const,
              title: "Tự Động Hóa Quy Mô",
              subtitle: "Khả Năng Mở Rộng",
              description:
                "Tạo hàng ngàn video cá nhân hóa chỉ trong chốc lát. Tích hợp trơn tru hệ thống CI/CD để render tự động thông qua các nền tảng serverless hoặc Node APIs tiện lợi.",
              imageUrl:
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "fade" as const,
            },
            {
              type: "transitions" as const,
              title: "Bộ Lọc & Chuyển Cảnh",
              subtitle: "Mỹ Thuật Điện Ảnh",
              description:
                "Tích hợp sẵn hàng loạt hiệu ứng chuyển tiếp như slide, fade, wipe, hay các bộ lọc ánh sáng rò rỉ (light leaks) nghệ thuật mang cảm hứng cổ điển đầy khác biệt.",
              imageUrl:
                "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "slide-left" as const,
            },
            {
              type: "performance" as const,
              title: "Kết Xuất Siêu Tốc",
              subtitle: "Hiệu Suất Vượt Trội",
              description:
                "Tận dụng tối đa sức mạnh của CPU đa nhân cục bộ hoặc song song hóa quy trình kết xuất với hàng ngàn máy chủ Cloud để hoàn thành video dài chỉ trong vài giây.",
              imageUrl:
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 120,
              effect: "fade" as const,
            },
            {
              type: "outro" as const,
              title: "Kiến Tạo Cùng Remotion",
              subtitle: "Khám Phá Sức Sáng Tạo",
              description: "remotion.dev • mã nguồn mở",
              imageUrl:
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&h=720&q=80",
              durationInFrames: 130,
              effect: "none" as const,
              customProps: { terminalCommand: "npx create-video@latest" },
            },
          ],
        }}
        calculateMetadata={calculateMetadata}
        schema={VideoMetadataSchema}
      />
    </>
  );
};
